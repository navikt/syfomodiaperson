import { screen, waitFor, within } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { expect, describe, it, beforeEach } from "vitest";
import { stubArbeidsuforhetForhandsvarselApi } from "../stubs/stubIsarbeidsuforhet";
import {
  VurderingRequestDTO,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { getSendForhandsvarselDocument } from "./documents";
import { queryClientWithMockData } from "../testQueryClient";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";
import { arbeidsuforhetForhandsvarselPath } from "@/routers/AppRouter";
import { ArbeidsuforhetForhandsvarsel } from "@/sider/arbeidsuforhet/forhandsvarsel/ArbeidsuforhetForhandsvarsel";
import { createForhandsvarsel } from "./arbeidsuforhetTestData";
import { addWeeks } from "@/utils/datoUtils";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderForhandsvarselSide = () =>
  renderArbeidsuforhetSide(
    queryClient,
    <ArbeidsuforhetForhandsvarsel />,
    arbeidsuforhetForhandsvarselPath,
    [arbeidsuforhetForhandsvarselPath]
  );

describe("ForhandsvarselSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("sent forhandsvarsel page", () => {
    it("show if status is forhandsvarsel and frist is not utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderForhandsvarselSide();

      expect(screen.queryByRole("heading", { name: "Send forhåndsvarsel" })).to
        .not.exist;
      expect(screen.queryByRole("button", { name: "Send" })).to.not.exist;
      expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
      expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
    });

    it("show if status is forhandsvarsel and frist is utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), -3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderForhandsvarselSide();

      expect(screen.queryByRole("heading", { name: "Send forhåndsvarsel" })).to
        .not.exist;
      expect(screen.queryByRole("button", { name: "Send" })).to.not.exist;
      expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
      expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
      expect(screen.getByText("Fristen er gått ut")).to.exist;
    });

    it("show send forhåndsvarsel skjema if no forhandsvarsel", () => {
      mockArbeidsuforhetVurderinger([]);

      renderForhandsvarselSide();

      expect(screen.getByRole("heading", { name: "Send forhåndsvarsel" })).to
        .exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
    });
  });

  describe("Send forhåndsvarsel", () => {
    it("Gives error when trying to send forhandsvarsel without changing default begrunnelse", async () => {
      renderForhandsvarselSide();

      await clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Gives error when trying to send forhandsvarsel with no begrunnelse", async () => {
      renderForhandsvarselSide();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const beskrivelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(beskrivelseInput, "");

      await clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send forhåndsvarsel with begrunnelse filled in, without reseting the form", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderForhandsvarselSide();
      stubArbeidsuforhetForhandsvarselApi();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      expect(
        screen.getByRole("heading", {
          name: "Send forhåndsvarsel",
        })
      ).to.exist;

      expect(screen.getByRole("textbox", { name: begrunnelseLabel })).to.exist;
      expect(screen.getByText("Forhåndsvisning")).to.exist;

      const beskrivelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(beskrivelseInput, begrunnelse);

      await clickButton("Send");

      await waitFor(() => {
        const sendForhandsvarselMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: VurderingRequestDTO = {
          type: VurderingType.FORHANDSVARSEL,
          begrunnelse: begrunnelse,
          document: getSendForhandsvarselDocument(begrunnelse),
        };
        expect(sendForhandsvarselMutation.state.variables).to.deep.equal(
          expectedVurdering
        );
      });

      expect(screen.queryByText(begrunnelse)).to.exist;
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderForhandsvarselSide();
      stubArbeidsuforhetForhandsvarselApi();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      const begrunnelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(begrunnelseInput, begrunnelse);
      await clickButton("Forhåndsvisning");

      const forhandsvisningForhandsvarsel = screen.getAllByRole("dialog", {
        hidden: true,
      })[0];
      expect(
        within(forhandsvisningForhandsvarsel).getByRole("heading", {
          name: "Nav vurderer å avslå sykepengene dine",
          hidden: true,
        })
      ).to.exist;
      getSendForhandsvarselDocument(begrunnelse)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningForhandsvarsel).getByText(text)).to
            .exist;
        });
    });
  });
});
