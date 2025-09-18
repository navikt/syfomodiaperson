import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  Avslag,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";
import { AvslagForm } from "@/sider/arbeidsuforhet/avslag/AvslagForm";
import { queryClientWithMockData } from "../../testQueryClient";
import { changeTextInput, clickButton, getTextInput } from "../../testUtils";
import { getAvslagVurderingDocument } from "../documents";
import { addWeeks, toDatePrettyPrint } from "@/utils/datoUtils";
import { renderArbeidsuforhetSide } from "../arbeidsuforhetTestUtils";
import { createForhandsvarsel } from "../arbeidsuforhetTestData";
import dayjs from "dayjs";

let queryClient: QueryClient;

const sisteForhandsvarsel = createForhandsvarsel({
  createdAt: addWeeks(new Date(), -3),
  svarfrist: new Date(),
});

const renderAvslagForm = () => {
  renderArbeidsuforhetSide(
    queryClient,
    <AvslagForm sisteVurdering={sisteForhandsvarsel} />,
    arbeidsuforhetOppfyltPath,
    [arbeidsuforhetOppfyltPath]
  );
};

describe("AvslagForm", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Form components", () => {
    it("shows date picker, textarea, and buttons", () => {
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      renderAvslagForm();

      expect(
        screen.getByText(
          "Skriv innstilling om avslag til Nav arbeid og ytelser"
        )
      ).to.exist;
      expect(screen.getByText("Innstillingen gjelder fra")).to.exist;
      expect(
        screen.getByText("Skriv kort hvilke opplysninger", { exact: false })
      ).to.exist;
      expect(
        screen.getByText("friskmelding til arbeidsformidling:", {
          exact: false,
        })
      ).to.exist;
      expect(screen.getByText(begrunnelseLabel)).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: begrunnelseLabel,
        })
      ).to.exist;
      expect(screen.getByText("Videre må du huske å:")).to.exist;
      expect(
        screen.getByText(
          "Sende beskjed i Gosys til Nav Arbeid og Ytelser. Dette er for å gjøre saksbehandler oppmerksom på at det har kommet en innstilling og at utbetalingen skal stanses."
        )
      ).to.exist;
      expect(screen.getByText("Tema: Sykepenger")).to.exist;
      expect(screen.getByText("Oppgavetype: Vurder konsekvens for ytelse")).to
        .exist;
      expect(screen.getByText("Gjelder: Behandle vedtak")).to.exist;
      expect(screen.getByText("Prioritet: Høy")).to.exist;
      expect(
        screen.getByText(
          "Send innstilling om avslag og stans automatisk utbetaling"
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.getByRole("button", { name: "Avbryt" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });
  });

  describe("Send avslag", () => {
    it("Gives errors when trying to send vurdering without date and begrunnelse", async () => {
      renderAvslagForm();

      await clickButton("Send");

      expect(await screen.findByText("Vennligst angi dato")).to.exist;
      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send vurdering with date and begrunnelse filled in, without reseting the form", async () => {
      renderAvslagForm();
      const begrunnelse = "Dette er en begrunnelse!";
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const fristDate = new Date(Date.now());
      const dateLabel = "Innstillingen gjelder fra";
      const dateInput = getTextInput(dateLabel);
      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(dateInput, toDatePrettyPrint(fristDate) as string);
      changeTextInput(begrunnelseInput, begrunnelse);
      await clickButton("Send");

      await waitFor(() => {
        const useSendVurderingArbeidsuforhet = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: Avslag = {
          type: VurderingType.AVSLAG,
          begrunnelse: begrunnelse,
          document: getAvslagVurderingDocument(
            begrunnelse,
            fristDate,
            sisteForhandsvarsel.createdAt
          ),
          gjelderFom: dayjs(fristDate).format("YYYY-MM-DD"),
        };
        expect(useSendVurderingArbeidsuforhet.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      renderAvslagForm();
      const begrunnelse = "Dette er en begrunnelse!";
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const fristDate = new Date(Date.now());
      const dateLabel = "Innstillingen gjelder fra";
      const dateInput = getTextInput(dateLabel);
      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(dateInput, toDatePrettyPrint(fristDate) as string);
      changeTextInput(begrunnelseInput, begrunnelse);

      await clickButton("Forhåndsvisning");

      const forhandsvisningVurdering = screen.getAllByRole("dialog", {
        hidden: true,
      })[1];
      expect(
        within(forhandsvisningVurdering).getByRole("heading", {
          name: "Vurdering av § 8-4 - Innstilling om avslag",
          hidden: true,
        })
      ).to.exist;
      getAvslagVurderingDocument(
        begrunnelse,
        fristDate,
        sisteForhandsvarsel.createdAt
      )
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });
  });
});
