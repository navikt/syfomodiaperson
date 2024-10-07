import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderWithRouter } from "../testRouterUtils";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import React from "react";
import { manglendeMedvirkningIkkeAktuellPath } from "@/routers/AppRouter";
import {
  IkkeAktuellVurdering,
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
import { getIkkeAktuellDocument } from "./vurderingDocuments";
import IkkeAktuellSide from "@/sider/manglendemedvirkning/ikkeaktuell/IkkeAktuellSide";

let queryClient: QueryClient;

const mockVurdering = (vurdering?: VurderingResponseDTO) => {
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => (vurdering ? [vurdering] : [])
  );
};

const renderIkkeAktuellSide = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <IkkeAktuellSide />
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    manglendeMedvirkningIkkeAktuellPath,
    [manglendeMedvirkningIkkeAktuellPath]
  );
};

describe("Manglendemedvirkning Ikke aktuell", () => {
  const ikkeAktuellHeader =
    "Vurdering av medvirkningsplikten er ikke lenger aktuell";
  const begrunnelseLabel = "Begrunnelse (obligatorisk)";
  const enBegrunnelse = "Dette er en begrunnelse!";

  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("renders IkkeAktuellSkjema when latest vurdering is FORHANDSVARSEL", () => {
    mockVurdering(defaultForhandsvarselVurdering);
    renderIkkeAktuellSide();

    expect(screen.getByText(ikkeAktuellHeader)).to.exist;
  });

  it("does not render IkkeAktuellSkjema when latest vurdering is not FORHANDSVARSEL", () => {
    mockVurdering();
    renderIkkeAktuellSide();

    expect(screen.queryByText(ikkeAktuellHeader)).to.not.exist;
  });
  describe("IkkeAktuellSkjema", () => {
    beforeEach(() => {
      mockVurdering(defaultForhandsvarselVurdering);
    });
    it("viser begrunnelse-felt og knapper for å lagre og avbryte", () => {
      renderIkkeAktuellSide();

      expect(screen.getByRole("textbox", { name: begrunnelseLabel })).to.exist;
      expect(getButton("Lagre")).to.exist;
      expect(getButton("Avbryt")).to.exist;
    });

    it("viser feil når man sender Ikke aktuell uten begrunnelse", async () => {
      renderIkkeAktuellSide();

      await clickButton("Lagre");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("forhåndsviser vurdering med begrunnelse", async () => {
      renderIkkeAktuellSide();

      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(begrunnelseInput, enBegrunnelse);
      await clickButton("Forhåndsvisning");

      const forhandsvisningVurdering = screen.getAllByRole("dialog", {
        hidden: true,
      })[0];
      getIkkeAktuellDocument(enBegrunnelse)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });

    it("sender Ikke aktuell med riktige verdier", async () => {
      renderIkkeAktuellSide();

      const begrunnelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(begrunnelseInput, enBegrunnelse);

      await clickButton("Lagre");

      const expectedRequestBody: IkkeAktuellVurdering = {
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        vurderingType: VurderingType.IKKE_AKTUELL,
        begrunnelse: enBegrunnelse,
        document: getIkkeAktuellDocument(enBegrunnelse),
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
