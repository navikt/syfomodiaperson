import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { mockServer } from "../setup";
import { queryClientWithMockData } from "../testQueryClient";
import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { UtenlandsoppholdSoknad } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknad.tsx";
import { SoknaderResponseDTO } from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { utenlandsoppholdQueryKeys } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { MemoryRouter } from "react-router-dom";

let queryClient: QueryClient;

const renderUtenlandsoppholdSoknad = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <UtenlandsoppholdSoknad />
      </MemoryRouter>
    </QueryClientProvider>,
  );

const stubSoknaderQuery = (response: SoknaderResponseDTO) =>
  mockServer.use(
    http.post(`*${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () =>
      HttpResponse.json(response),
    ),
  );

describe("UtenlandsoppholdSoknad", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser feilmelding når henting av søknader feiler", async () => {
    queryClient.setQueryDefaults(
      utenlandsoppholdQueryKeys.soknader(ARBEIDSTAKER_DEFAULT.personIdent),
      { retry: false },
    );

    renderUtenlandsoppholdSoknad();

    expect(
      await screen.findByText(
        "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
      ),
    ).to.exist;
  });

  it("viser melding om at søknaden mangler når listen er tom", async () => {
    stubSoknaderQuery({ soknader: [] });

    renderUtenlandsoppholdSoknad();

    expect(await screen.findByText("Fant ikke søknaden")).to.exist;
  });
});
