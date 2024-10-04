import { beforeEach, describe, expect, it } from "vitest";
import { defaultForhandsvarselVurdering } from "./manglendeMedvirkningTestData";
import { manglendeMedvirkningUnntakPath } from "@/routers/AppRouter";
import { screen, waitFor } from "@testing-library/react";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import {
  UnntakVurdering,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { getSettUnntakDocument } from "./vurderingDocuments";
import React from "react";
import { renderWithRouter } from "../testRouterUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import UnntakSide from "@/sider/manglendemedvirkning/unntak/UnntakSide";
import { queryClientWithMockData } from "../testQueryClient";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";

let queryClient: QueryClient;

const renderUnntakSide = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <UnntakSide />
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    manglendeMedvirkningUnntakPath,
    [manglendeMedvirkningUnntakPath]
  );
};

function mockVurdering(vurdering?: VurderingResponseDTO) {
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => (vurdering ? [vurdering] : [])
  );
}

describe("Manglendemedvirkning Unntak", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("UnntakSkjema", () => {
    it("Viser unntak skjema", () => {
      mockVurdering(defaultForhandsvarselVurdering);

      renderUnntakSide();

      expect(screen.getByText("Unntak fra medvirkningsplikten")).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: "Begrunnelse (obligatorisk)",
        })
      ).to.exist;
      expect(
        screen.getByText("Husk å informere bruker om utfallet av vurderingen.")
      );
      expect(screen.getByRole("button", { name: "Sett unntak" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
      expect(screen.getByRole("button", { name: "Avbryt" })).to.exist;
    });

    it("viser feil når man sender unntak uten å ha skrevet begrunnelse", async () => {
      mockVurdering(defaultForhandsvarselVurdering);

      renderUnntakSide();

      await clickButton("Sett unntak");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Skal sende unntak med riktige verdier", async () => {
      mockVurdering(defaultForhandsvarselVurdering);

      renderUnntakSide();

      const begrunnelse = "En begrunnelse";
      const begrunnelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(begrunnelseInput, begrunnelse);

      await clickButton("Sett unntak");

      const expectedRequestBody: UnntakVurdering = {
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        vurderingType: VurderingType.UNNTAK,
        begrunnelse: begrunnelse,
        document: getSettUnntakDocument(
          begrunnelse,
          defaultForhandsvarselVurdering.createdAt
        ),
      };

      await waitFor(() => {
        const vurderingMutation = queryClient.getMutationCache().getAll().pop();

        expect(vurderingMutation?.state.variables).to.deep.equal({
          personident: expectedRequestBody.personident,
          vurderingType: expectedRequestBody.vurderingType,
          begrunnelse: expectedRequestBody.begrunnelse,
          document: expectedRequestBody.document,
        });
      });
    });
  });
});
