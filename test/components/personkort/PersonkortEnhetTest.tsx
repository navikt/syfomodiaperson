import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { PersonkortEnhet } from "@/components/personkort/PersonkortEnhet";
import { stubBehandlendeEnhetApi } from "../../stubs/stubSyfobehandlendeEnhet";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { BehandlendeEnhetResponseDTO } from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";

let queryClient: any;

const behandlendeEnhetUtenOverstyring: BehandlendeEnhetResponseDTO = {
  geografiskEnhet: { enhetId: "1234", navn: "Nav Drammen" },
  oppfolgingsenhetDTO: null,
};

const renderPersonkortEnhet = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PersonkortEnhet />
    </QueryClientProvider>
  );

describe("PersonkortEnhet", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
  });

  it("viser behandlende enhet fra API", async () => {
    stubBehandlendeEnhetApi(behandlendeEnhetUtenOverstyring);
    renderPersonkortEnhet();

    expect(await screen.findByText("Nav Drammen")).to.exist;
    expect(await screen.findByText("1234")).to.exist;
  });

  it("viser feilmelding når behandlende ikke funnet", async () => {
    stubBehandlendeEnhetApi();
    renderPersonkortEnhet();

    expect(
      await screen.findByText(
        "Fant ikke behandlende enhet for person, prøv igjen senere."
      )
    ).to.exist;
  });

  it("viser endre enhet til Nav utland", async () => {
    stubBehandlendeEnhetApi(behandlendeEnhetUtenOverstyring);
    renderPersonkortEnhet();

    expect(await screen.findByRole("button", { name: "Endre til Nav utland" }))
      .to.exist;
  });

  it("viser endre enhet til geografisk enhet hvis allerede Nav utland", async () => {
    const utlandEnhet: BehandlendeEnhetResponseDTO = {
      geografiskEnhet: { enhetId: "1235", navn: "Nav Asker" },
      oppfolgingsenhetDTO: {
        enhet: { enhetId: "0393", navn: "Nav Utland" },
        createdAt: new Date("2024-10-15"),
        veilederident: "Z999999",
      },
    };
    stubBehandlendeEnhetApi(utlandEnhet);
    renderPersonkortEnhet();

    expect(
      await screen.findByRole("button", {
        name: "Endre til geografisk enhet (1235)",
      })
    ).to.exist;
  });
});
