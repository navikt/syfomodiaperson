import { render, screen } from "@testing-library/react";
import PersonkortSykmeldt from "@/components/personkort/PersonkortSykmeldt";
import { expect } from "chai";
import React from "react";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import { arbeidstaker } from "../../dialogmote/testData";
import { QueryClient, QueryClientProvider } from "react-query";
import { apiMock } from "../../stubs/stubApi";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { stubPersonadresseApi } from "../../stubs/stubSyfoperson";
import { vegadresse } from "../../../mock/data/personAdresseMock";

let queryClient;
let apiMockScope;
const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const mockState = {
  valgtbruker: {
    personident: arbeidstaker.personident,
  },
};

const navbruker: Brukerinfo = {
  arbeidssituasjon: "",
  navn: "Knut",
  kontaktinfo: {
    fnr: "1234",
  },
};

const renderPersonkortSykmeldt = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store({ ...realState, ...mockState })}>
        <PersonkortSykmeldt navbruker={navbruker} />
      </Provider>
    </QueryClientProvider>
  );

describe("PersonkortSykmeldt", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });

  it("Skal vise PersonkortElement", () => {
    renderPersonkortSykmeldt();
    expect(screen.getByRole("heading", { name: "Kontaktinformasjon" })).to
      .exist;
    expect(screen.getByRole("img", { name: "Bilde av person" })).to.exist;
  });

  it("Skal vise PersonkortInformasjon", () => {
    renderPersonkortSykmeldt();
    expect(screen.getByText("F.nummer")).to.exist;
    expect(screen.getByText("Telefon")).to.exist;
    expect(screen.getByText("E-post")).to.exist;
    expect(screen.getByText("Bostedsadresse")).to.exist;
    expect(screen.getByText("Kontaktadresse")).to.exist;
    expect(screen.getByText("Oppholdsadresse")).to.exist;
  });

  it("Skal vise adresser", async () => {
    stubPersonadresseApi(apiMockScope);
    renderPersonkortSykmeldt();

    const expectedAdresse = `${vegadresse.adressenavn} ${vegadresse.husnummer}`;
    expect(await screen.findAllByText(expectedAdresse)).to.have.length(2);
  });
});
