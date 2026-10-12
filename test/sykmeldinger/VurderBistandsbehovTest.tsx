import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { queryClientWithMockData } from "../testQueryClient";
import { beforeEach, describe, expect, it } from "vitest";

import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import {
  personOppgaveUbehandletBehandlerBerOmBistand,
  personOppgaveUbehandletBehandlerBerOmBistand2,
} from "@/mocks/ispersonoppgave/personoppgaveMock";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import { renderWithRouter } from "../testRouterUtils";
import { clickButton } from "../testUtils";

import SykmeldingerSide from "@/sider/sykmeldinger/container/SykmeldingerSide";

let queryClient: QueryClient;

const renderBistandsbehovOppgaver = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <SykmeldingerSide />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    "/sykefravaer/sykmeldinger/:sykmeldingId",
    [`/sykefravaer/sykmeldinger/123`],
  );
};

describe("VurderBistandsbehov", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [{ ...personOppgaveUbehandletBehandlerBerOmBistand }],
    );
    queryClient.setQueryData(
      sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => sykmeldingerMock,
    );
  });

  const behandlePersonoppgaveKnappText =
    "Jeg har vurdert behovet, fjern oppgaven.";
  const annetArbeidPaSiktText =
    "Felt 5.2.2 (Prognose): Jeg antar at pasienten på sikt kan komme i arbeid hos annen arbeidsgiver";

  const sykmeldinger = sykmeldingerMock as unknown as SykmeldingNewFormatDTO[];

  function getSykmeldingForOppgave(): SykmeldingNewFormatDTO {
    const sykmelding = sykmeldinger.find(
      (sykmelding) =>
        sykmelding.id ===
        personOppgaveUbehandletBehandlerBerOmBistand.referanseUuid,
    );
    if (!sykmelding) {
      throw new Error("Fant ikke mock-sykmelding for oppgaven");
    }
    return sykmelding;
  }

  function setSykmeldingForOppgave(
    sykmeldingForOppgave: SykmeldingNewFormatDTO,
  ) {
    queryClient.setQueryData(
      sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
      () =>
        sykmeldinger.map((sykmelding) =>
          sykmelding.id === sykmeldingForOppgave.id
            ? sykmeldingForOppgave
            : sykmelding,
        ),
    );
  }

  function withAnnetArbeidPaSikt(
    sykmelding: SykmeldingNewFormatDTO,
    annetArbeidPaSikt: boolean,
  ): SykmeldingNewFormatDTO {
    return {
      ...sykmelding,
      prognose: {
        arbeidsforEtterPeriode: false,
        ...sykmelding.prognose,
        erIArbeid: {
          egetArbeidPaSikt: false,
          ...sykmelding.prognose?.erIArbeid,
          annetArbeidPaSikt,
        },
      },
    };
  }

  it("Viser VurderBistandsbehov panel", () => {
    renderBistandsbehovOppgaver();

    expect(
      screen.getByRole("heading", {
        name: "Vurder bistandsbehovet eller forslag til tiltak fra behandler:",
      }),
    ).to.exist;
    expect(
      screen.getByRole("button", {
        name: behandlePersonoppgaveKnappText,
      }),
    ).to.exist;
    expect(
      screen.getByText(
        "Felt 7.2 (Forslag til tiltak i regi fra Nav): Vedlikehold av holodeck",
      ),
    ).to.exist;
    expect(
      screen.getByText(
        "Felt 7.3 (Andre innspill til Nav): Mer vedlikehold av holodeck",
      ),
    ).to.exist;
    expect(
      screen.getByText(
        "Felt 8.2 (Melding til Nav): Nav kan vise til egen forskning på faren med phaser blasts",
      ),
    ).to.exist;
    expect(screen.getByText(annetArbeidPaSiktText)).to.exist;
    expect(
      screen.getByRole("link", {
        name: "Gå til sykmeldingen",
      }),
    ).to.exist;
  });

  it("Viser VurderBistandsbehov panel for duplikat oppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        personOppgaveUbehandletBehandlerBerOmBistand,
        personOppgaveUbehandletBehandlerBerOmBistand2,
      ],
    );
    renderBistandsbehovOppgaver();

    expect(
      screen.getAllByRole("heading", {
        name: "Vurder bistandsbehovet eller forslag til tiltak fra behandler:",
      }),
    ).to.have.length(2);
    expect(
      screen.getAllByRole("button", {
        name: behandlePersonoppgaveKnappText,
      }),
    ).to.have.length(2);
    expect(
      screen.getAllByRole("link", {
        name: "Gå til sykmeldingen",
      }),
    ).to.have.length(2);
    expect(
      screen.getByRole("link", {
        name: "Gå til tidligere sykmelding med duplikate felter",
      }),
    ).to.exist;
    expect(screen.getByText("Mulig duplikat")).to.exist;
  });

  it("Behandler ber-om-bistand oppgaven med riktig uuid for personoppgaven", async () => {
    renderBistandsbehovOppgaver();

    await clickButton(behandlePersonoppgaveKnappText);

    const behandleMutation = queryClient.getMutationCache().getAll()[0];

    expect(behandleMutation.state.variables).to.deep.equal(
      personOppgaveUbehandletBehandlerBerOmBistand.uuid,
    );
  });

  describe("annetArbeidPaSikt", () => {
    it("Viser kun felt 5.2.2 når sykmeldingen bare har annetArbeidPaSikt", () => {
      const sykmelding = withAnnetArbeidPaSikt(getSykmeldingForOppgave(), true);
      setSykmeldingForOppgave({
        ...sykmelding,
        tiltakNAV: undefined,
        andreTiltak: undefined,
        meldingTilNAV: { bistandUmiddelbart: false },
      });

      renderBistandsbehovOppgaver();

      expect(screen.getByText(annetArbeidPaSiktText)).to.exist;
      expect(screen.queryByText(/Felt 7.2/)).to.not.exist;
      expect(screen.queryByText(/Felt 7.3/)).to.not.exist;
      expect(screen.queryByText(/Felt 8.2/)).to.not.exist;
    });

    it("Viser ikke felt 5.2.2 når annetArbeidPaSikt er false", () => {
      setSykmeldingForOppgave(
        withAnnetArbeidPaSikt(getSykmeldingForOppgave(), false),
      );

      renderBistandsbehovOppgaver();

      expect(screen.queryByText(annetArbeidPaSiktText)).to.not.exist;
      expect(screen.getByText(/Felt 7.2/)).to.exist;
    });
  });
});
