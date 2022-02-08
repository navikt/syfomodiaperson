import { fastlegerQueryKeys } from "@/data/fastlege/fastlegerQueryHooks";
import { arbeidstaker } from "../../dialogmote/testData";
import { render, screen } from "@testing-library/react";
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
import { fastlegerMock } from "../../../mock/fastlegerest/fastlegerMock";

let queryClient;

const aktivFastlege = fastlegerMock[0];
const tidligereFastleger = [fastlegerMock[1]];
const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const mockState = {
  valgtbruker: {
    personident: arbeidstaker.personident,
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
      fastlegerQueryKeys.fastleger(arbeidstaker.personident),
      () => []
    );
    renderPersonkortLege();

    expect(screen.getByText(expectedFeilmelding)).to.exist;
  });

  it("Skal vise overskrifter for aktiv fastlege og tidligere fastleger", async () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(arbeidstaker.personident),
      () => [aktivFastlege, ...tidligereFastleger]
    );
    renderPersonkortLege();

    expect(await screen.findByRole("heading", { name: "Lego Legesen" })).to
      .exist;
    expect(await screen.findByRole("heading", { name: "Tidligere fastleger" }))
      .to.exist;
  });

  it("Skal vise tidligere leger", async () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(arbeidstaker.personident),
      () => [aktivFastlege, ...tidligereFastleger]
    );
    renderPersonkortLege();

    expect(
      await screen.findByText("1. oktober 2011 - 1. oktober 2021 Annen Legesen")
    ).to.exist;
  });

  it("Skal ikke vise tidligere leger dersom det ikke er tidligere fastleger", () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(arbeidstaker.personident),
      () => [aktivFastlege]
    );
    renderPersonkortLege();

    expect(screen.queryByRole("heading", { name: "Tidligere fastleger" })).to
      .not.exist;
  });

  describe("TidligereLeger", () => {
    it("Skal vise en liste med antall element lik antall tidligere fastleger", () => {
      render(<TidligereLeger tidligereFastleger={tidligereFastleger} />);

      expect(screen.getAllByRole("listitem")).to.have.length(
        tidligereFastleger.length
      );
      expect(screen.getByText(/1. oktober 2011 - 1. oktober 2021/)).to.exist;
    });
  });
});
