import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";
import { render, screen } from "@testing-library/react";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";
import userEvent from "@testing-library/user-event";
import { Personkort } from "@/components/personkort/Personkort";
import { daysFromToday } from "@/utils/datoUtils.ts";

let queryClient: QueryClient;

async function renderAndExpandPersonkort() {
  render(
    <QueryClientProvider client={queryClient}>
      <Personkort />
    </QueryClientProvider>,
  );
  const expandable = screen.getAllByRole("button")[1];
  await userEvent.click(expandable);
}

describe("Personkort", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock,
    );
    stubFastlegerApi();
  });

  it("Skal vise Sikkerhetstiltak-button-tab hvis bruker har sikkerhetstiltak", async () => {
    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        ...brukerinfoMock,
        sikkerhetstiltak: [
          {
            type: "FYUS",
            beskrivelse: "Fysisk utestengelse",
            gyldigFom: daysFromToday(-10),
            gyldigTom: daysFromToday(10),
          },
        ],
      }),
    );
    await renderAndExpandPersonkort();

    expect(screen.getByRole("tab", { name: "Sikkerhetstiltak" })).to.exist;
  });

  it("Skal ikke vise Sikkerhetstiltak-button-tab hvis bruker mangler sikkerhetstiltak", async () => {
    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        ...brukerinfoMock,
        sikkerhetstiltak: [],
      }),
    );

    await renderAndExpandPersonkort();

    expect(screen.queryByRole("tab", { name: "Sikkerhetstiltak" })).to.not
      .exist;
  });
});
