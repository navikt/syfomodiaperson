import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { stubSykmeldingApi } from "../stubs/stubSyfosmregister";
import { sykmeldingerMock } from "../../mock/data/sykmeldingerMock";
import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import {
  newSMFormat2OldFormat,
  oldFormatSMForAG,
} from "@/utils/sykmeldinger/sykmeldingParser";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

let queryClient;
let apiMockScope;

const sykmeldingerMockData = (sykmeldingerMock as unknown) as SykmeldingNewFormatDTO[];

describe("sykmeldingQueryHooks", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads sykmeldinger og arbeidsgivers sykmeldinger", async () => {
    stubSykmeldingApi(apiMockScope);
    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useSykmeldingerQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.sykmeldinger).to.deep.equal(
      sykmeldingerMockData.map((value) =>
        newSMFormat2OldFormat(value, ARBEIDSTAKER_DEFAULT.personIdent)
      )
    );
    expect(result.current.arbeidsgiverssykmeldinger).to.deep.equal(
      sykmeldingerMockData.map((value) =>
        oldFormatSMForAG(value, ARBEIDSTAKER_DEFAULT.personIdent)
      )
    );
  });
});
