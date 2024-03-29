import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { screen, waitFor } from "@testing-library/react";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import { ForhandsvarselSendt } from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import {
  VurderingRequestDTO,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { addWeeks, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { createForhandsvarsel } from "./arbeidsuforhetTestData";
import { renderWithRouter } from "../testRouterUtils";
import { appRoutePath } from "@/routers/AppRouter";
import { clickButton } from "../testUtils";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderForhandsvarselSendt = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <ForhandsvarselSendt />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    `${appRoutePath}/arbeidsuforhet`,
    [`${appRoutePath}/arbeidsuforhet`]
  );
};

describe("ForhandsvarselSendt", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Show correct component", () => {
    it("show ForhandsvarselBeforeDeadline when svarfrist is in three weeks (not expired)", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderForhandsvarselSendt();

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
          "Om du får svar fra bruker, og hen oppfyller kravene om 8-4 etter din vurdering, klikker du på “oppfylt”-knappen under. Om ikke må du vente til tiden går ut før du kan gi avslag."
        )
      ).to.exist;
      expect(screen.getByRole("img", { name: "klokkeikon" })).to.exist;
      expect(screen.getByRole("button", { name: "Avslag" })).to.have.property(
        "disabled",
        true
      );
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Se hele brevet" })).to.exist;
    });

    it("show ForhandsvarselAfterDeadline when svarfrist is today (expired)", () => {
      const createdAt = addWeeks(new Date(), -3);
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: createdAt,
        svarfrist: new Date(),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderForhandsvarselSendt();

      expect(screen.getByText("Fristen er utgått!")).to.exist;
      expect(screen.getByText(tilLesbarDatoMedArUtenManedNavn(new Date()))).to
        .exist;
      expect(screen.getByRole("img", { name: "bjelleikon" })).to.exist;
      expect(
        screen.getByText(
          `Forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
            createdAt
          )} er gått ut! Du kan nå gi avslag på Arbeidsuførhet.`
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Avslag" })).to.have.property(
        "disabled",
        false
      );
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Se hele brevet" })).to.exist;
    });

    it("send avslag after frist is utgatt", async () => {
      const createdAt = addWeeks(new Date(), -3);
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: createdAt,
        svarfrist: new Date(),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderForhandsvarselSendt();

      clickButton("Avslag");
      await waitFor(() => {
        const expectedVurdering: VurderingRequestDTO = {
          type: VurderingType.AVSLAG,
          begrunnelse: "",
          document: [],
        };
        const useSendVurderingArbeidsuforhet = queryClient
          .getMutationCache()
          .getAll()[0];
        expect(useSendVurderingArbeidsuforhet.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
    });
  });
});
