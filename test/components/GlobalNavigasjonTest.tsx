import { render, screen } from "@testing-library/react";
import { GlobalNavigasjon } from "@/components/globalnavigasjon/GlobalNavigasjon";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import * as menypunkter from "@/enums/menypunkter";
import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const store = configureStore([]);
const mockState = {
  valgtbruker: { personident: fnr },
  moter: {
    data: [],
  },
  motebehov: {
    data: [],
  },
};
let queryClient;

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
  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplaner(fnr),
      () => []
    );
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(fnr),
      () => []
    );
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => []
    );
  });
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
