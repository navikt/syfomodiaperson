import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import SenOppfolging from "@/sider/senoppfolging/SenOppfolging";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { senOppfolgingSvarQueryKeys } from "@/data/senoppfolging/useSenoppfolgingSvarQuery";
import { senOppfolgingMock } from "../../mock/meroppfolging-backend/SenOppfolgingMock";

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
    senOppfolgingMock.questionResponses.map((questionResponse) => {
      expect(screen.queryByText(questionResponse.questionText)).to.not.exist;
      expect(screen.queryByText(questionResponse.answerText)).to.not.exist;
    });
  });

  it("Viser side for oppfølging i sen fase med svar fra bruker", () => {
    queryClient.setQueryData(
      senOppfolgingSvarQueryKeys.senOppfolgingSvar(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => senOppfolgingMock
    );
    renderSenOppfolging();

    senOppfolgingMock.questionResponses.map((questionResponse) => {
      expect(screen.getByText(questionResponse.questionText)).to.exist;
      expect(screen.getByText(questionResponse.answerText)).to.exist;
    });
  });
});
