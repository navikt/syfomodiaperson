import React from "react";
import { expect } from "chai";
import { mount } from "enzyme";
import Alertstripe from "nav-frontend-alertstriper";
import PersonkortVisning from "../../../src/components/personkort/PersonkortVisning";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import PersonkortElement from "../../../src/components/personkort/PersonkortElement";
import PersonkortInformasjon from "../../../src/components/personkort/PersonkortInformasjon";
import PersonkortSykmeldt from "../../../src/components/personkort/PersonkortSykmeldt";
import PersonkortEnhet from "../../../src/components/personkort/PersonkortEnhet";
import PersonkortLege, {
  TidligereLeger,
} from "../../../src/components/personkort/PersonkortLege";
import mockSykmeldinger from "../../mockdata/sykmeldinger/mockSykmeldinger";
import { newSMFormat2OldFormat } from "@/utils/sykmeldinger/sykmeldingParser";
import { leggTilDagerPaDato } from "@/utils/datoUtils";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";
import { QueryClient, QueryClientProvider } from "react-query";
import { fastlegerQueryKeys } from "@/data/fastlege/fastlegerQueryHooks";
import { arbeidstaker } from "../../dialogmote/testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { apiMock } from "../../stubs/stubApi";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";

const queryClient = new QueryClient();
let apiMockScope;
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

describe("PersonkortVisning", () => {
  let komponent;
  let mockState;
  const realState = createStore(rootReducer).getState();
  const store = configureStore([]);

  const sykmeldingOldFormat = newSMFormat2OldFormat({
    ...mockSykmeldinger[0],
    sykmeldingsperioder: [
      {
        fom: "2020-01-22",
        tom: leggTilDagerPaDato(new Date(), 1),
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
        aktivitetIkkeMulig: null,
      },
    ],
  });

  beforeEach(() => {
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
      personadresse: {},
      sykmeldinger: [sykmeldingOldFormat],
      valgtbruker: {
        personident: arbeidstaker.personident,
      },
    };

    komponent = mount(
      <Provider store={store({ ...realState, ...mockState })}>
        <PersonkortVisning
          visning={""}
          ledere={mockState.ledere}
          navbruker={mockState.navbruker}
          personadresse={mockState.personadresse}
          sykmeldinger={null}
        />
      </Provider>
    );
  });

  it("Skal vise PersonkortSykmeldt, som initielt valg", () => {
    expect(komponent.find(PersonkortSykmeldt)).to.have.length(1);
  });

  it("Skal vise VisningLege, dersom visning for lege er valgt", () => {
    komponent = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortVisning
            visning={PERSONKORTVISNING_TYPE.LEGE}
            ledere={mockState.ledere}
            navbruker={mockState.navbruker}
            personadresse={mockState.personadresse}
            sykmeldinger={null}
          />
        </Provider>
      </QueryClientProvider>
    );
    expect(komponent.find(PersonkortLege)).to.have.length(1);
  });

  it("Skal vise VisningEnhet, dersom visning for enhet er valgt", () => {
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(arbeidstaker.personident),
      () => ({
        navn: "NAV Drammen",
        enhetId: "1234",
      })
    );
    komponent = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <PersonkortVisning
            visning={PERSONKORTVISNING_TYPE.ENHET}
            ledere={mockState.ledere}
            navbruker={mockState.navbruker}
            personadresse={mockState.personadresse}
            sykmeldinger={null}
          />
        </Provider>
      </QueryClientProvider>
    );
    expect(komponent.find(PersonkortEnhet)).to.have.length(1);
  });

  describe("PersonkortSykmeldt", () => {
    beforeEach(() => {
      komponent = mount(
        <PersonkortSykmeldt
          navbruker={mockState.navbruker}
          personadresse={mockState.personadresse}
        />
      );
    });

    it("Skal vise PersonkortElement", () => {
      expect(komponent.find(PersonkortElement)).to.have.length(1);
    });

    it("Skal vise PersonkortInformasjon", () => {
      expect(komponent.find(PersonkortInformasjon)).to.have.length(1);
    });
  });

  describe("PersonkortLege", () => {
    beforeEach(() => {
      queryClient.setQueryData(
        fastlegerQueryKeys.fastleger(arbeidstaker.personident),
        () => [aktivFastlege, ...tidligereFastleger]
      );

      komponent = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <PersonkortLege />
          </Provider>
        </QueryClientProvider>
      );
    });

    it("Skal vise feilmelding, fastleger ikke ble funnet, når ingen fastleger", () => {
      queryClient.setQueryData(
        fastlegerQueryKeys.fastleger(arbeidstaker.personident),
        () => []
      );
      komponent = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <PersonkortLege />
          </Provider>
        </QueryClientProvider>
      );
      expect(komponent.find(Alertstripe)).to.have.length(1);
    });

    it("Skal vise PersonkortElement", () => {
      expect(komponent.find(PersonkortElement)).to.have.length(2);
    });

    it("Skal vise PersonkortInformasjon", () => {
      expect(komponent.find(PersonkortInformasjon)).to.have.length(1);
    });

    it("Skal vise TidligereLeger", () => {
      expect(komponent.find(TidligereLeger)).to.have.length(1);
    });

    it("Skal ikke vise tidligere leger dersom det ikke er tidligere fastleger", () => {
      queryClient.setQueryData(
        fastlegerQueryKeys.fastleger(arbeidstaker.personident),
        () => [aktivFastlege]
      );
      komponent = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <PersonkortLege />
          </Provider>
        </QueryClientProvider>
      );
      expect(komponent.find(TidligereLeger)).to.have.length(1);
      expect(komponent.find(TidligereLeger).html()).to.equal(null);
    });
  });

  describe("TidligereLeger", () => {
    beforeEach(() => {
      komponent = mount(
        <TidligereLeger tidligereFastleger={tidligereFastleger} />
      );
    });

    it("Skal vise en liste med antall element lik antall tidligere fastleger", () => {
      expect(komponent.find("li")).to.have.length(tidligereFastleger.length);
    });
  });
});
