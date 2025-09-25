import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
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

    await waitFor(() => expect(result.current.data).to.not.be.undefined);
    const data = result.current.data?.maxDate;
    expect(data?.id).to.deep.equal(maksdatoMock.maxDate.id);
    expect(data?.fnr).to.deep.equal(maksdatoMock.maxDate.fnr);
    expect(data?.opprettet).to.deep.equal(maksdatoMock.maxDate.opprettet);

    const toIso = (d: any) => new Date(d).toISOString();

    // Date fields may arrive as either string (from JSON) or Date depending on runtime parsing.
    expect(toIso(data?.utbetalt_tom)).to.equal(
      toIso(maksdatoMock.maxDate.utbetalt_tom)
    );
    expect(toIso(data?.tom)).to.equal(toIso(maksdatoMock.maxDate.tom));
    expect(toIso(data?.forelopig_beregnet_slutt)).to.equal(
      toIso(maksdatoMock.maxDate.forelopig_beregnet_slutt)
    );

    expect(data?.gjenstaende_sykedager).to.deep.equal(
      maksdatoMock.maxDate.gjenstaende_sykedager
    );
  });
});
