import React from "react";
import { manglendeMedvirkningStansPath } from "@/routers/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { navEnhet } from "../dialogmote/testData";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { renderWithRouter } from "../testRouterUtils";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import StansSide from "@/sider/manglendemedvirkning/stans/StansSide";
import {
  NewFinalVurderingRequestDTO,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { queryClientWithMockData } from "../testQueryClient";
import { beforeEach, describe, expect, it } from "vitest";
import { defaultForhandsvarselVurderingAfterDeadline } from "./manglendeMedvirkningTestData";
import { screen, waitFor } from "@testing-library/react";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { getStansDocument } from "./vurderingDocuments";

let queryClient: QueryClient;

const renderStansSide = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <StansSide />
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    manglendeMedvirkningStansPath,
    [manglendeMedvirkningStansPath]
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

describe("Manglendemedvirkning Stans", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("StansSkjema", () => {
    it("Viser stans skjema", () => {
      mockVurdering(defaultForhandsvarselVurderingAfterDeadline);

      renderStansSide();

      expect(screen.getByText("Skriv innstilling til NAY")).to.exist;
      expect(
        screen.getByText(
          "Skriv kort hvilke opplysninger som ligger til grunn for stans, samt din vurdering av hvorfor vilkåret ikke er oppfylt og vurdering av eventuelle nye opplysninger."
        )
      ).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: "Innstilling om stans (obligatorisk)",
        })
      ).to.exist;
      expect(screen.getByText("Før du trykker Stans må du huske å:")).to.exist;
      expect(screen.getByText("Sende oppgave til NAY i Gosys:")).to.exist;
      expect(screen.getByText("Tema: Sykepenger")).to.exist;
      expect(screen.getByText("Gjelder: Behandle vedtak")).to.exist;
      expect(screen.getByText("Oppgavetype: Vurder konsekvens for ytelse")).to
        .exist;
      expect(screen.getByText("Prioritet: Høy")).to.exist;
      expect(
        screen.getByText(
          "Gi beskjed om stans til ny saksbehandlingsløsning via Stoppknappen under fanen Sykmeldinger i Modia."
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Når du trykker “Stans” blir innstillingen journalført og kan sees i Gosys."
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Stans" })).to.exist;
      expect(screen.getByRole("button", { name: "Avbryt" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });

    it("Viser feil når man stanser uten å ha skrevet begrunnelse", async () => {
      mockVurdering(defaultForhandsvarselVurderingAfterDeadline);

      renderStansSide();

      await clickButton("Stans");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Stanser med riktige verdier", async () => {
      mockVurdering(defaultForhandsvarselVurderingAfterDeadline);

      renderStansSide();

      const begrunnelse = "En begrunnelse";
      const begrunnelseInput = getTextInput(
        "Innstilling om stans (obligatorisk)"
      );
      changeTextInput(begrunnelseInput, begrunnelse);

      await clickButton("Stans");

      const expectedRequestBody: NewFinalVurderingRequestDTO = {
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        vurderingType: VurderingType.STANS,
        begrunnelse: begrunnelse,
        document: getStansDocument(
          begrunnelse,
          defaultForhandsvarselVurderingAfterDeadline?.varsel?.svarfrist ??
            new Date()
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
