import React from "react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  arbeidstaker,
  behandlendeEnhet,
  behandlere,
  expectedBehandlerInnkalling,
  fritekstTilBehandler,
  mockStateBehandler,
  veileder,
} from "../testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { changeTextAreaValue } from "../../testUtils";
import { Forhandsvisning } from "@/components/dialogmote/Forhandsvisning";
import { Knapp } from "nav-frontend-knapper";
import { texts as innkallingSkjemaTexts } from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { behandlereDialogmeldingQueryKeys } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";
import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Provider } from "react-redux";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";

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
      () => behandlere
    );
  });

  it("previews innkalling to behandler when behandler is selected", () => {
    const skjemaWrapper = mountDialogmoteInnkallingSkjema();

    const behandlereRadioKnapper = skjemaWrapper.find('input[type="radio"]');
    behandlereRadioKnapper
      .at(1)
      .simulate("change", { target: { checked: true } });
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
