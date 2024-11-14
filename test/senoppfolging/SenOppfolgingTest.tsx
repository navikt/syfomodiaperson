import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import SenOppfolging from "@/sider/senoppfolging/SenOppfolging";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "@/mocks/common/mockConstants";
import { senOppfolgingSvarQueryKeys } from "@/data/senoppfolging/useSenOppfolgingSvarQuery";
import { merOppfolgingMock } from "@/mocks/meroppfolging-backend/merOppfolgingMock";
import { senOppfolgingKandidatQueryKeys } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import {
  ferdigbehandletKandidatMock,
  senOppfolgingKandidatMock,
} from "@/mocks/ismeroppfolging/mockIsmeroppfolging";
import {
  addDays,
  addWeeks,
  tilLesbarDatoMedArUtenManedNavn,
  toDatePrettyPrint,
} from "@/utils/datoUtils";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { renderWithRouter } from "../testRouterUtils";
import { senOppfolgingPath } from "@/routers/AppRouter";

let queryClient: QueryClient;

const renderSenOppfolging = () =>
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <SenOppfolging />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    senOppfolgingPath,
    [senOppfolgingPath]
  );

const vurderingButtonText = "Fullfør vurdering";

const mockSenOppfolgingSvar = () => {
  queryClient.setQueryData(
    senOppfolgingSvarQueryKeys.senOppfolgingSvar(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => merOppfolgingMock
  );
};
const mockSenOppfolgingKandidat = (
  kandidater: SenOppfolgingKandidatResponseDTO[]
) => {
  queryClient.setQueryData(
    senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => kandidater
  );
};

describe("Sen oppfolging", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser infotekst når bruker ikke har fått varsel eller svart", () => {
    mockSenOppfolgingKandidat([]);
    renderSenOppfolging();

    expect(
      screen.getByText(
        "Den sykmeldte har ikke mottatt varsel om at det snart er slutt på sykepengene enda."
      )
    ).to.exist;
    merOppfolgingMock.questionResponses.map((questionResponse) => {
      expect(screen.queryByText(questionResponse.questionText)).to.not.exist;
      expect(screen.queryByText(questionResponse.answerText)).to.not.exist;
    });
  });

  it("Viser infotekst om varsel når bruker har fått varsel og ikke svart", () => {
    const varselDato = addWeeks(new Date(), -1);
    const varselSvarFrist = addDays(varselDato, 10);
    mockSenOppfolgingKandidat([
      {
        ...senOppfolgingKandidatMock,
        svar: undefined,
        varselAt: varselDato,
      },
    ]);
    renderSenOppfolging();

    expect(screen.getByText("Den sykmeldte har ikke svart")).to.exist;
    expect(screen.getByText(/Den sykmeldte fikk varsel/)).to.exist;
    expect(
      screen.getByText(tilLesbarDatoMedArUtenManedNavn(varselDato), {
        exact: false,
      })
    );
    expect(
      screen.getByText(tilLesbarDatoMedArUtenManedNavn(varselSvarFrist), {
        exact: false,
      })
    );
  });

  it("Viser side for oppfølging i sen fase med svar fra bruker", () => {
    mockSenOppfolgingSvar();
    mockSenOppfolgingKandidat([senOppfolgingKandidatMock]);
    renderSenOppfolging();

    merOppfolgingMock.questionResponses.map((questionResponse) => {
      expect(screen.getByText(questionResponse.questionText)).to.exist;
      expect(screen.getByText(questionResponse.answerText)).to.exist;
    });
  });

  it("Viser ingen knapp eller tekst for vurdering når bruker er kandidat til sen oppfølging uten å ha svart og varsel ikke utløpt", () => {
    mockSenOppfolgingKandidat([
      {
        ...senOppfolgingKandidatMock,
        svar: undefined,
      },
    ]);
    renderSenOppfolging();

    expect(screen.queryByRole("button", { name: vurderingButtonText })).to.not
      .exist;
    expect(screen.queryByText(/Vurdert av/)).to.not.exist;
  });

  it("Viser ingen knapp eller tekst for vurdering når bruker ikke er kandidat til sen oppfølging", () => {
    mockSenOppfolgingKandidat([]);
    mockSenOppfolgingSvar();
    renderSenOppfolging();

    expect(screen.queryByRole("button", { name: vurderingButtonText })).to.not
      .exist;
    expect(screen.queryByText(/Vurdert av/)).to.not.exist;
  });

  it("Viser knapp for å fullføre vurdering når bruker er kandidat til sen oppfølging uten å ha svart og varsel utløpt", () => {
    const varselDato = addDays(new Date(), -10);
    mockSenOppfolgingKandidat([
      {
        ...senOppfolgingKandidatMock,
        svar: undefined,
        varselAt: varselDato,
      },
    ]);
    renderSenOppfolging();

    expect(screen.getByText(/Den sykmeldte har fått en påminnelse/)).to.exist;
    expect(screen.getByText(/Du kan nå gjøre en vurdering/)).to.exist;
    expect(screen.getByRole("button", { name: vurderingButtonText })).to.exist;
  });

  it("Viser knapp for å fullføre vurdering når bruker er kandidat til sen oppfølging med svar", () => {
    mockSenOppfolgingSvar();
    mockSenOppfolgingKandidat([senOppfolgingKandidatMock]);
    renderSenOppfolging();

    expect(screen.getByRole("button", { name: vurderingButtonText })).to.exist;
    expect(screen.queryByText(/Vurdert av/)).to.not.exist;
  });

  it("Viser ferdigbehandlet vurdering når bruker er ferdigbehandlet kandidat til sen oppfølging", () => {
    const vurdertDato = ferdigbehandletKandidatMock.vurderinger[0].createdAt;
    mockSenOppfolgingSvar();
    mockSenOppfolgingKandidat([ferdigbehandletKandidatMock]);

    renderSenOppfolging();
    expect(screen.queryByRole("button", { name: vurderingButtonText })).to.not
      .exist;
    expect(
      screen.getByText(
        `Vurdert av ${VEILEDER_DEFAULT.fulltNavn()} ${toDatePrettyPrint(
          vurdertDato
        )}`
      )
    ).to.exist;
  });

  it("Trykk på fullfør vurdering ferdigbehandler kandidat", async () => {
    mockSenOppfolgingSvar();
    mockSenOppfolgingKandidat([senOppfolgingKandidatMock]);
    renderSenOppfolging();

    await clickButton(vurderingButtonText);

    const vurderingMutation = queryClient.getMutationCache().getAll()[0];
    expect(vurderingMutation.state.variables).to.deep.equal({
      type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
      begrunnelse: undefined,
    });
  });

  it("Fyll ut begrunnelse og trykk på fullfør vurdering ferdigbehandler kandidat", async () => {
    mockSenOppfolgingSvar();
    mockSenOppfolgingKandidat([senOppfolgingKandidatMock]);
    renderSenOppfolging();

    const begrunnelseInput = getTextInput("Begrunnelse (valgfritt)");
    await changeTextInput(begrunnelseInput, "En flott begrunnelse");
    await clickButton(vurderingButtonText);

    const vurderingMutation = queryClient.getMutationCache().getAll()[0];
    expect(vurderingMutation.state.variables).to.deep.equal({
      type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
      begrunnelse: "En flott begrunnelse",
    });
  });

  it("Viser link til ovingsside for snart slutt pa sykepengene", () => {
    mockSenOppfolgingSvar();
    mockSenOppfolgingKandidat([senOppfolgingKandidatMock]);
    renderSenOppfolging();

    expect(
      screen.getByRole("heading", {
        name: "Sykmeldtes svarskjema",
      })
    ).to.exist;
    const link = screen.getByRole("link", {
      name: "Se nyeste versjon av svarskjemaet her Ekstern lenke",
    });
    expect(link.getAttribute("href")).to.contain(
      "https://demo.ekstern.dev.nav.no/syk/meroppfolging/snart-slutt-pa-sykepengene"
    );
    expect(
      screen.getByText(
        "Lenken tar deg til en øvingsside der du trygt kan klikke deg rundt i skjemaet som den sykmeldte svarer på."
      )
    ).to.exist;
  });

  it("viser ingen historikk når person bare er kandidat nå", () => {
    mockSenOppfolgingKandidat([senOppfolgingKandidatMock]);
    renderSenOppfolging();

    expect(
      screen.getByRole("heading", {
        name: "Historikk",
      })
    );
    expect(
      screen.getByText(
        "Det finnes ingen tidligere oppfølging av snart slutt på sykepengene."
      )
    );
  });

  it("viser historikk når person har vært kandidat tidligere", () => {
    mockSenOppfolgingKandidat([
      senOppfolgingKandidatMock,
      ferdigbehandletKandidatMock,
    ]);
    renderSenOppfolging();

    expect(
      screen.getByRole("heading", {
        name: "Historikk",
      })
    );
    expect(
      screen.getByText("Tidligere oppfølging av snart slutt på sykepengene")
    );
  });
});
