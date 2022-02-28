import { apiMock } from "../../stubs/stubApi";
import { QueryClientProvider } from "react-query";
import nock from "nock";
import { render, screen } from "@testing-library/react";
import React from "react";
import PersonkortEnhet from "@/components/personkort/PersonkortEnhet";
import { stubBehandlendeEnhetApi } from "../../stubs/stubSyfobehandlendeEnhet";
import { expect } from "chai";
import { queryClientWithAktivBruker } from "../../testQueryClient";

let queryClient;
let apiMockScope;

const enhet = { enhetId: "1234", navn: "NAV Drammen" };

const renderPersonkortEnhet = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PersonkortEnhet />
    </QueryClientProvider>
  );

describe("PersonkortEnhet", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("viser behandlende enhet fra API", async () => {
    stubBehandlendeEnhetApi(apiMockScope, enhet);
    renderPersonkortEnhet();

    expect(await screen.findByText("NAV Drammen")).to.exist;
    expect(await screen.findByText("1234")).to.exist;
  });

  it("viser feilmelding når behandlende ikke funnet", async () => {
    stubBehandlendeEnhetApi(apiMockScope);
    renderPersonkortEnhet();

    expect(
      await screen.findByText(
        "Fant ikke behandlende enhet for person, prøv igjen senere."
      )
    ).to.exist;
  });
});
