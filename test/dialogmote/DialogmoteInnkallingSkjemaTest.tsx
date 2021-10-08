import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import { MemoryRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import DialogmoteInnkallingSkjema from "../../src/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import {
  leggTilDagerPaDato,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
  toDatePrettyPrint,
} from "@/utils/datoUtils";
import { InputDateStringToISODateString } from "nav-datovelger/lib/utils/dateFormatUtils";
import { Feilmelding } from "nav-frontend-typografi";
import { Feiloppsummering } from "nav-frontend-skjema";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "../../src/utils/valideringUtils";
import { genererDato } from "../../src/components/mote/utils";
import {
  commonTexts,
  innkallingTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import { Forhandsvisning } from "@/components/dialogmote/Forhandsvisning";
import { texts as innkallingSkjemaTexts } from "../../src/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import Lukknapp from "nav-frontend-lukknapp";
import { changeFieldValue, changeTextAreaValue } from "../testUtils";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubInnkallingApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import { arbeidsgiver, arbeidstaker, navEnhet, veileder } from "./testData";

const realState = createStore(rootReducer).getState();

const moteSted = "Møtested";
const moteDato = toDatePrettyPrint(leggTilDagerPaDato(new Date(), 1)) as string;
const moteDatoAsISODateString = InputDateStringToISODateString(moteDato);
const moteKlokkeslett = "08:00";
const moteDatoTid = `${moteDatoAsISODateString}T${moteKlokkeslett}:00`;
const moteVideoLink = "https://video.nav.no";
const fritekstTilArbeidstaker = "Noe fritekst til arbeidstaker";
const fritekstTilArbeidsgiver = "Noe fritekst til arbeidsgiver";
const store = configureStore([]);
const mockState = {
  behandlendeEnhet: {
    data: {
      enhetId: navEnhet.id,
      navn: navEnhet.navn,
    },
  },
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
        navn: "Tatten Tattover",
        aktoerId: "1902690001009",
        tlf: "12345666",
        epost: "test3@test.no",
        fomDato: new Date(),
        aktiv: true,
        orgnummer: arbeidsgiver.orgnr,
        organisasjonsnavn: "PONTYPANDY FIRE SERVICE",
        arbeidsgiverForskuttererLoenn: false,
      },
    ],
  },
};
const queryClient = new QueryClient();
queryClient.setQueryData(veilederinfoQueryKeys.veilederinfo, () => veileder);

describe("DialogmoteInnkallingSkjema", () => {
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

  it("forhåndsviser innkalling til arbeidstaker og arbeidsgiver", () => {
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

    const getForhandsvisningsModaler = () => wrapper.find(Forhandsvisning);
    let forhandsvisninger = getForhandsvisningsModaler();
    expect(
      forhandsvisninger.at(0).props().getDocumentComponents()
    ).to.deep.equal(expectedArbeidstakerInnkalling);
    expect(
      forhandsvisninger.at(1).props().getDocumentComponents()
    ).to.deep.equal(expectedArbeidsgiverInnkalling);

    const previewButtons = wrapper.find(Knapp);

    // Forhåndsvis innkalling til arbeidstaker og sjekk at modal vises med riktig tittel
    previewButtons.at(0).simulate("click");
    forhandsvisninger = getForhandsvisningsModaler();
    let forhandsvisningInnkallingArbeidstaker = forhandsvisninger.at(0);
    let forhandsvisningInnkallingArbeidsgiver = forhandsvisninger.at(1);
    expect(forhandsvisningInnkallingArbeidstaker.prop("isOpen")).to.be.true;
    expect(forhandsvisningInnkallingArbeidsgiver.prop("isOpen")).to.be.false;
    expect(forhandsvisningInnkallingArbeidstaker.text()).to.contain(
      innkallingSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningInnkallingArbeidstaker.text()).to.contain(
      innkallingSkjemaTexts.forhandsvisningArbeidstakerSubtitle
    );
    expect(forhandsvisningInnkallingArbeidsgiver.text()).not.to.contain(
      innkallingSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningInnkallingArbeidsgiver.text()).not.to.contain(
      innkallingSkjemaTexts.forhandsvisningArbeidsgiverSubtitle
    );

    // Lukk forhåndsvis innkalling til arbeidstaker
    forhandsvisningInnkallingArbeidstaker.find(Lukknapp).simulate("click");

    // Forhåndsvis innkalling til arbeidsgiver og sjekk at modal vises med riktig tittel
    previewButtons.at(1).simulate("click");
    forhandsvisninger = getForhandsvisningsModaler();
    forhandsvisningInnkallingArbeidstaker = forhandsvisninger.at(0);
    forhandsvisningInnkallingArbeidsgiver = forhandsvisninger.at(1);
    expect(forhandsvisningInnkallingArbeidstaker.prop("isOpen")).to.be.false;
    expect(forhandsvisningInnkallingArbeidsgiver.prop("isOpen")).to.be.true;
    expect(forhandsvisningInnkallingArbeidstaker.text()).not.to.contain(
      innkallingSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningInnkallingArbeidstaker.text()).not.to.contain(
      innkallingSkjemaTexts.forhandsvisningArbeidstakerSubtitle
    );
    expect(forhandsvisningInnkallingArbeidsgiver.text()).to.contain(
      innkallingSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningInnkallingArbeidsgiver.text()).to.contain(
      innkallingSkjemaTexts.forhandsvisningArbeidsgiverSubtitle
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

const expectedArbeidsgiverInnkalling = [
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(moteDatoAsISODateString, moteKlokkeslett)
      ),
    ],
    title: innkallingTexts.moteTidTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [moteSted],
    title: innkallingTexts.moteStedTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [moteVideoLink],
    title: innkallingTexts.videoLinkTitle,
    type: "LINK",
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidsgiver.intro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidsgiver.intro2],
    type: "PARAGRAPH",
  },
  {
    texts: [fritekstTilArbeidsgiver],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidsgiver.outro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidsgiver.outro2],
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.arbeidsgiverTlfLabel, commonTexts.arbeidsgiverTlf],
    type: "PARAGRAPH",
  },
];
const expectedArbeidstakerInnkalling = [
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(moteDatoAsISODateString, moteKlokkeslett)
      ),
    ],
    title: innkallingTexts.moteTidTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [moteSted],
    title: innkallingTexts.moteStedTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [moteVideoLink],
    title: innkallingTexts.videoLinkTitle,
    type: "LINK",
  },
  {
    texts: [`Hei ${arbeidstaker.navn}`],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidstaker.intro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidstaker.intro2],
    type: "PARAGRAPH",
  },
  {
    texts: [fritekstTilArbeidstaker],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidstaker.outro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidstaker.outro2Text],
    title: innkallingTexts.arbeidstaker.outro2Title,
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
];
