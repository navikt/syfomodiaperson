import { apiMock } from "../../stubs/stubApi";
import { QueryClient, QueryClientProvider } from "react-query";
import nock from "nock";
import { render, screen } from "@testing-library/react";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import PersonkortEnhet from "@/components/personkort/PersonkortEnhet";
import { arbeidstaker } from "../../dialogmote/testData";
import { stubBehandlendeEnhetApi } from "../../stubs/stubSyfobehandlendeEnhet";
import { expect } from "chai";

const store = configureStore([]);
let queryClient;
let apiMockScope;

const mockState = {
  valgtbruker: { personident: arbeidstaker.personident },
};
const enhet = { enhetId: "1234", navn: "NAV Drammen" };

const renderPersonkortEnhet = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store(mockState)}>
        <PersonkortEnhet />
      </Provider>
    </QueryClientProvider>
  );

describe("PersonkortEnhet", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
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
