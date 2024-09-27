import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { stubSykmeldingApi } from "../stubs/stubSyfosmregister";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import {
  newSMFormat2OldFormat,
  oldFormatSMForAG,
} from "@/utils/sykmeldinger/sykmeldingParser";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

const sykmeldingerMockData =
  sykmeldingerMock as unknown as SykmeldingNewFormatDTO[];

describe("sykmeldingQueryHooks", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads sykmeldinger og arbeidsgivers sykmeldinger", async () => {
    stubSykmeldingApi();
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useSykmeldingerQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

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
