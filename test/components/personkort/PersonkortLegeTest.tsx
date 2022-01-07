import { fastlegerQueryKeys } from "@/data/fastlege/fastlegerQueryHooks";
import { arbeidstaker } from "../../dialogmote/testData";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import PersonkortLege, {
  TidligereLeger,
} from "@/components/personkort/PersonkortLege";
import { expect } from "chai";
import React from "react";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { apiMock } from "../../stubs/stubApi";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";

let queryClient;
let apiMockScope;
let komponent;

const aktivFastlege = {
  pasientforhold: {
    fom: "2021-10-01",
    tom: "9999-12-31",
  },
};
const tidligereFastleger = [
  {
    pasientforhold: {
      fom: "2019-10-01",
      tom: "2020-10-01",
    },
  },
  {
    pasientforhold: {
      fom: "2020-10-01",
      tom: "2021-10-01",
    },
  },
];
const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const mockState = {
  valgtbruker: {
    personident: arbeidstaker.personident,
  },
};

describe("PersonkortLege", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
    stubFastlegerApi(apiMockScope, arbeidstaker.personident);
  });

  it("Skal vise feilmelding, fastleger ikke ble funnet, når ingen fastleger", async () => {
    const expectedFeilmelding =
      "Det kan hende brukeren ikke har en fastlege. Ta kontakt med brukeren for å få behandlers kontaktopplysninger.";
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(arbeidstaker.personident),
      () => []
    );
    komponent = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortLege />
        </Provider>
      </QueryClientProvider>
    );
    expect(komponent.getByText(expectedFeilmelding)).to.exist;
  });

  it("Skal vise overskrifter for aktiv fastlege og tidligere fastleger", async () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(arbeidstaker.personident),
      () => [aktivFastlege, ...tidligereFastleger]
    );

    komponent = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortLege />
        </Provider>
      </QueryClientProvider>
    );
    expect(await komponent.findByRole("heading", { name: "Lego Legesen" })).to
      .exist;
    expect(
      await komponent.findByRole("heading", { name: "Tidligere fastleger" })
    ).to.exist;
  });

  it("Skal vise tidligere leger", async () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(arbeidstaker.personident),
      () => [aktivFastlege, ...tidligereFastleger]
    );

    komponent = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortLege />
        </Provider>
      </QueryClientProvider>
    );
    expect(
      await komponent.findByText(
        "1. oktober 2011 - 1. oktober 2021 Annen Legesen"
      )
    ).to.exist;
  });

  it("Skal ikke vise tidligere leger dersom det ikke er tidligere fastleger", () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(arbeidstaker.personident),
      () => [aktivFastlege]
    );
    komponent = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortLege />
        </Provider>
      </QueryClientProvider>
    );
    expect(komponent.queryByRole("heading", { name: "Tidligere fastleger" })).to
      .not.exist;
  });

  describe("TidligereLeger", () => {
    it("Skal vise en liste med antall element lik antall tidligere fastleger", () => {
      komponent = render(
        <TidligereLeger tidligereFastleger={tidligereFastleger} />
      );
      expect(komponent.getAllByRole("listitem")).to.have.length(
        tidligereFastleger.length
      );
      expect(komponent.getByText(/1. oktober 2019 - 1. oktober 2020/)).to.exist;
      expect(komponent.getByText(/1. oktober 2020 - 1. oktober 2021/)).to.exist;
    });
  });
});
