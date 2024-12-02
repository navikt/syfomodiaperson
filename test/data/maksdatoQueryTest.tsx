import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { testQueryClient } from "../testQueryClient";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { maksdato, maksdatoMock } from "@/mocks/syfoperson/persondataMock";
import { stubMaxdateApi } from "../stubs/stubSykepengerdagerInformasjon";

let queryClient: any;

describe("maksdatoQuery", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads maksdatoDTO for valgt personident", async () => {
    stubMaxdateApi(maksdato);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useMaksdatoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data?.maxDate?.id).to.deep.equal(
      maksdatoMock.maxDate.id
    );
    expect(result.current.data?.maxDate?.fnr).to.deep.equal(
      maksdatoMock.maxDate.fnr
    );
    expect(result.current.data?.maxDate?.opprettet).to.deep.equal(
      maksdatoMock.maxDate.opprettet
    );
    expect(result.current.data?.maxDate?.utbetalt_tom).to.deep.equal(
      maksdatoMock.maxDate.utbetalt_tom
    );
    expect(result.current.data?.maxDate?.gjenstaende_sykedager).to.deep.equal(
      maksdatoMock.maxDate.gjenstaende_sykedager
    );
    expect(
      result.current.data?.maxDate?.forelopig_beregnet_slutt
    ).to.deep.equal(
      maksdatoMock.maxDate.forelopig_beregnet_slutt.toISOString()
    );
  });
});
