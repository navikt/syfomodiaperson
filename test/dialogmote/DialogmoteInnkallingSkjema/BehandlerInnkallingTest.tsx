import React from "react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  arbeidsgiver,
  arbeidstaker,
  behandlendeEnhet,
  behandler,
  expectedArbeidsgiverInnkalling,
  expectedArbeidstakerInnkalling,
  expectedBehandlerInnkalling,
  fritekstTilArbeidsgiver,
  fritekstTilArbeidstaker,
  fritekstTilBehandler,
  mockStateBehandler,
  moteDato,
  moteDatoTid,
  moteKlokkeslett,
  moteSted,
  moteVideoLink,
  navEnhet,
  veileder,
} from "../testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import {
  changeFieldValue,
  changeTextAreaValue,
  getTooLongText,
  maxLengthErrorMessage,
} from "../../testUtils";
import { Forhandsvisning } from "@/components/dialogmote/Forhandsvisning";
import { Knapp } from "nav-frontend-knapper";
import {
  MAX_LENGTH_INNKALLING_FRITEKST,
  texts as innkallingSkjemaTexts,
} from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { behandlereDialogmeldingQueryKeys } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";
import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Provider } from "react-redux";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { Feilmelding } from "nav-frontend-typografi";
import { stubInnkallingApi } from "../../stubs/stubIsdialogmote";
import { apiMock } from "../../stubs/stubApi";
import { behandlerNavn } from "@/utils/behandlerUtils";

let queryClient;
const store = configureStore([]);
const realState = createStore(rootReducer).getState();

describe("Dialogmoteinnkallingskjema", () => {
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
    queryClient.setQueryData(
      behandlereDialogmeldingQueryKeys.behandleredialogmelding(
        arbeidstaker.personident
      ),
      () => [behandler]
    );
  });

  it("validerer maks lengde på alle fritekstfelter inkl behandler", () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_INNKALLING_FRITEKST);
    const maxLengthErrorMsg = maxLengthErrorMessage(
      MAX_LENGTH_INNKALLING_FRITEKST
    );
    const wrapper = mountDialogmoteInnkallingSkjema();
    const behandlereRadioKnapper = wrapper.find('input[type="radio"]');
    behandlereRadioKnapper
      .at(1)
      .simulate("change", { target: { checked: true } });

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
    changeTextAreaValue(wrapper, "fritekstBehandler", fritekstTilBehandler);
    wrapper.find("form").simulate("submit");

    let maxLengthFeilmeldinger = wrapper
      .find(Feilmelding)
      .filterWhere((feil) => feil.text() === maxLengthErrorMsg);
    expect(maxLengthFeilmeldinger).to.have.length(0);

    changeTextAreaValue(wrapper, "fritekstArbeidsgiver", tooLongFritekst);
    changeTextAreaValue(wrapper, "fritekstArbeidstaker", tooLongFritekst);
    changeTextAreaValue(wrapper, "fritekstBehandler", tooLongFritekst);
    wrapper.find("form").simulate("submit");

    maxLengthFeilmeldinger = wrapper
      .find(Feilmelding)
      .filterWhere((feil) => feil.text() === maxLengthErrorMsg);
    expect(maxLengthFeilmeldinger).to.have.length(
      3,
      "Validerer maks lengde på alle fritekstfelter"
    );
  });

  it("submit creates innkalling with behandler when behandler is selected", () => {
    stubInnkallingApi(apiMock());
    const wrapper = mountDialogmoteInnkallingSkjema();

    const behandlereRadioKnapper = wrapper.find('input[type="radio"]');
    behandlereRadioKnapper
      .at(1)
      .simulate("change", { target: { checked: true } });
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
    changeTextAreaValue(wrapper, "fritekstBehandler", fritekstTilBehandler);

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
      behandler: {
        personIdent: behandler.fnr,
        behandlerRef: behandler.behandlerRef,
        behandlerNavn: behandlerNavn(behandler),
        behandlerKontor: behandler.kontor,
        fritekstInnkalling: fritekstTilBehandler,
        innkalling: expectedBehandlerInnkalling,
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

  it("previews innkalling to behandler when behandler is selected", () => {
    const skjemaWrapper = mountDialogmoteInnkallingSkjema();

    const behandlereRadioKnapper = skjemaWrapper.find('input[type="radio"]');
    behandlereRadioKnapper
      .at(1)
      .simulate("change", { target: { checked: true } });
    const arbeidsgiverDropdown = skjemaWrapper.find("select");
    changeFieldValue(arbeidsgiverDropdown, arbeidsgiver.orgnr);
    const datoVelger = skjemaWrapper.find("ForwardRef(DateInput)");
    changeFieldValue(datoVelger, moteDato);
    datoVelger.simulate("blur");

    const inputs = skjemaWrapper.find("input");
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
      skjemaWrapper,
      "fritekstArbeidsgiver",
      fritekstTilArbeidsgiver
    );
    changeTextAreaValue(
      skjemaWrapper,
      "fritekstArbeidstaker",
      fritekstTilArbeidstaker
    );
    changeTextAreaValue(
      skjemaWrapper,
      "fritekstBehandler",
      fritekstTilBehandler
    );

    const previewButtons = skjemaWrapper.find(Knapp);
    previewButtons.at(2).simulate("click");
    const forhandsvisninger = skjemaWrapper.find(Forhandsvisning);
    const forhandsvisningInnkallingBehandler = forhandsvisninger.at(2);

    expect(
      forhandsvisningInnkallingBehandler.props().getDocumentComponents()
    ).to.deep.equal(expectedBehandlerInnkalling);
    expect(forhandsvisningInnkallingBehandler.prop("isOpen")).to.be.true;
    expect(forhandsvisningInnkallingBehandler.text()).to.contain(
      innkallingSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningInnkallingBehandler.text()).to.contain(
      innkallingSkjemaTexts.forhandsvisningBehandlerSubtitle
    );
  });

  it("doesn't display behandler when none is selected", () => {
    const skjemaWrapper = mountDialogmoteInnkallingSkjema();

    const textAreaBehandler = skjemaWrapper
      .find("textarea")
      .findWhere((w) => w.prop("name") === "fritekstBehandler");
    const previewButtons = skjemaWrapper.find(Knapp);

    expect(textAreaBehandler).to.be.empty;
    expect(previewButtons).lengthOf(2);
  });
});

const mountDialogmoteInnkallingSkjema = () => {
  return mount(
    <MemoryRouter initialEntries={[dialogmoteRoutePath]}>
      <Route path={dialogmoteRoutePath}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockStateBehandler })}>
            <DialogmoteInnkallingSkjema pageTitle="Test" />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};
