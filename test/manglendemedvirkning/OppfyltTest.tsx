import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderWithRouter } from "../testRouterUtils";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import React from "react";
import OppfyltSide from "@/sider/manglendemedvirkning/oppfylt/OppfyltSide";
import { manglendeMedvirkningOppfyltPath } from "@/routers/AppRouter";
import {
  NewFinalVurderingRequestDTO,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { defaultForhandsvarselVurdering } from "./manglendeMedvirkningTestData";
import {
  changeTextInput,
  clickButton,
  getButton,
  getTextInput,
} from "../testUtils";
import { screen, waitFor, within } from "@testing-library/react";
import { getOppfyltDocument } from "./vurderingDocuments";

let queryClient: QueryClient;

const mockVurdering = (vurdering?: VurderingResponseDTO) => {
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => (vurdering ? [vurdering] : [])
  );
};

const renderOppfyltSide = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <OppfyltSide />
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    manglendeMedvirkningOppfyltPath,
    [manglendeMedvirkningOppfyltPath]
  );
};

describe("Manglendemedvirkning Oppfylt", () => {
  const oppfyltHeader = "Medvirkningsplikten er oppfylt";
  const begrunnelseLabel = "Begrunnelse (obligatorisk)";
  const enBegrunnelse = "Dette er en begrunnelse!";

  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("renders OppfyltSkjema when latest vurdering is FORHANDSVARSEL", () => {
    mockVurdering(defaultForhandsvarselVurdering);
    renderOppfyltSide();

    expect(screen.getByText(oppfyltHeader)).to.exist;
  });

  it("does not render OppfyltSkjema when latest vurdering is not FORHANDSVARSEL", () => {
    mockVurdering();
    renderOppfyltSide();

    expect(screen.queryByText(oppfyltHeader)).to.not.exist;
  });
  describe("OppfyltSkjema", () => {
    beforeEach(() => {
      mockVurdering(defaultForhandsvarselVurdering);
    });
    it("viser begrunnelse-felt og knapper for å lagre, avbryte og forhåndsvise", () => {
      renderOppfyltSide();

      expect(screen.getByRole("textbox", { name: begrunnelseLabel })).to.exist;
      expect(
        screen.getByText("Husk å informere bruker om utfallet av vurderingen.")
      );
      expect(getButton("Lagre")).to.exist;
      expect(getButton("Avbryt")).to.exist;
      expect(getButton("Forhåndsvisning")).to.exist;
    });

    it("forhåndsviser vurdering med begrunnelse", async () => {
      renderOppfyltSide();

      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(begrunnelseInput, enBegrunnelse);
      await clickButton("Forhåndsvisning");

      const forhandsvisningVurdering = screen.getAllByRole("dialog", {
        hidden: true,
      })[0];
      getOppfyltDocument(enBegrunnelse)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });

    it("viser feil når man sender Oppfylt uten begrunnelse", async () => {
      renderOppfyltSide();

      await clickButton("Lagre");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("sender Oppfylt med riktige verdier", async () => {
      renderOppfyltSide();

      const begrunnelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(begrunnelseInput, enBegrunnelse);

      await clickButton("Lagre");

      const expectedRequestBody: NewFinalVurderingRequestDTO = {
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        vurderingType: VurderingType.OPPFYLT,
        begrunnelse: enBegrunnelse,
        document: getOppfyltDocument(enBegrunnelse),
      };

      await waitFor(() => {
        const vurderingMutation = queryClient.getMutationCache().getAll().pop();
        expect(vurderingMutation?.state.variables).to.deep.equal(
          expectedRequestBody
        );
      });
    });
  });
});
