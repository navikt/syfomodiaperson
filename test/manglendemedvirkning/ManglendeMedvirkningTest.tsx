import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { screen, waitFor } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React, { ReactNode } from "react";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import {
  NewVurderingRequestDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { addWeeks } from "@/utils/datoUtils";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { renderWithRouter } from "../testRouterUtils";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import ForhandsvarselSide from "@/sider/manglendemedvirkning/ForhandsvarselSide";
import { getSendForhandsvarselDocument } from "./vurderingDocuments";

let queryClient: QueryClient;

const renderManglendemedvirkningSide = (children: ReactNode, path: string) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>{children}</NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    path,
    [path]
  );
};

describe("Manglendemedvirkning", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      manglendeMedvirkningQueryKeys.manglendeMedvirkning(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => []
    );
  });

  describe("ForhandsvarselSide", () => {
    it("skal vise forhandsvarsel side", () => {
      renderManglendemedvirkningSide(
        <ForhandsvarselSide />,
        manglendeMedvirkningPath
      );

      expect(screen.getByText("Send forhåndsvarsel")).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: "Begrunnelse (obligatorisk)",
        })
      ).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });

    it("skal sende forhandsvarsel med riktige verdier", async () => {
      renderManglendemedvirkningSide(
        <ForhandsvarselSide />,
        manglendeMedvirkningPath
      );
      const varselSvarfrist = addWeeks(new Date(), 3);
      const begrunnelse = "En begrunnelse";

      const begrunnelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(begrunnelseInput, begrunnelse);

      await clickButton("Send");

      const expectedRequestBody: NewVurderingRequestDTO = {
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        vurderingType: VurderingType.FORHANDSVARSEL,
        begrunnelse: begrunnelse,
        document: getSendForhandsvarselDocument(begrunnelse, varselSvarfrist),
        varselSvarfrist: varselSvarfrist,
      };

      await waitFor(() => {
        const vurderingMutation = queryClient.getMutationCache().getAll().pop();

        // Ikke deep.equal fordi varselSvarfrist blir ulik på millisekund-nivå
        expect(vurderingMutation?.state.variables).to.deep.include({
          personident: expectedRequestBody.personident,
          vurderingType: expectedRequestBody.vurderingType,
          begrunnelse: expectedRequestBody.begrunnelse,
          document: expectedRequestBody.document,
        });
      });
    });
  });
});
