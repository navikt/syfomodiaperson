import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { stubPersonoppgaveApi } from "../stubs/stubIspersonoppgave";
import { personoppgaverMock } from "@/mocks/ispersonoppgave/personoppgaveMock";
import { testQueryClient } from "../testQueryClient";

let queryClient: QueryClient;

describe("personoppgaveQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads personoppgaver for valgt personident", async () => {
    stubPersonoppgaveApi();

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => usePersonoppgaverQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.equal(true));

    expect(result.current.data).to.deep.equal(
      personoppgaverMock().map((oppgave) => ({
        ...oppgave,
        opprettet: new Date(oppgave.opprettet),
        behandletTidspunkt: oppgave.behandletTidspunkt
          ? new Date(oppgave.behandletTidspunkt)
          : null,
      })),
    );
  });
});
