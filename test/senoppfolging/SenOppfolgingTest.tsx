import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import SenOppfolging from "@/sider/senoppfolging/SenOppfolging";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { senOppfolgingSvarQueryKeys } from "@/data/senoppfolging/useSenOppfolgingSvarQuery";
import { merOppfolgingMock } from "../../mock/meroppfolging-backend/merOppfolgingMock";
import { senOppfolgingKandidatQueryKeys } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import {
  ferdigbehandletKandidatMock,
  senOppfolgingKandidatMock,
} from "../../mock/ismeroppfolging/mockIsmeroppfolging";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { clickButton } from "../testUtils";

let queryClient: QueryClient;

const renderSenOppfolging = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <SenOppfolging />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
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
  kandidat: SenOppfolgingKandidatResponseDTO
) => {
  queryClient.setQueryData(
    senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => [kandidat]
  );
};

describe("Sen oppfolging", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser infotekst når bruker ikke har fått varsel eller svart", () => {
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

  it("Viser side for oppfølging i sen fase med svar fra bruker", () => {
    mockSenOppfolgingSvar();
    renderSenOppfolging();

    merOppfolgingMock.questionResponses.map((questionResponse) => {
      expect(screen.getByText(questionResponse.questionText)).to.exist;
      expect(screen.getByText(questionResponse.answerText)).to.exist;
    });
  });

  it("Viser ingen knapp eller tekst for vurdering når bruker ikke er kandidat til sen oppfølging", () => {
    mockSenOppfolgingSvar();
    renderSenOppfolging();

    expect(screen.queryByRole("button", { name: vurderingButtonText })).to.not
      .exist;
    expect(screen.queryByText(/Vurdert av/)).to.not.exist;
  });

  it("Viser knapp for å fullføre vurdering når bruker er kandidat til sen oppfølging", () => {
    mockSenOppfolgingSvar();
    mockSenOppfolgingKandidat(senOppfolgingKandidatMock);
    renderSenOppfolging();

    expect(screen.getByRole("button", { name: vurderingButtonText })).to.exist;
    expect(screen.queryByText(/Vurdert av/)).to.not.exist;
  });

  it("Viser ferdigbehandlet vurdering når bruker er ferdigbehandlet kandidat til sen oppfølging", () => {
    const vurdertDato = ferdigbehandletKandidatMock.vurderinger[0].createdAt;
    mockSenOppfolgingSvar();
    mockSenOppfolgingKandidat(ferdigbehandletKandidatMock);

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
    mockSenOppfolgingKandidat(senOppfolgingKandidatMock);
    renderSenOppfolging();

    await clickButton(vurderingButtonText);

    const vurderingMutation = queryClient.getMutationCache().getAll()[0];
    expect(vurderingMutation.state.variables).to.deep.equal({
      type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
    });
  });
});
