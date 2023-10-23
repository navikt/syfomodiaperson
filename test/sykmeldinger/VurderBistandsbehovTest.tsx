import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import React from "react";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { personOppgaveUbehandletBehandlerBerOmBistand } from "../../mock/ispersonoppgave/personoppgaveMock";
import { BistandsbehovOppgaver } from "@/components/speiling/sykmeldinger/VurderBistandsbehov";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { sykmeldingerMock } from "../../mock/syfosmregister/sykmeldingerMock";

let queryClient: QueryClient;

const renderBistandsbehovOppgaver = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <BistandsbehovOppgaver />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
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
    "Jeg har vurdert bistandsbehovet, fjern oppgaven.";

  it("Viser VurderBistandsbehov panel", () => {
    renderBistandsbehovOppgaver();

    expect(
      screen.getByRole("heading", {
        name: "Vurder bistandsbehovet fra behandler:",
      })
    ).to.exist;
    expect(
      screen.getByRole("button", {
        name: behandlePersonoppgaveKnappText,
      })
    ).to.exist;
  });
});
