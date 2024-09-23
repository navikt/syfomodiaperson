import { beforeEach, describe, expect, it } from "vitest";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import { screen, waitFor } from "@testing-library/react";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import {
  addDays,
  addWeeks,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import {
  NewForhandsvarselVurderingRequestDTO,
  VurderingResponseDTO,
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
import { defaultForhandsvarselVurdering } from "./manglendeMedvirkningTestData";
import { generateUUID } from "@/utils/uuidUtils";
import ForhandsvarselSendt from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSendt";

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

const renderForhandsvarselSendt = (forhandsvarsel: VurderingResponseDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <ForhandsvarselSendt forhandsvarsel={forhandsvarsel} />
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

  describe("ForhandsvarselSkjema", () => {
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

  describe("ForhandsvarselSendt", () => {
    it("viser ForhandsvarselBeforeDeadline når svarfrist ikke utgått", () => {
      renderForhandsvarselSendt(defaultForhandsvarselVurdering);

      expect(
        screen.getByText(
          `Forhåndsvarselet er sendt ${tilLesbarDatoMedArUtenManedNavn(
            new Date()
          )}.`
        )
      ).to.exist;
      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
      expect(screen.getByText("Fristen går ut:")).to.exist;
      expect(
        screen.getByText(
          "Dersom du har mottatt nye opplysninger og vurdert at bruker likevel oppfyller § 8-8, klikker du på Oppfylt-knappen."
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Velg Ikke aktuell-knappen dersom personen har blitt friskmeldt etter at forhåndsvarselet ble sendt ut, eller av andre årsaker ikke er aktuell."
        )
      ).to.exist;
      expect(screen.getByText("Du kan ikke stanse før fristen er gått ut.")).to
        .exist;
      expect(screen.getByRole("img", { name: "klokkeikon" })).to.exist;
      expect(
        screen.getByRole("button", { name: "Innstilling om stans" })
      ).to.have.property("disabled", true);
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Ikke aktuell" })).to.exist;
    });

    it("viser ForhandsvarselAfterDeadline når svarfrist er utgått", () => {
      const createdAt = addWeeks(new Date(), -3);
      const svarfrist = addDays(new Date(), -1);
      const forhandsvarselAfterFrist: VurderingResponseDTO = {
        ...defaultForhandsvarselVurdering,
        createdAt: createdAt,
        varsel: {
          uuid: generateUUID(),
          createdAt: createdAt,
          svarfrist: svarfrist,
        },
      };
      renderForhandsvarselSendt(forhandsvarselAfterFrist);

      expect(screen.getByText("Fristen er gått ut")).to.exist;
      expect(screen.getByText("Fristen var:")).to.exist;
      expect(screen.getByText(tilLesbarDatoMedArUtenManedNavn(svarfrist))).to
        .exist;
      expect(screen.getByRole("img", { name: "bjelleikon" })).to.exist;
      expect(
        screen.getByText(
          `Fristen for forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
            createdAt
          )} er gått ut. Trykk på Innstilling om stans-knappen hvis vilkårene i § 8-8 ikke er oppfylt og rett til videre sykepenger skal stanses.`
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Velg Ikke aktuell-knappen dersom personen har blitt friskmeldt etter at forhåndsvarselet ble sendt ut, eller av andre årsaker ikke er aktuell."
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Innstilling om stans" })).to
        .exist;
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Ikke aktuell" })).to.exist;
    });
  });
});
