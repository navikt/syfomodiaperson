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
import { senOppfolgingSvarQueryKeys } from "@/data/senoppfolging/useSenoppfolgingSvarQuery";
import { merOppfolgingMock } from "../../mock/meroppfolging-backend/merOppfolgingMock";
import { senOppfolgingKandidatQueryKeys } from "@/data/senoppfolging/useSenoppfolgingKandidatQuery";
import {
  ferdigbehandletKandidatMock,
  senOppfolgingKandidatMock,
} from "../../mock/ismeroppfolging/mockIsmeroppfolging";
import { toDatePrettyPrint } from "@/utils/datoUtils";

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
    queryClient.setQueryData(
      senOppfolgingSvarQueryKeys.senOppfolgingSvar(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => merOppfolgingMock
    );
    renderSenOppfolging();

    merOppfolgingMock.questionResponses.map((questionResponse) => {
      expect(screen.getByText(questionResponse.questionText)).to.exist;
      expect(screen.getByText(questionResponse.answerText)).to.exist;
    });
  });

  it("Viser ingen knapp eller tekst for vurdering når bruker ikke er kandidat til sen oppfølging", () => {
    queryClient.setQueryData(
      senOppfolgingSvarQueryKeys.senOppfolgingSvar(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => merOppfolgingMock
    );
    renderSenOppfolging();

    expect(screen.queryByRole("button", { name: vurderingButtonText })).to.not
      .exist;
    expect(screen.queryByText(/Vurdert av/)).to.not.exist;
  });

  it("Viser knapp for å fullføre vurdering når bruker er kandidat til sen oppfølging", () => {
    queryClient.setQueryData(
      senOppfolgingSvarQueryKeys.senOppfolgingSvar(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => merOppfolgingMock
    );
    queryClient.setQueryData(
      senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [senOppfolgingKandidatMock]
    );
    renderSenOppfolging();

    expect(screen.getByRole("button", { name: vurderingButtonText })).to.exist;
    expect(screen.queryByText(/Vurdert av/)).to.not.exist;
  });

  it("Viser ferdigbehandlet vurdering når bruker er ferdigbehandlet kandidat til sen oppfølging", () => {
    const vurdertDato = ferdigbehandletKandidatMock.vurderinger[0].createdAt;
    queryClient.setQueryData(
      senOppfolgingSvarQueryKeys.senOppfolgingSvar(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => merOppfolgingMock
    );
    queryClient.setQueryData(
      senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [ferdigbehandletKandidatMock]
    );

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
});
