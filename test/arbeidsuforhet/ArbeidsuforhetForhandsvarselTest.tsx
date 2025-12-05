import { screen, waitFor, within } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import SendForhandsvarselSkjema from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import { stubArbeidsuforhetForhandsvarselApi } from "../stubs/stubIsarbeidsuforhet";
import {
  Forhandsvarsel,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { getSendForhandsvarselDocument } from "./documents";
import { queryClientWithMockData } from "../testQueryClient";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { getForhandsvarselFrist } from "@/utils/forhandsvarselUtils";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import dayjs from "dayjs";

let queryClient: QueryClient;

const renderForhandsvarselSkjema = () =>
  renderArbeidsuforhetSide(
    queryClient,
    <SendForhandsvarselSkjema />,
    arbeidsuforhetPath,
    [arbeidsuforhetPath]
  );

describe("Forhandsvarselskjema arbeidsuforhet", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Send forhåndsvarsel", () => {
    it("Gives error when trying to send forhandsvarsel without changing default begrunnelse", async () => {
      renderForhandsvarselSkjema();

      await clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Gives error when trying to send forhandsvarsel with no begrunnelse", async () => {
      renderForhandsvarselSkjema();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const beskrivelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(beskrivelseInput, "");

      await clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send forhåndsvarsel with begrunnelse filled in, without reseting the form", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderForhandsvarselSkjema();
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

      let sendForhandsvarselMutation;
      await waitFor(() => {
        sendForhandsvarselMutation = queryClient.getMutationCache().getAll()[0];
        expect(sendForhandsvarselMutation).to.exist;
      });
      const vurdering = sendForhandsvarselMutation.state
        .variables as unknown as Forhandsvarsel;
      const expectedVurdering: Forhandsvarsel = {
        type: VurderingType.FORHANDSVARSEL,
        begrunnelse: begrunnelse,
        document: getSendForhandsvarselDocument(begrunnelse),
        frist: dayjs(getForhandsvarselFrist()).format("YYYY-MM-DD"),
      };
      expect(vurdering.type).to.deep.equal(expectedVurdering.type);
      expect(vurdering.begrunnelse).to.deep.equal(
        expectedVurdering.begrunnelse
      );
      expect(vurdering.document).to.deep.equal(expectedVurdering.document);
      expect(vurdering.frist).to.deep.equal(expectedVurdering.frist);

      expect(screen.queryByText(begrunnelse)).to.exist;
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderForhandsvarselSkjema();
      stubArbeidsuforhetForhandsvarselApi();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      const begrunnelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(begrunnelseInput, begrunnelse);
      await clickButton("Forhåndsvisning");

      const forhandsvisningForhandsvarsel = screen.getAllByRole("dialog", {
        hidden: true,
      })[1];
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
