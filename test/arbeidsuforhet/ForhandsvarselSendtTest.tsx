import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ForhandsvarselSendt from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import { VurderingResponseDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { addWeeks, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { createForhandsvarsel } from "./arbeidsuforhetTestData";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";

let queryClient: QueryClient;

const renderForhandsvarselSendt = (forhandsvarsel: VurderingResponseDTO) => {
  renderArbeidsuforhetSide(
    queryClient,
    <ForhandsvarselSendt forhandsvarsel={forhandsvarsel} />,
    arbeidsuforhetPath,
    [arbeidsuforhetPath]
  );
};

describe("ForhandsvarselSendt", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Show correct component", () => {
    it("show ForhandsvarselBeforeDeadline when svarfrist is in three weeks (not expired)", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });

      renderForhandsvarselSendt(forhandsvarselBeforeFrist);

      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
      expect(screen.getByText("Fristen går ut:")).to.exist;
      expect(
        screen.getByText(
          "Velg Ikke aktuell-knappen hvis personen har blitt friskmeldt eller fått vedtak om § 8-5 Friskmelding til arbeidsformidling etter at forhåndsvarselet ble sendt ut."
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Dersom du har mottatt nye opplysninger og vurdert at bruker likevel oppfyller § 8-4, klikker du på Oppfylt-knappen."
        )
      ).to.exist;
      expect(screen.getByText("Du kan ikke avslå før fristen er gått ut.")).to
        .exist;
      expect(screen.getByRole("img", { name: "klokkeikon" })).to.exist;
      expect(
        screen.getByRole("button", { name: "Skriv innstilling om avslag" })
      ).to.have.property("disabled", true);
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Ikke aktuell" })).to.exist;
    });

    it("show ForhandsvarselAfterDeadline when svarfrist is today (expired)", () => {
      const createdAt = addWeeks(new Date(), -3);
      const forhandsvarselAfterFrist = createForhandsvarsel({
        createdAt: createdAt,
        svarfrist: new Date(),
      });

      renderForhandsvarselSendt(forhandsvarselAfterFrist);

      expect(screen.getByText("Fristen er gått ut")).to.exist;
      expect(screen.getByText("Fristen var:")).to.exist;
      expect(
        screen.getByText(
          "Velg Ikke aktuell-knappen hvis personen har blitt friskmeldt eller fått vedtak om § 8-5 Friskmelding til arbeidsformidling etter at forhåndsvarselet ble sendt ut."
        )
      ).to.exist;
      expect(screen.getByText(tilLesbarDatoMedArUtenManedNavn(new Date()))).to
        .exist;
      expect(screen.getByRole("img", { name: "bjelleikon" })).to.exist;
      expect(
        screen.getByText(
          `Fristen for forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
            createdAt
          )} er gått ut. Trykk på Innstilling om avslag-knappen hvis vilkårene i § 8-4 ikke er oppfylt og rett til videre sykepenger skal avslås.`
        )
      ).to.exist;
      expect(
        screen.getByRole("button", { name: "Skriv innstilling om avslag" })
      ).to.exist;
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Ikke aktuell" })).to.exist;
    });
  });
});
