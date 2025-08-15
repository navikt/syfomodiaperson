import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { VurderingResponseDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { addWeeks } from "@/utils/datoUtils";
import { createForhandsvarsel } from "./arbeidsuforhetTestData";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";
import OppfyltForm from "@/sider/arbeidsuforhet/oppfylt/OppfyltForm";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import {
  getOppfyltDocument,
  getOppfyltEtterForhandsvarselDocument,
} from "./documents";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

function renderOppfyltForm() {
  renderArbeidsuforhetSide(
    queryClient,
    <OppfyltForm />,
    arbeidsuforhetOppfyltPath,
    [arbeidsuforhetOppfyltPath]
  );
}

describe("OppfyltSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Gives error when trying to send vurdering without begrunnelse", async () => {
    renderOppfyltForm();

    await clickButton("Journalfør innstilling");

    expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
  });

  it("shows textarea and buttons", () => {
    const begrunnelseLabel = "Begrunnelse (obligatorisk)";

    renderOppfyltForm();

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
    expect(screen.getByRole("button", { name: "Journalfør innstilling" })).to
      .exist;
    expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
  });

  it("Forhåndsvis brev with begrunnelse", async () => {
    const begrunnelse = "Dette er en begrunnelse!";
    renderOppfyltForm();
    const begrunnelseLabel = "Begrunnelse (obligatorisk)";
    const begrunnelseInput = getTextInput(begrunnelseLabel);

    changeTextInput(begrunnelseInput, begrunnelse);
    await clickButton("Forhåndsvisning");

    const forhandsvisningVurdering = screen.getAllByRole("dialog", {
      hidden: true,
    })[0];
    expect(
      within(forhandsvisningVurdering).getByRole("heading", {
        name: "Vilkår i § 8-4 er oppfylt",
        hidden: true,
      })
    ).to.exist;
    const docs = getOppfyltDocument(begrunnelse);
    docs
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
      });
  });

  describe("When last vurdering is a forhandsvarsel", () => {
    beforeEach(() => {
      const forhandsvarsel = createForhandsvarsel({
        createdAt: addWeeks(new Date(), -12),
        svarfrist: new Date(),
      });
      const vurderinger = [forhandsvarsel];
      mockArbeidsuforhetVurderinger(vurderinger);
    });

    it("viser informasjon for oppfylt vurdering etter forhåndsvarsel", () => {
      renderOppfyltForm();
      expect(
        screen.queryByText(
          "Skriv en kort begrunnelse for hvorfor bruker likevel oppfyller vilkårene i § 8-4, og hvilke opplysninger som ligger til grunn for vurderingen."
        )
      );
      expect(screen.getByText("Før du går videre bør du gjøre følgende:")).to
        .exist;
      expect(screen.getByText("Informere bruker om utfallet av vurderingen."))
        .to.exist;
      expect(
        screen.getByText(
          "Besvare Gosys-oppgaven dersom Nav Arbeid og ytelser ba om vurderingen."
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Journalfør innstilling" })).to
        .exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });

    it("show form if latest arbeidsuforhet status is forhandsvarsel and frist is utgatt", () => {
      renderOppfyltForm();

      expect(
        screen.getByText(
          "Skriv en kort begrunnelse for hvorfor bruker likevel oppfyller vilkårene i § 8-4, og hvilke opplysninger som ligger til grunn for vurderingen."
        )
      ).to.exist;
    });

    it("show form if latest arbeidsuforhet status is forhandsvarsel and frist is not utgatt", () => {
      renderOppfyltForm();

      expect(
        screen.getByText(
          "Skriv en kort begrunnelse for hvorfor bruker likevel oppfyller vilkårene i § 8-4, og hvilke opplysninger som ligger til grunn for vurderingen."
        )
      ).to.exist;
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderOppfyltForm();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(begrunnelseInput, begrunnelse);
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
      getOppfyltEtterForhandsvarselDocument(begrunnelse)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });
  });
});
