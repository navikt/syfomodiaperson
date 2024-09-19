import { beforeEach, describe, expect, it } from "vitest";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import { screen, waitFor } from "@testing-library/react";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { addDays } from "@/utils/datoUtils";
import {
  NewForhandsvarselVurderingRequestDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { getSendForhandsvarselDocument } from "./vurderingDocuments";
import React from "react";
import { renderWithRouter } from "../testRouterUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import ForhandsvarselSkjema from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSkjema";
import { queryClientWithMockData } from "../testQueryClient";

let queryClient: QueryClient;

const renderForhandsvarselSkjema = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <ForhandsvarselSkjema />
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    manglendeMedvirkningPath,
    [manglendeMedvirkningPath]
  );
};

describe("Manglendemedvirkning Forhandsvarsel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser feil når man sender forhåndsvarsel uten å ha skrevet begrunnelse", async () => {
    renderForhandsvarselSkjema();

    await clickButton("Send");

    expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
  });

  it("skal sende forhandsvarsel med riktige verdier", async () => {
    renderForhandsvarselSkjema();

    const varselSvarfrist = addDays(new Date(), 1);
    const begrunnelse = "En begrunnelse";

    const begrunnelseInput = getTextInput("Begrunnelse (obligatorisk)");
    changeTextInput(begrunnelseInput, begrunnelse);

    await clickButton("Send");

    const expectedRequestBody: NewForhandsvarselVurderingRequestDTO = {
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
