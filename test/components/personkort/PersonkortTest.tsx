import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";
import { render, screen } from "@testing-library/react";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";
import Personkort from "@/components/personkort/Personkort";
import { daysFromToday, getButton } from "../../testUtils";
import userEvent from "@testing-library/user-event";

let queryClient: QueryClient;

const renderAndExpandPersonkort = async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Personkort />
    </QueryClientProvider>
  );
  const expandable = screen.getAllByRole("button")[0];
  await userEvent.click(expandable);
};

describe("Personkort", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
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
      })
    );

    await renderAndExpandPersonkort();

    expect(getButton("Sikkerhetstiltak")).to.exist;
  });

  it("Skal ikke vise Sikkerhetstiltak-button-tab hvis bruker mangler sikkerhetstiltak", async () => {
    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );

    await renderAndExpandPersonkort();

    expect(screen.queryByRole("button", { name: "Sikkerhetstiltak" })).to.not
      .exist;
  });
});
