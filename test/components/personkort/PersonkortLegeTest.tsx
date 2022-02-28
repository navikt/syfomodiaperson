import { fastlegerQueryKeys } from "@/data/fastlege/fastlegerQueryHooks";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import PersonkortLege, {
  FastlegeVikar,
} from "@/components/personkort/PersonkortLege";
import { expect } from "chai";
import React from "react";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { fastlegerMock } from "../../../mock/fastlegerest/fastlegerMock";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";

let queryClient;

const aktivFastlege = fastlegerMock[0];
const fastlegeVikarer = [fastlegerMock[1], fastlegerMock[2]];
const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const mockState = {
  valgtbruker: {
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
  },
};

const renderPersonkortLege = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store({ ...realState, ...mockState })}>
        <PersonkortLege />
      </Provider>
    </QueryClientProvider>
  );

describe("PersonkortLege", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it("Skal vise feilmelding, fastleger ikke ble funnet, når ingen fastleger", async () => {
    const expectedFeilmelding =
      "Det kan hende brukeren ikke har en fastlege. Ta kontakt med brukeren for å få behandlers kontaktopplysninger.";
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => []
    );
    renderPersonkortLege();

    expect(screen.getByText(expectedFeilmelding)).to.exist;
  });

  it("Skal vise overskrifter for aktiv fastlege og fastlegevikarer", async () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [aktivFastlege, ...fastlegeVikarer]
    );
    renderPersonkortLege();

    expect(await screen.findByRole("heading", { name: "Lege Legesen" })).to
      .exist;
    expect(await screen.findByRole("heading", { name: "Vikar" })).to.exist;
  });

  it("Skal vise vikarlege", async () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [aktivFastlege, ...fastlegeVikarer]
    );
    renderPersonkortLege();

    expect(await screen.findByText("Vikarlege Vikarsen")).to.exist;
    expect(await screen.findByText("Legensvikar Vikarheim")).to.exist;
  });

  it("Skal ikke vise fastlegevikarer dersom det ikke er fastlegevikarer", () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [aktivFastlege]
    );
    renderPersonkortLege();

    expect(screen.queryByRole("heading", { name: "Vikar" })).to.not.exist;
  });

  describe("Fastlegevikar", () => {
    it("Skal vise en liste med antall element lik antall fastlegervikarer", () => {
      const view = <FastlegeVikar fastlegeVikarer={fastlegeVikarer} />;
      render(view);

      expect(screen.getAllByRole("listitem")).to.have.length(
        fastlegeVikarer.length
      );
      expect(screen.getByText(/Vikarlege Vikarsen/)).to.exist;
      expect(screen.getByText(/Legensvikar Vikarheim/)).to.exist;
    });
  });
});
