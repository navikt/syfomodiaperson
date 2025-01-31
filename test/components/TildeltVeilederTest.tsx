import { beforeEach, describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ANNEN_VEILEDER,
  ARBEIDSTAKER_DEFAULT,
  INAKTIV_VEILEDER,
  VEILEDER_BRUKER_KNYTNING_DEFAULT,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  stubSyfooversiktsrvPersontildelingNoContent,
  stubSyfooversiktsrvPersontildelingRegistrerOK,
} from "../stubs/stubSyfooversiktsrv";
import { queryHookWrapper } from "../data/queryHookTestUtils";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import {
  useGetVeilederBrukerKnytning,
  veilederBrukerKnytningQueryKeys,
} from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";
import { queryClientWithMockData } from "../testQueryClient";
import { TildeltVeileder } from "@/components/TildeltVeileder";
import React from "react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { clickButton } from "../testUtils";
import userEvent from "@testing-library/user-event";

let queryClient: QueryClient;

const renderTildelVeileder = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <TildeltVeileder />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("TildeltVeileder", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  describe("Visning av tildel veileder", () => {
    it("viser 'Tildelt veileder' når kall for å hente knytning er success", () => {
      queryClient.setQueryData(
        veilederBrukerKnytningQueryKeys.veilederBrukerKnytning(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => VEILEDER_BRUKER_KNYTNING_DEFAULT
      );
      queryClient.setQueryData(
        veilederinfoQueryKeys.veilederinfoByIdent(VEILEDER_IDENT_DEFAULT),
        () => VEILEDER_DEFAULT
      );
      renderTildelVeileder();

      expect(screen.getByText("Tildelt veileder:")).to.exist;
      expect(
        screen.getByText(
          `${VEILEDER_DEFAULT.fulltNavn()} (${VEILEDER_DEFAULT.ident})`
        )
      ).to.exist;
    });

    it("viser 'Tildelt veileder: ufordelt' når kall for å hente knytning ikke finner noen knytning", async () => {
      stubSyfooversiktsrvPersontildelingNoContent();
      const wrapper = queryHookWrapper(queryClient);

      const { result } = renderHook(() => useGetVeilederBrukerKnytning(), {
        wrapper,
      });
      renderTildelVeileder();

      await waitFor(() => expect(result.current.isSuccess).to.be.true);
      await screen.findByText("Ufordelt bruker");
    });
  });

  describe("Endring av tildelt veileder", () => {
    beforeEach(() => {
      queryClient.setQueryData(
        veilederBrukerKnytningQueryKeys.veilederBrukerKnytning(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => VEILEDER_BRUKER_KNYTNING_DEFAULT
      );
      queryClient.setQueryData(
        veilederinfoQueryKeys.veiledereByEnhet(navEnhet.id),
        () => [VEILEDER_DEFAULT, ANNEN_VEILEDER, INAKTIV_VEILEDER]
      );
    });
    it("viser modal for endring av tildelt veileder", async () => {
      renderTildelVeileder();

      expect(
        screen.queryByRole("dialog", {
          hidden: true,
          name: "Tildel veileder",
        })
      ).to.not.exist;

      await clickButton("Endre");

      expect(
        screen.getByRole("dialog", {
          name: "Tildel veileder",
        })
      ).to.exist;
    });
    it("viser ikke inaktiv veileder i modal for endring av tildelt veileder", async () => {
      renderTildelVeileder();
      await clickButton("Endre");

      expect(screen.getAllByRole("option")).to.have.length(2);
      const inaktivVeilederOption = screen.queryByRole("option", {
        name: `${INAKTIV_VEILEDER.etternavn}, ${INAKTIV_VEILEDER.fornavn}`,
      });
      expect(inaktivVeilederOption).to.not.exist;
    });
    it("validerer valgt veileder", async () => {
      renderTildelVeileder();
      await clickButton("Endre");
      await clickButton("Tildel");

      expect(await screen.findByText("Vennligst velg veileder")).to.exist;
    });
    it("tildeler til valgt veileder", async () => {
      stubSyfooversiktsrvPersontildelingRegistrerOK();
      renderTildelVeileder();
      await clickButton("Endre");

      const annenVeilederOption = screen.getByRole("option", {
        name: `${ANNEN_VEILEDER.etternavn}, ${ANNEN_VEILEDER.fornavn}`,
      });
      await userEvent.click(annenVeilederOption);
      await clickButton("Tildel");

      await waitFor(() => {
        const tildelVeilederMutation = queryClient
          .getMutationCache()
          .getAll()
          .pop();
        expect(tildelVeilederMutation?.state.variables).to.deep.equal(
          ANNEN_VEILEDER.ident
        );
      });
    });
  });
});
