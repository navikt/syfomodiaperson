import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { screen, waitFor, within } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import {
  changeTextInput,
  clickButton,
  daysFromToday,
  getTextInput,
} from "../testUtils";
import { OppfyltForm } from "@/sider/arbeidsuforhet/oppfylt/OppfyltForm";
import { getOppfyltVurderingDocument } from "./documents";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";

let queryClient: QueryClient;

const forhandsvarselDato = daysFromToday(-40);
const enBegrunnelse = "Dette er en begrunnelse!";

const renderOppfyltForm = (forhandsvarselSendtDato?: Date) => {
  renderArbeidsuforhetSide(
    queryClient,
    <OppfyltForm forhandsvarselSendtDato={forhandsvarselSendtDato} />,
    arbeidsuforhetOppfyltPath,
    [arbeidsuforhetOppfyltPath]
  );
};

describe("OppfyltForm", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Form components", () => {
    it("shows textarea and buttons", () => {
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      renderOppfyltForm(forhandsvarselDato);

      expect(screen.getByText(begrunnelseLabel)).to.exist;
      expect(
        screen.getByText(
          "Åpne forhåndsvisning for å se vurderingen. Når du trykker Lagre journalføres vurderingen automatisk."
        )
      ).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: begrunnelseLabel,
        })
      ).to.exist;
      expect(screen.getByText("Før du går videre bør du gjøre følgende:")).to
        .exist;
      expect(screen.getByText("Informere bruker om utfallet av vurderingen."))
        .to.exist;
      expect(
        screen.getByText(
          "Besvare Gosys-oppgaven dersom Nav Arbeid og ytelser ba om vurderingen."
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Lagre" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });
  });

  describe("Send vurdering (etter forhåndsvarsel)", () => {
    it("Gives error when trying to send vurdering without begrunnelse", async () => {
      renderOppfyltForm(forhandsvarselDato);

      await clickButton("Lagre");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send vurdering with begrunnelse filled in, without reseting the form", async () => {
      renderOppfyltForm(forhandsvarselDato);
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const berunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(berunnelseInput, enBegrunnelse);
      await clickButton("Lagre");

      await waitFor(() => {
        const useSendVurderingArbeidsuforhet = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: VurderingRequestDTO = {
          type: VurderingType.OPPFYLT,
          begrunnelse: enBegrunnelse,
          document: getOppfyltVurderingDocument(
            enBegrunnelse,
            forhandsvarselDato
          ),
        };
        expect(useSendVurderingArbeidsuforhet.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
      expect(screen.queryByText(enBegrunnelse)).to.exist;
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      renderOppfyltForm(forhandsvarselDato);
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(begrunnelseInput, enBegrunnelse);
      await clickButton("Forhåndsvisning");

      const forhandsvisningVurdering = screen.getAllByRole("dialog", {
        hidden: true,
      })[0];
      expect(
        within(forhandsvisningVurdering).getByRole("heading", {
          name: "Du har rett til videre utbetaling av sykepenger",
          hidden: true,
        })
      ).to.exist;
      getOppfyltVurderingDocument(enBegrunnelse, forhandsvarselDato)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });
  });

  describe("Send vurdering (uten forhåndsvarsel)", () => {
    it("Sends vurdering with expected document", async () => {
      renderOppfyltForm();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const berunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(berunnelseInput, enBegrunnelse);
      await clickButton("Lagre");

      await waitFor(() => {
        const useSendVurderingArbeidsuforhet = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: VurderingRequestDTO = {
          type: VurderingType.OPPFYLT,
          begrunnelse: enBegrunnelse,
          document: getOppfyltVurderingDocument(enBegrunnelse, undefined),
        };
        expect(useSendVurderingArbeidsuforhet.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
    });
  });
});
