import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
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
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import {
  addDays,
  addWeeks,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { renderWithRouter } from "../testRouterUtils";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import { getSendForhandsvarselDocument } from "./vurderingDocuments";
import ManglendeMedvirkning from "@/sider/manglendemedvirkning/ManglendeMedvirkning";
import { generateUUID } from "@/utils/uuidUtils";

let queryClient: QueryClient;

const renderManglendeMedvirkning = (children: ReactNode, path: string) => {
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

function mockVurdering(vurdering?: VurderingResponseDTO) {
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => (vurdering ? [vurdering] : [])
  );
}

const defaultVurdering: VurderingResponseDTO = {
  uuid: generateUUID(),
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
  createdAt: new Date(),
  veilederident: VEILEDER_DEFAULT.ident,
  vurderingType: VurderingType.FORHANDSVARSEL,
  begrunnelse: "Dette er en begrunnelse",
  document: [],
  varsel: {
    uuid: generateUUID(),
    createdAt: new Date(),
    svarfrist: addWeeks(new Date(), 3),
  },
};

describe("Manglendemedvirkning", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("ForhandsvarselSkjema", () => {
    it("skal vise forhandsvarsel side når ingen tidligere vurderinger", () => {
      mockVurdering();
      renderManglendeMedvirkning(
        <ManglendeMedvirkning />,
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

    it("viser feil når man sender forhåndsvarsel uten å ha skrevet begrunnelse", async () => {
      mockVurdering();
      renderManglendeMedvirkning(
        <ManglendeMedvirkning />,
        manglendeMedvirkningPath
      );

      await clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("skal sende forhandsvarsel med riktige verdier", async () => {
      mockVurdering();
      renderManglendeMedvirkning(
        <ManglendeMedvirkning />,
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

  describe("ForhandsvarselSendt", () => {
    it("viser ForhandsvarselBeforeDeadline når svarfrist ikke utgått", () => {
      mockVurdering(defaultVurdering);

      renderManglendeMedvirkning(
        <ManglendeMedvirkning />,
        manglendeMedvirkningPath
      );

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
        ...defaultVurdering,
        createdAt: createdAt,
        varsel: {
          uuid: generateUUID(),
          createdAt: createdAt,
          svarfrist: svarfrist,
        },
      };
      mockVurdering(forhandsvarselAfterFrist);

      renderManglendeMedvirkning(
        <ManglendeMedvirkning />,
        manglendeMedvirkningPath
      );

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
