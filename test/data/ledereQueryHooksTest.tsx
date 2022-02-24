import { NarmesteLederRelasjonStatus } from "@/data/leder/ledereTypes";
import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { stubNarmestelederApi } from "../stubs/stubIsnarmesteleder";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";

const currentLedere = [
  {
    narmesteLederNavn: "Kurt Nilsen",
    status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
  },
  {
    narmesteLederNavn: "Nina Knutsen",
    status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
  },
];
const formerLedere = [
  {
    narmesteLederNavn: "Trine Fransen",
    aktivTom: "2020-04-20T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT,
  },
  {
    narmesteLederNavn: "Hans Hansen",
    aktivTom: "2020-02-20T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT,
  },
];
const ledereData = [...currentLedere, ...formerLedere];

let queryClient;
let apiMockScope;

describe("ledereQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads ledere for valgt personident", async () => {
    stubNarmestelederApi(apiMockScope, ledereData);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useLedereQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(ledereData);
    expect(result.current.allLedere).to.deep.equal(ledereData);
    expect(result.current.currentLedere).to.deep.equal(currentLedere);
    expect(result.current.formerLedere).to.deep.equal(formerLedere);
  });
});
