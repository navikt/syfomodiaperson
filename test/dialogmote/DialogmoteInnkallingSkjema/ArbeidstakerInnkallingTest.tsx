import React from "react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  arbeidstaker,
  behandlendeEnhet,
  expectedArbeidstakerInnkalling,
  fritekstTilArbeidstaker,
  mockState,
  moteDato,
  moteKlokkeslett,
  moteSted,
  moteVideoLink,
  veileder,
} from "../testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { changeFieldValue, changeTextAreaValue } from "../../testUtils";
import { Forhandsvisning } from "@/components/dialogmote/Forhandsvisning";
import { Knapp } from "nav-frontend-knapper";
import { texts as innkallingSkjemaTexts } from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Provider } from "react-redux";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import Lukknapp from "nav-frontend-lukknapp";

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
  });

  it("previews innkalling to arbeidstaker", () => {
    const wrapper = mountDialogmoteInnkallingSkjema();

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
      "fritekstArbeidstaker",
      fritekstTilArbeidstaker
    );

    const getForhandsvisningsModaler = () => wrapper.find(Forhandsvisning);

    const previewButtons = wrapper.find(Knapp);

    previewButtons.at(0).simulate("click");
    let forhandsvisninger = getForhandsvisningsModaler();
    let forhandsvisningInnkallingArbeidstaker = forhandsvisninger.at(0);

    expect(
      forhandsvisninger.at(0).props().getDocumentComponents()
    ).to.deep.equal(expectedArbeidstakerInnkalling);
    expect(forhandsvisningInnkallingArbeidstaker.prop("isOpen")).to.be.true;
    expect(forhandsvisningInnkallingArbeidstaker.text()).to.contain(
      innkallingSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningInnkallingArbeidstaker.text()).to.contain(
      innkallingSkjemaTexts.forhandsvisningArbeidstakerSubtitle
    );

    forhandsvisningInnkallingArbeidstaker.find(Lukknapp).simulate("click");

    previewButtons.at(1).simulate("click");
    forhandsvisninger = getForhandsvisningsModaler();
    forhandsvisningInnkallingArbeidstaker = forhandsvisninger.at(0);
    expect(forhandsvisningInnkallingArbeidstaker.prop("isOpen")).to.be.false;
    expect(forhandsvisningInnkallingArbeidstaker.text()).not.to.contain(
      innkallingSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningInnkallingArbeidstaker.text()).not.to.contain(
      innkallingSkjemaTexts.forhandsvisningArbeidstakerSubtitle
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
