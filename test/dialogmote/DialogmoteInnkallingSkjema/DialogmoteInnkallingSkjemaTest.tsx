import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import { MemoryRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { leggTilDagerPaDato, toDatePrettyPrint } from "@/utils/datoUtils";
import { InputDateStringToISODateString } from "nav-datovelger/lib/utils/dateFormatUtils";
import { Feilmelding } from "nav-frontend-typografi";
import { Feiloppsummering } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";
import { texts as skjemaFeilOppsummeringTexts } from "@/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import { changeFieldValue, changeTextAreaValue } from "../../testUtils";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubInnkallingApi } from "../../stubs/stubIsdialogmote";
import { apiMock } from "../../stubs/stubApi";
import {
  arbeidsgiver,
  arbeidstaker,
  behandlendeEnhet,
  expectedArbeidsgiverInnkalling,
  expectedArbeidstakerInnkalling,
  fritekstTilArbeidsgiver,
  fritekstTilArbeidstaker,
  navEnhet,
  veileder,
} from "../testData";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";

const realState = createStore(rootReducer).getState();
const moteSted = "Møtested";
const moteDato = toDatePrettyPrint(leggTilDagerPaDato(new Date(), 1)) as string;
const moteDatoAsISODateString = InputDateStringToISODateString(moteDato);
const moteKlokkeslett = "08:00";
const moteDatoTid = `${moteDatoAsISODateString}T${moteKlokkeslett}:00`;
const moteVideoLink = "https://video.nav.no";
const store = configureStore([]);
const mockState = {
  navbruker: {
    data: {
      navn: arbeidstaker.navn,
      kontaktinfo: {
        fnr: arbeidstaker.personident,
      },
    },
  },
  enhet: {
    valgtEnhet: navEnhet,
  },
  valgtbruker: {
    personident: arbeidstaker.personident,
  },
  ledere: {
    currentLedere: [
      {
        uuid: "3",
        arbeidstakerPersonIdentNumber: "19026900010",
        virksomhetsnummer: "110110110",
        virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
        narmesteLederPersonIdentNumber: "02690001009",
        narmesteLederTelefonnummer: "12345666",
        narmesteLederEpost: "test3@test.no",
        narmesteLederNavn: "Tatten Tattover",
        aktivFom: new Date(),
        aktivTom: null,
        arbeidsgiverForskutterer: false,
        timestamp: "2020-02-06T12:00:00+01:00",
        status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
      },
    ],
  },
};
let queryClient;

describe("DialogmoteInnkallingSkjema", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.setQueryData(
      veilederinfoQueryKeys.veilederinfo,
      () => veileder
    );
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(arbeidstaker.personident),
      () => behandlendeEnhet
    );
  });

  it("validerer arbeidsgiver, dato, tid og sted", () => {
    const wrapper = mountDialogmoteInnkallingSkjema();

    wrapper.find("form").simulate("submit");

    // Feilmeldinger i skjema
    const feilmeldinger = wrapper.find(Feilmelding);
    expect(
      feilmeldinger.someWhere(
        (feil) => feil.text() === valideringsTexts.orgMissing
      )
    ).to.be.true;
    expect(
      feilmeldinger.someWhere(
        (feil) => feil.text() === valideringsTexts.dateMissing
      )
    ).to.be.true;
    expect(
      feilmeldinger.someWhere(
        (feil) => feil.text() === valideringsTexts.timeMissing
      )
    ).to.be.true;
    expect(
      feilmeldinger.someWhere(
        (feil) => feil.text() === valideringsTexts.placeMissing
      )
    ).to.be.true;

    // Feilmeldinger i oppsummering
    const feiloppsummering = wrapper.find(Feiloppsummering);
    expect(feiloppsummering.text()).to.contain(
      skjemaFeilOppsummeringTexts.title
    );
    expect(feiloppsummering.text()).to.contain(valideringsTexts.orgMissing);
    expect(feiloppsummering.text()).to.contain(valideringsTexts.dateMissing);
    expect(feiloppsummering.text()).to.contain(valideringsTexts.timeMissing);
    expect(feiloppsummering.text()).to.contain(valideringsTexts.placeMissing);
  });

  it("valideringsmeldinger forsvinner ved utbedring", () => {
    const wrapper = mountDialogmoteInnkallingSkjema();

    wrapper.find("form").simulate("submit");

    // Feilmeldinger i skjema
    const feilmeldinger = wrapper.find(Feilmelding);
    expect(
      feilmeldinger.someWhere(
        (feil) => feil.text() === valideringsTexts.orgMissing
      )
    ).to.be.true;
    expect(
      feilmeldinger.someWhere(
        (feil) => feil.text() === valideringsTexts.dateMissing
      )
    ).to.be.true;
    expect(
      feilmeldinger.someWhere(
        (feil) => feil.text() === valideringsTexts.timeMissing
      )
    ).to.be.true;
    expect(
      feilmeldinger.someWhere(
        (feil) => feil.text() === valideringsTexts.placeMissing
      )
    ).to.be.true;

    // Feilmeldinger i oppsummering
    const feiloppsummering = wrapper.find(Feiloppsummering);
    expect(feiloppsummering.text()).to.contain(
      skjemaFeilOppsummeringTexts.title
    );
    expect(feiloppsummering.text()).to.contain(valideringsTexts.orgMissing);
    expect(feiloppsummering.text()).to.contain(valideringsTexts.dateMissing);
    expect(feiloppsummering.text()).to.contain(valideringsTexts.timeMissing);
    expect(feiloppsummering.text()).to.contain(valideringsTexts.placeMissing);

    // Fyll inn felter i skjema
    const arbeidsgiverDropdown = wrapper.find("select");
    changeFieldValue(arbeidsgiverDropdown, arbeidsgiver.orgnr);
    const datoVelger = wrapper.find("ForwardRef(DateInput)");
    changeFieldValue(datoVelger, moteDato);
    datoVelger.simulate("blur");

    const inputs = wrapper.find("input");
    const stedInput = inputs.findWhere((w) => w.prop("name") === "sted");
    const videoLinkInput = inputs.findWhere(
      (w) => w.prop("name") === "videoLink"
    );
    const klokkeslettInput = inputs.findWhere(
      (w) => w.prop("name") === "klokkeslett"
    );
    changeFieldValue(stedInput, moteSted);
    changeFieldValue(videoLinkInput, moteVideoLink);
    changeFieldValue(klokkeslettInput, moteKlokkeslett);

    changeTextAreaValue(
      wrapper,
      "fritekstArbeidsgiver",
      fritekstTilArbeidsgiver
    );
    changeTextAreaValue(
      wrapper,
      "fritekstArbeidstaker",
      fritekstTilArbeidstaker
    );

    // Feilmeldinger og feiloppsummering forsvinner
    expect(wrapper.find(Feiloppsummering)).to.have.length(0);
    expect(wrapper.find(Feilmelding)).to.have.length(0);

    // Tøm felt for sted
    changeFieldValue(stedInput, "");

    // Feilmelding vises, feiloppsummering vises ved neste submit
    expect(wrapper.find(Feiloppsummering)).to.have.length(0);
    expect(wrapper.find(Feilmelding)).to.have.length(1);

    wrapper.find(Hovedknapp).simulate("click");
    expect(wrapper.find(Feiloppsummering)).to.have.length(1);
  });

  it("oppretter innkalling med verdier fra skjema", () => {
    stubInnkallingApi(apiMock());
    const wrapper = mountDialogmoteInnkallingSkjema();

    const arbeidsgiverDropdown = wrapper.find("select");
    changeFieldValue(arbeidsgiverDropdown, arbeidsgiver.orgnr);
    const datoVelger = wrapper.find("ForwardRef(DateInput)");
    changeFieldValue(datoVelger, moteDato);
    datoVelger.simulate("blur");

    const inputs = wrapper.find("input");
    const stedInput = inputs.findWhere((w) => w.prop("name") === "sted");
    const videoLinkInput = inputs.findWhere(
      (w) => w.prop("name") === "videoLink"
    );
    const klokkeslettInput = inputs.findWhere(
      (w) => w.prop("name") === "klokkeslett"
    );
    changeFieldValue(stedInput, moteSted);
    changeFieldValue(videoLinkInput, moteVideoLink);
    changeFieldValue(klokkeslettInput, moteKlokkeslett);

    changeTextAreaValue(
      wrapper,
      "fritekstArbeidsgiver",
      fritekstTilArbeidsgiver
    );
    changeTextAreaValue(
      wrapper,
      "fritekstArbeidstaker",
      fritekstTilArbeidstaker
    );

    wrapper.find("form").simulate("submit");

    const innkallingMutation = queryClient.getMutationCache().getAll()[0];
    const expectedInnkalling = {
      tildeltEnhet: navEnhet,
      arbeidsgiver: {
        virksomhetsnummer: arbeidsgiver.orgnr,
        fritekstInnkalling: fritekstTilArbeidsgiver,
        innkalling: expectedArbeidsgiverInnkalling,
      },
      arbeidstaker: {
        personIdent: arbeidstaker.personident,
        fritekstInnkalling: fritekstTilArbeidstaker,
        innkalling: expectedArbeidstakerInnkalling,
      },
      tidSted: {
        sted: moteSted,
        tid: moteDatoTid,
        videoLink: moteVideoLink,
      },
    };

    expect(innkallingMutation.options.variables).to.deep.equal(
      expectedInnkalling
    );
  });
});

const mountDialogmoteInnkallingSkjema = () => {
  return mount(
    <MemoryRouter initialEntries={[dialogmoteRoutePath]}>
      <Route path={dialogmoteRoutePath}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <DialogmoteInnkallingSkjema pageTitle="Test" />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};
