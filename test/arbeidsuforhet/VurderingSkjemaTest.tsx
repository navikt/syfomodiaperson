import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { render, screen, waitFor, within } from "@testing-library/react";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import { NotificationContext } from "@/context/notification/NotificationContext";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { VurderingSkjema } from "@/sider/arbeidsuforhet/VurderingSkjema";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { stubArbeidsuforhetVurderingApi } from "../stubs/stubIsarbeidsuforhet";
import { getSendVurderingDocument } from "./documents";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";

let queryClient: QueryClient;
let apiMockScope: any;

const renderVurderingSkjema = (type: VurderingType) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationContext.Provider
          value={{ notification: undefined, setNotification: () => void 0 }}
        >
          <VurderingSkjema type={type} />
        </NotificationContext.Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("VurderingSkjema", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe("Show correct title", () => {
    it("shows 'oppfyller'-title when oppfylt type is chosen", () => {
      renderVurderingSkjema(VurderingType.OPPFYLT);

      expect(
        screen.getByText(
          "Skriv en kort begrunnelse for hvorfor bruker oppfyller 8-4"
        )
      ).to.exist;
    });

    it("shows 'ikke oppfyller'-title when avslag type is chosen", () => {
      renderVurderingSkjema(VurderingType.AVSLAG);

      expect(
        screen.getByText(
          "Skriv en kort begrunnelse for hvorfor bruker ikke oppfyller 8-4"
        )
      ).to.exist;
    });
  });

  describe("Form components", () => {
    it("shows textarea and buttons", () => {
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      renderVurderingSkjema(VurderingType.OPPFYLT);

      expect(screen.getByText(begrunnelseLabel)).to.exist;
      expect(screen.getByText("Åpne forhåndsvisning for å se hele varselet."))
        .to.exist;
      expect(
        screen.getByRole("textbox", {
          name: begrunnelseLabel,
        })
      ).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });
  });

  describe("Send vurdering", () => {
    it("Gives error when trying to send vurdering without begrunnelse", async () => {
      renderVurderingSkjema(VurderingType.OPPFYLT);

      clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send vurdering with begrunnelse filled in, without reseting the form", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderVurderingSkjema(VurderingType.OPPFYLT);
      stubArbeidsuforhetVurderingApi(apiMockScope);
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const beskrivelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(beskrivelseInput, begrunnelse);
      clickButton("Send");

      await waitFor(() => {
        const useSendVurderingArbeidsuforhet = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: VurderingRequestDTO = {
          type: VurderingType.OPPFYLT,
          begrunnelse: begrunnelse,
          document: getSendVurderingDocument(begrunnelse),
        };
        expect(useSendVurderingArbeidsuforhet.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
      expect(screen.queryByText(begrunnelse)).to.exist;
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderVurderingSkjema(VurderingType.OPPFYLT);
      stubArbeidsuforhetVurderingApi(apiMockScope);
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(begrunnelseInput, begrunnelse);
      clickButton("Forhåndsvisning");

      const forhandsvisningVurdering = screen.getAllByRole("dialog", {
        hidden: true,
      })[0];
      expect(
        within(forhandsvisningVurdering).getByRole("heading", {
          name: "Forhåndsvis brev",
          hidden: true,
        })
      ).to.exist;
      getSendVurderingDocument(begrunnelse)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });
  });
});
