import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { queryClientWithMockData } from "../testQueryClient";
import { expect, describe, it, beforeEach } from "vitest";
import React from "react";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { personOppgaveUbehandletBehandlerBerOmBistand } from "@/mocks/ispersonoppgave/personoppgaveMock";
import { BistandsbehovOppgaver } from "@/sider/sykmeldinger/VurderBistandsbehov";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { renderWithRouter } from "../testRouterUtils";
import { clickButton } from "../testUtils";

let queryClient: QueryClient;

const renderBistandsbehovOppgaver = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <BistandsbehovOppgaver />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    "/sykefravaer/sykmeldinger/:sykmeldingId",
    [`/sykefravaer/sykmeldinger/123`]
  );
};

describe("VurderBistandsbehov", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [{ ...personOppgaveUbehandletBehandlerBerOmBistand }]
    );
    queryClient.setQueryData(
      sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => sykmeldingerMock
    );
  });

  const behandlePersonoppgaveKnappText =
    "Jeg har vurdert behovet, fjern oppgaven.";

  it("Viser VurderBistandsbehov panel", () => {
    renderBistandsbehovOppgaver();

    expect(
      screen.getByRole("heading", {
        name: "Vurder bistandsbehovet eller forslag til tiltak fra behandler:",
      })
    ).to.exist;
    expect(
      screen.getByRole("button", {
        name: behandlePersonoppgaveKnappText,
      })
    ).to.exist;
    expect(
      screen.getByText(
        "Felt 7.2 (Forslag til tiltak i regi fra Nav): Vedlikehold av holodeck"
      )
    ).to.exist;
    expect(
      screen.getByText(
        "Felt 7.3 (Andre innspill til Nav): Mer vedlikehold av holodeck"
      )
    ).to.exist;
    expect(
      screen.getByText(
        "Felt 8.2 (Melding til Nav): Nav kan vise til egen forskning på faren med phaser blasts"
      )
    ).to.exist;
    expect(
      screen.getByRole("link", {
        name: "Gå til sykmeldingen",
      })
    ).to.exist;
  });

  it("Behandler ber-om-bistand oppgaven med riktig uuid for personoppgaven", async () => {
    renderBistandsbehovOppgaver();

    await clickButton(behandlePersonoppgaveKnappText);

    const behandleMutation = queryClient.getMutationCache().getAll()[0];

    expect(behandleMutation.state.variables).to.deep.equal(
      personOppgaveUbehandletBehandlerBerOmBistand.uuid
    );
  });
});
