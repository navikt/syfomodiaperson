import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import { render, screen, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { daysFromToday } from "../testUtils";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import userEvent from "@testing-library/user-event";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import ManglendeMedvirkningHistorikk from "@/sider/manglendemedvirkning/ManglendeMedvirkningHistorikk";
import {
  createManglendeMedvirkningVurdering,
  defaultForhandsvarselVurdering,
} from "./manglendeMedvirkningTestData";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "@/mocks/common/mockConstants";
import {
  Sykepengestopp,
  ValidSykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";
import { pengestoppStatusQueryKeys } from "@/data/pengestopp/pengestoppQueryHooks";
import { defaultSykepengestopp } from "@/mocks/ispengestopp/pengestoppStatusMock";

let queryClient: QueryClient;

const renderVurderingHistorikk = (
  vurderinger: VurderingResponseDTO[],
  sykepengestoppList: Sykepengestopp[] = []
) => {
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => vurderinger
  );
  queryClient.setQueryData(
    pengestoppStatusQueryKeys.pengestoppStatus(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => sykepengestoppList
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <ManglendeMedvirkningHistorikk />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("ManglendeMedvirkningHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  describe("uten tidligere vurderinger", () => {
    it("viser tekst om ingen tidligere vurderinger", () => {
      renderVurderingHistorikk([]);

      expect(
        screen.queryByText(
          "Tidligere vurderinger av § 8-8 medvirkningsplikten i Modia."
        )
      ).to.not.exist;
      expect(
        screen.getByText(
          "Det finnes ingen tidligere vurderinger av § 8-8 medvirkningsplikten i Modia."
        )
      ).to.exist;
    });
  });
  describe("med tidligere vurderinger", () => {
    const oppfyltCreated = daysFromToday(55);
    const oppfylt = createManglendeMedvirkningVurdering(
      VurderingType.OPPFYLT,
      oppfyltCreated,
      "Her er en begrunnelse"
    );
    const forhandsvarselCreated = daysFromToday(20);
    const forhandsvarsel = {
      ...defaultForhandsvarselVurdering,
      createdAt: forhandsvarselCreated,
    };
    const stansCreated = new Date();
    const stans = createManglendeMedvirkningVurdering(
      VurderingType.STANS,
      stansCreated
    );
    const ikkeAktuellCreated = daysFromToday(10);
    const ikkeAktuell = createManglendeMedvirkningVurdering(
      VurderingType.IKKE_AKTUELL,
      ikkeAktuellCreated
    );
    const unntakCreated = daysFromToday(50);
    const unntak = createManglendeMedvirkningVurdering(
      VurderingType.UNNTAK,
      unntakCreated
    );

    it("viser tekst om tidligere vurderinger", () => {
      renderVurderingHistorikk([stans, forhandsvarsel, oppfylt]);

      expect(
        screen.queryByText(
          "Det finnes ingen tidligere vurderinger av § 8-8 medvirkningsplikten i Modia."
        )
      ).to.not.exist;
      expect(
        screen.getByText(
          "Tidligere vurderinger av § 8-8 medvirkningsplikten i Modia."
        )
      ).to.exist;
    });

    it("viser klikkbar overskrift med type og dato for hver vurdering", () => {
      renderVurderingHistorikk([
        ikkeAktuell,
        stans,
        forhandsvarsel,
        oppfylt,
        unntak,
      ]);

      const accordionButtons = screen.getAllByRole("button");

      expect(accordionButtons[0].textContent).to.contain(
        `Oppfylt - ${tilDatoMedManedNavn(oppfyltCreated)}`
      );
      expect(accordionButtons[1].textContent).to.contain(
        `Unntak - ${tilDatoMedManedNavn(unntakCreated)}`
      );
      expect(accordionButtons[2].textContent).to.contain(
        `Forhåndsvarsel - ${tilDatoMedManedNavn(forhandsvarselCreated)}`
      );
      expect(accordionButtons[3].textContent).to.contain(
        `Ikke aktuell - ${tilDatoMedManedNavn(ikkeAktuellCreated)}`
      );
      expect(accordionButtons[4].textContent).to.contain(
        `Innstilling om stans - ${tilDatoMedManedNavn(stansCreated)}`
      );
    });

    it("klikk på overskriften til en oppfylt vurdering og viser begrunnelse, veileder og knapp for å se document for vurderingen", async () => {
      renderVurderingHistorikk([oppfylt]);

      const accordionButton = screen.getByRole("button");

      await userEvent.click(accordionButton);

      expect(screen.getByText("Begrunnelse")).to.exist;
      expect(screen.getByText(oppfylt.begrunnelse)).to.exist;
      expect(screen.getByText("Vurdert av")).to.exist;
      expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
      expect(screen.getByRole("button", { name: "Se oppfylt vurdering" })).to
        .exist;
    });

    it("klikk på overskriften til en forhåndsvarsel vurdering og viser begrunnelse, veileder og knapp for å se document for vurderingen", async () => {
      renderVurderingHistorikk([forhandsvarsel]);

      const accordionButton = screen.getByRole("button");

      await userEvent.click(accordionButton);

      expect(screen.getByText("Svarfrist i forhåndsvarselet")).to.exist;
      expect(
        screen.getByText(tilDatoMedManedNavn(forhandsvarsel.varsel?.svarfrist))
      ).to.exist;
      expect(screen.getByText("Begrunnelse")).to.exist;
      expect(screen.getByText(forhandsvarsel.begrunnelse)).to.exist;
      expect(screen.getByText("Vurdert av")).to.exist;
      expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;

      const documentButton = screen.getByRole("button", {
        name: "Se sendt forhåndsvarsel",
      });
      expect(documentButton).to.exist;

      await userEvent.click(documentButton);

      const previewModal = screen.getByRole("dialog", { hidden: true });

      expect(
        within(previewModal).getByRole("heading", {
          name: "Varsel om mulig stans av sykepenger",
          hidden: true,
        })
      ).to.exist;
    });

    it("klikk på overskriften til et stans vurdering og viser knapp for å se document for vurderingen", async () => {
      renderVurderingHistorikk([stans]);

      const accordionButton = screen.getByRole("button");

      await userEvent.click(accordionButton);

      expect(screen.getByRole("button", { name: "Se innstilling om stans" })).to
        .exist;
    });

    it("klikk på overskriften til et unntak vurdering og viser knapp for å se document for vurderingen", async () => {
      renderVurderingHistorikk([unntak]);

      const accordionButton = screen.getByRole("button");

      await userEvent.click(accordionButton);

      expect(screen.getByRole("button", { name: "Se unntak" })).to.exist;
    });

    it("klikk på overskriften til en ikke aktuell vurdering og viser knapp for å se document for vurderingen", async () => {
      renderVurderingHistorikk([ikkeAktuell]);

      const accordionButton = screen.getByRole("button");

      await userEvent.click(accordionButton);

      expect(screen.getByRole("button", { name: "Se ikke aktuell vurdering" }))
        .to.exist;
    });
  });
  describe("Har vurderinger og sykepengestopp", () => {
    it("Viser forekomster av vurderinger og sykepengestopp sortert på dato i synkende rekkefølge", () => {
      const sykepengestoppList: Sykepengestopp[] = [
        {
          ...defaultSykepengestopp,
          opprettet: "2025-02-20T08:00:00.000Z",
          arsakList: [
            { type: ValidSykepengestoppArsakType.MANGLENDE_MEDVIRKING },
          ],
        },
        {
          ...defaultSykepengestopp,
          opprettet: "2025-02-21T08:00:00.000Z",
          arsakList: [{ type: ValidSykepengestoppArsakType.AKTIVITETSKRAV }],
        },
      ];

      const vurderinger: VurderingResponseDTO[] = [
        createManglendeMedvirkningVurdering(
          VurderingType.FORHANDSVARSEL,
          new Date("2025-02-15T08:00:00.000Z")
        ),
        createManglendeMedvirkningVurdering(
          VurderingType.STANS,
          new Date("2025-02-16T08:00:00.000Z")
        ),
        createManglendeMedvirkningVurdering(
          VurderingType.FORHANDSVARSEL,
          new Date("2025-02-21T08:00:00.000Z")
        ),
        createManglendeMedvirkningVurdering(
          VurderingType.STANS,
          new Date("2025-02-22T08:00:00.000Z")
        ),
      ];

      renderVurderingHistorikk(vurderinger, sykepengestoppList);

      const accordionButtons = screen.getAllByRole("button");

      expect(accordionButtons.length).toBe(5);

      expect(accordionButtons[0].textContent).to.contain(
        "Innstilling om stans - 22. februar 2025"
      );
      expect(accordionButtons[1].textContent).to.contain(
        "Forhåndsvarsel - 21. februar 2025"
      );
      expect(accordionButtons[2].textContent).to.contain(
        "Automatisk utbetaling stanset - 20. februar 2025"
      );
      expect(accordionButtons[3].textContent).to.contain(
        "Innstilling om stans - 16. februar 2025"
      );
      expect(accordionButtons[4].textContent).to.contain(
        "Forhåndsvarsel - 15. februar 2025"
      );
    });
  });
});
