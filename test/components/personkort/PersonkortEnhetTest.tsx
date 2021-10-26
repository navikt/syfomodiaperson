import { apiMock } from "../../stubs/stubApi";
import { QueryClient, QueryClientProvider } from "react-query";
import nock from "nock";
import { render } from "@testing-library/react";
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
    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <PersonkortEnhet />
        </Provider>
      </QueryClientProvider>
    );

    expect(await wrapper.findByText("NAV Drammen")).to.exist;
    expect(await wrapper.findByText("1234")).to.exist;
  });

  it("viser feilmelding når behandlende ikke funnet", async () => {
    stubBehandlendeEnhetApi(apiMockScope);
    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <PersonkortEnhet />
        </Provider>
      </QueryClientProvider>
    );

    expect(
      await wrapper.findByText(
        "Fant ikke behandlende enhet for person, prøv igjen senere."
      )
    ).to.exist;
  });
});
