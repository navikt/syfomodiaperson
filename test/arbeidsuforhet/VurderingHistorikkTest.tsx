import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "@/mocks/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { VurderingHistorikk } from "@/sider/arbeidsuforhet/historikk/VurderingHistorikk";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createForhandsvarsel,
  createVurdering,
} from "./arbeidsuforhetTestData";
import {
  VurderingArsak,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { daysFromToday } from "../testUtils";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import userEvent from "@testing-library/user-event";
import { pengestoppStatusQueryKeys } from "@/data/pengestopp/pengestoppQueryHooks";
import {
  Sykepengestopp,
  ValidSykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";
import { defaultSykepengestopp } from "@/mocks/ispengestopp/pengestoppStatusMock";

let queryClient: QueryClient;

const renderVurderingHistorikk = (
  vurderinger: VurderingResponseDTO[],
  statuser: Sykepengestopp[] = []
) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
  queryClient.setQueryData(
    pengestoppStatusQueryKeys.pengestoppStatus(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => statuser
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <VurderingHistorikk />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("VurderingHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  describe("uten tidligere vurderinger", () => {
    it("viser tekst om ingen tidligere vurderinger", () => {
      renderVurderingHistorikk([]);

      expect(
        screen.queryByText(
          "Tidligere vurderinger av §8-4 arbeidsuførhet i Modia"
        )
      ).to.not.exist;
      expect(
        screen.getByText(
          "Det finnes ingen tidligere vurderinger av §8-4 arbeidsuførhet i Modia"
        )
      ).to.exist;
    });
  });
  describe("med tidligere vurderinger", () => {
    const oppfyltCreated = daysFromToday(50);
    const oppfylt = createVurdering({
      type: VurderingType.OPPFYLT,
      createdAt: oppfyltCreated,
      begrunnelse: "Rett på sykepenger",
    });
    const forhandsvarselCreated = daysFromToday(20);
    const forhandsvarsel = createForhandsvarsel({
      createdAt: forhandsvarselCreated,
      svarfrist: new Date(),
    });
    const avslagCreated = new Date();
    const avslag = createVurdering({
      type: VurderingType.AVSLAG,
      createdAt: avslagCreated,
      begrunnelse: "Ikke rett på sykepenger",
    });
    const ikkeAktuellCreated = daysFromToday(10);
    const ikkeAktuell = createVurdering({
      type: VurderingType.IKKE_AKTUELL,
      createdAt: ikkeAktuellCreated,
      begrunnelse: "",
      arsak: VurderingArsak.FRISKMELDING_TIL_ARBEIDSFORMIDLING,
    });

    it("viser tekst om tidligere vurderinger", () => {
      renderVurderingHistorikk([avslag, forhandsvarsel, oppfylt]);

      expect(
        screen.queryByText(
          "Det finnes ingen tidligere vurderinger av §8-4 arbeidsuførhet i Modia"
        )
      ).to.not.exist;
      expect(
        screen.getByText("Tidligere vurderinger av §8-4 arbeidsuførhet i Modia")
      ).to.exist;
    });

    it("viser klikkbar overskrift med type og dato for hver vurdering", () => {
      renderVurderingHistorikk([ikkeAktuell, avslag, forhandsvarsel, oppfylt]);

      const vurderingButtons = screen.getAllByRole("button");

      expect(vurderingButtons[0].textContent).to.contain(
        `Oppfylt - ${tilDatoMedManedNavn(oppfyltCreated)}`
      );
      expect(vurderingButtons[1].textContent).to.contain(
        `Forhåndsvarsel - ${tilDatoMedManedNavn(forhandsvarselCreated)}`
      );
      expect(vurderingButtons[2].textContent).to.contain(
        `Ikke aktuell - ${tilDatoMedManedNavn(ikkeAktuellCreated)}`
      );
      expect(vurderingButtons[3].textContent).to.contain(
        `Innstilling om avslag - ${tilDatoMedManedNavn(avslagCreated)}`
      );
    });

    it("klikk på overskrift viser begrunnelse, veileder og knapp for å se document for vurderingen", async () => {
      renderVurderingHistorikk([oppfylt]);

      const vurderingButton = screen.getByRole("button");

      await userEvent.click(vurderingButton);

      expect(screen.getByText("Begrunnelse")).to.exist;
      expect(screen.getByText(oppfylt.begrunnelse)).to.exist;
      expect(screen.getByText("Vurdert av")).to.exist;
      expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
      expect(screen.getByRole("button", { name: "Se oppfylt vurdering" })).to
        .exist;
    });

    it("klikk på ikke-aktuell viser årsak og veileder for vurderingen", async () => {
      renderVurderingHistorikk([ikkeAktuell]);

      const vurderingButton = screen.getByRole("button");

      await userEvent.click(vurderingButton);

      expect(screen.queryByText("Begrunnelse")).to.not.exist;
      expect(screen.getByText("Vurdert av")).to.exist;
      expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
    });
  });
  describe("Har vurderinger og sykepengestopp", () => {
    it("Viser forekomster av vurderinger og sykepengestopp sortert på dato i synkende rekkefølge", () => {
      const sykepengestoppList: Sykepengestopp[] = [
        {
          ...defaultSykepengestopp,
          opprettet: "2025-02-20T08:00:00.000Z",
          arsakList: [{ type: ValidSykepengestoppArsakType.MEDISINSK_VILKAR }],
        },
        {
          ...defaultSykepengestopp,
          opprettet: "2025-02-21T08:00:00.000Z",
          arsakList: [{ type: ValidSykepengestoppArsakType.AKTIVITETSKRAV }],
        },
      ];

      const vurderinger: VurderingResponseDTO[] = [
        createVurdering({
          type: VurderingType.FORHANDSVARSEL,
          begrunnelse: "begrunnelse",
          createdAt: new Date("2025-02-15T08:00:00.000Z"),
        }),
        createVurdering({
          type: VurderingType.AVSLAG,
          begrunnelse: "begrunnelse",
          createdAt: new Date("2025-02-16T08:00:00.000Z"),
        }),
        createVurdering({
          type: VurderingType.FORHANDSVARSEL,
          begrunnelse: "begrunnelse",
          createdAt: new Date("2025-02-21T08:00:00.000Z"),
        }),
        createVurdering({
          type: VurderingType.AVSLAG,
          begrunnelse: "begrunnelse",
          createdAt: new Date("2025-02-22T08:00:00.000Z"),
        }),
      ];

      renderVurderingHistorikk(vurderinger, sykepengestoppList);

      const accordionButtons = screen.getAllByRole("button");

      expect(accordionButtons.length).toBe(5);

      expect(accordionButtons[0].textContent).to.contain(
        "Innstilling om avslag - 22. februar 2025"
      );
      expect(accordionButtons[1].textContent).to.contain(
        "Forhåndsvarsel - 21. februar 2025"
      );
      expect(accordionButtons[2].textContent).to.contain(
        "Automatisk utbetaling stanset - 20. februar 2025"
      );
      expect(accordionButtons[3].textContent).to.contain(
        "Innstilling om avslag - 16. februar 2025"
      );
      expect(accordionButtons[4].textContent).to.contain(
        "Forhåndsvarsel - 15. februar 2025"
      );
    });
  });
});
