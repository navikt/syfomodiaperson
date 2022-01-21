import { render, screen } from "@testing-library/react";
import { GlobalNavigasjon } from "@/components/globalnavigasjon/GlobalNavigasjon";
import React from "react";
import configureStore from "redux-mock-store";
import { arbeidstaker } from "../dialogmote/testData";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import * as menypunkter from "@/enums/menypunkter";
import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";

const store = configureStore([]);
const mockState = {
  valgtbruker: { personident: arbeidstaker.personident },
  oppfolgingsplanerlps: {
    data: [],
  },
  personoppgaver: {
    data: [],
  },
  moter: {
    data: [],
  },
  motebehov: {
    data: [],
  },
  oppfoelgingsdialoger: {
    data: [],
  },
};
const queryClient = new QueryClient();

const renderGlobalNavigasjon = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store(mockState)}>
        <MemoryRouter>
          <GlobalNavigasjon aktivtMenypunkt={menypunkter.NOKKELINFORMASJON} />
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>
  );

describe("GlobalNavigasjon", () => {
  it("viser linker for alle menypunkter", () => {
    renderGlobalNavigasjon();
    const navnMenypunkter = [
      "Nøkkelinformasjon",
      "Logg",
      "Sykmeldinger",
      "Søknader om sykepenger",
      "Oppfølgingsplaner",
      "Dialogmøter",
      "Vedtak",
    ];

    const linker = screen.getAllByRole("link");
    linker.forEach((link, index) => {
      expect(link.textContent).to.equal(navnMenypunkter[index]);
    });
  });
  it("viser aktivt menypunkt", () => {
    renderGlobalNavigasjon();

    const currentMenypunkt = screen.getByRole("listitem", {
      current: true,
    });
    expect(currentMenypunkt.textContent).to.equal("Nøkkelinformasjon");
  });
});
