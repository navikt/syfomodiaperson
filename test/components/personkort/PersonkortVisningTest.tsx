import React from "react";
import { expect } from "chai";
import PersonkortVisning from "../../../src/components/personkort/PersonkortVisning";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { QueryClientProvider } from "react-query";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { apiMock } from "../../stubs/stubApi";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";
import { render, screen } from "@testing-library/react";
import { fastlegerMock } from "../../../mock/fastlegerest/fastlegerMock";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";

let queryClient: any;
let apiMockScope: any;

describe("PersonkortVisning", () => {
  let mockState: any;
  const realState = createStore(rootReducer).getState();
  const store = configureStore([]);

  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    apiMockScope = apiMock();
    stubFastlegerApi(apiMockScope);
    mockState = {
      navbruker: {
        navn: "Knut",
        kontaktinfo: {
          fnr: "1234",
        },
      },
    };
  });

  it("Skal vise PersonkortSykmeldt, som initielt valg", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortVisning visning={""} navbruker={mockState.navbruker} />
        </Provider>
      </QueryClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Kontaktinformasjon" })).to
      .exist;
  });

  it("Skal vise VisningLege, dersom visning for lege er valgt", async () => {
    const expectedLegeNavn = `${fastlegerMock[0].fornavn} ${fastlegerMock[0].etternavn}`;
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortVisning
            visning={PERSONKORTVISNING_TYPE.LEGE}
            navbruker={mockState.navbruker}
          />
        </Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByRole("heading", { name: expectedLegeNavn })).to
      .exist;
  });

  it("Skal vise VisningEnhet, dersom visning for enhet er valgt", async () => {
    const enhetNavn = "NAV Drammen";
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => ({
        navn: enhetNavn,
        enhetId: "1234",
      })
    );
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortVisning
            visning={PERSONKORTVISNING_TYPE.ENHET}
            navbruker={mockState.navbruker}
          />
        </Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByRole("heading", { name: enhetNavn })).to.exist;
  });
});
