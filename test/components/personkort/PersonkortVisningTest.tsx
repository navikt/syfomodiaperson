import React from "react";
import { expect } from "chai";
import PersonkortVisning from "../../../src/components/personkort/PersonkortVisning";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";
import { QueryClient, QueryClientProvider } from "react-query";
import { arbeidstaker } from "../../dialogmote/testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { apiMock } from "../../stubs/stubApi";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";
import { render, screen } from "@testing-library/react";
import { fastlegerMock } from "../../../mock/fastlegerest/fastlegerMock";

let queryClient;
let apiMockScope;

describe("PersonkortVisning", () => {
  let mockState;
  const realState = createStore(rootReducer).getState();
  const store = configureStore([]);

  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
    stubFastlegerApi(apiMockScope, arbeidstaker.personident);
    mockState = {
      ledere: [
        {
          narmesteLederNavn: "Station Officer Steele",
          virksomhetsnummer: "000999000",
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
        {
          narmesteLederNavn: "Are Arbeidsgiver",
          virksomhetsnummer: "000999001",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
      ],
      navbruker: {
        navn: "Knut",
        kontaktinfo: {
          fnr: "1234",
        },
      },
      valgtbruker: {
        personident: arbeidstaker.personident,
      },
    };
  });

  it("Skal vise PersonkortSykmeldt, som initielt valg", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortVisning
            visning={""}
            ledere={mockState.ledere}
            navbruker={mockState.navbruker}
            sykmeldinger={[]}
          />
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
            ledere={mockState.ledere}
            navbruker={mockState.navbruker}
            sykmeldinger={[]}
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
      behandlendeEnhetQueryKeys.behandlendeEnhet(arbeidstaker.personident),
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
            ledere={mockState.ledere}
            navbruker={mockState.navbruker}
            sykmeldinger={[]}
          />
        </Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByRole("heading", { name: enhetNavn })).to.exist;
  });
});
