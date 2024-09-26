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

let queryClient: QueryClient;

const renderVurderingHistorikk = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => vurderinger
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
    const oppfyltCreated = daysFromToday(50);
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
        `Ikke aktuell - ${tilDatoMedManedNavn(ikkeAktuellCreated)}`
      );
      expect(accordionButtons[1].textContent).to.contain(
        `Stans - ${tilDatoMedManedNavn(stansCreated)}`
      );
      expect(accordionButtons[2].textContent).to.contain(
        `Forhåndsvarsel - ${tilDatoMedManedNavn(forhandsvarselCreated)}`
      );
      expect(accordionButtons[3].textContent).to.contain(
        `Oppfylt - ${tilDatoMedManedNavn(oppfyltCreated)}`
      );
      expect(accordionButtons[4].textContent).to.contain(
        `Unntak - ${tilDatoMedManedNavn(oppfyltCreated)}`
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
});
