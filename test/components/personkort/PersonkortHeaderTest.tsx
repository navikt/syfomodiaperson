import {
  stubDiskresjonskodeApi,
  stubEgenansattApi,
} from "../../stubs/stubSyfoperson";
import { apiMock } from "../../stubs/stubApi";
import { QueryClient, QueryClientProvider } from "react-query";
import nock from "nock";
import { render } from "@testing-library/react";
import React from "react";
import PersonkortHeader from "@/components/personkort/PersonkortHeader";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { expect } from "chai";

const store = configureStore([]);
let queryClient;
let apiMockScope;

const fnr = "05087321470";
const mockState = {
  valgtbruker: { personident: fnr },
};
const navbruker = {
  navn: "Arne Arbeistaker",
  kontaktinfo: { fnr },
  arbeidssituasjon: "ARBEIDSTAKER",
};

describe("PersonkortHeader", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("viser 'Egenansatt' når isEgenansatt er true fra API", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubDiskresjonskodeApi(apiMockScope);
    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <PersonkortHeader navbruker={navbruker} sykmeldinger={[]} />
        </Provider>
      </QueryClientProvider>
    );

    expect(await wrapper.findByText("Egenansatt")).to.exist;
  });

  it("viser ikke 'Egenansatt' når isEgenansatt er false fra API", async () => {
    stubEgenansattApi(apiMockScope, false);
    stubDiskresjonskodeApi(apiMockScope);
    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <PersonkortHeader navbruker={navbruker} sykmeldinger={[]} />
        </Provider>
      </QueryClientProvider>
    );

    expect(wrapper.queryByText("Egenansatt")).not.to.exist;
  });

  it("viser 'Kode 6' når diskresjonskode er 6 fra API", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubDiskresjonskodeApi(apiMockScope, "6");
    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <PersonkortHeader navbruker={navbruker} sykmeldinger={[]} />
        </Provider>
      </QueryClientProvider>
    );

    expect(await wrapper.findByText("Kode 6")).to.exist;
  });

  it("viser 'Kode 7' når diskresjonskode er 7 fra API", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubDiskresjonskodeApi(apiMockScope, "7");
    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <PersonkortHeader navbruker={navbruker} sykmeldinger={[]} />
        </Provider>
      </QueryClientProvider>
    );

    expect(await wrapper.findByText("Kode 7")).to.exist;
  });

  it("viser ingen diskresjonskode når diskresjonskode er tom fra API", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubDiskresjonskodeApi(apiMockScope);
    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <PersonkortHeader navbruker={navbruker} sykmeldinger={[]} />
        </Provider>
      </QueryClientProvider>
    );

    expect(wrapper.queryByText("Kode")).not.to.exist;
  });
});
