import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import PersonkortEnhet from "@/components/personkort/PersonkortEnhet";
import {
  stubBehandlendeEnhetApi,
  stubChangeEnhetApi,
} from "../../stubs/stubSyfobehandlendeEnhet";
import { expect, describe, it, beforeEach } from "vitest";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { PersonDTO } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import { DEFAULT_GODKJENT_FNR } from "@/mocks/util/requestUtil";

let queryClient: any;

const enhet = { enhetId: "1234", navn: "NAV Drammen" };
const person: PersonDTO = {
  personident: DEFAULT_GODKJENT_FNR,
  isNavUtland: false,
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
    stubBehandlendeEnhetApi(enhet);
    renderPersonkortEnhet();

    expect(await screen.findByText("NAV Drammen")).to.exist;
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

  it("viser endre enhet til NAV utland", async () => {
    stubBehandlendeEnhetApi(enhet);
    stubChangeEnhetApi(person);
    renderPersonkortEnhet();

    expect(await screen.findByRole("button", { name: "Endre til NAV utland" }))
      .to.exist;
  });

  it("viser endre enhet til geografisk enhet hvis allerede NAV utland", async () => {
    const utlandEnhet = { enhetId: "0393", navn: "NAV Utland" };
    stubBehandlendeEnhetApi(utlandEnhet);
    stubChangeEnhetApi(person);
    renderPersonkortEnhet();

    expect(
      await screen.findByRole("button", { name: "Endre til geografisk enhet" })
    ).to.exist;
  });
});
