import { expect } from "chai";
import { mount } from "enzyme";
import React from "react";
import DialogmoteInnkallingBehandler from "@/components/dialogmote/innkalling/DialogmoteInnkallingBehandler";
import {
  BehandlerDialogmeldingDTO,
  BehandlerType,
} from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { QueryClient, QueryClientProvider } from "react-query";
import { arbeidstaker, mockStateBehandler } from "./testData";
import { behandlereDialogmeldingQueryKeys } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";
import { MemoryRouter, Route } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";

let queryClient;
const noOpMethod = () => {
  /*not empty*/
};
const store = configureStore([]);
const realState = createStore(rootReducer).getState();

describe("DialogmoteInnkallingBehandler", () => {
  const fastlege = {
    type: BehandlerType.FASTLEGE,
    behandlerRef: "123",
    fornavn: "Lego",
    mellomnavn: "Las",
    etternavn: "Legesen",
  };
  const behandlere: BehandlerDialogmeldingDTO[] = [fastlege];

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it("shows a list of behandlere", () => {
    queryClient.setQueryData(
      behandlereDialogmeldingQueryKeys.behandleredialogmelding(
        arbeidstaker.personident
      ),
      () => behandlere
    );
    const behandlerComponent = mountDialogmoteInnkallingBehandler();

    expect(behandlerComponent.find("BehandlerRadioGruppe")).to.exist;
    expect(behandlerComponent.find("AppSpinner")).to.not.exist;
  });
  it("displays an app spinner when loading", () => {
    const behandlerComponent = mountDialogmoteInnkallingBehandler();

    expect(behandlerComponent.find("BehandlerRadioGruppe")).to.not.exist;
    expect(behandlerComponent.find("AppSpinner")).to.exist;
  });

  it("displays alert message when no behandlere", () => {
    queryClient.setQueryData(
      behandlereDialogmeldingQueryKeys.behandleredialogmelding(
        arbeidstaker.personident
      ),
      () => []
    );
    const behandlerComponent = mountDialogmoteInnkallingBehandler();
    expect(behandlerComponent.find("AlertStripe")).to.exist;
  });
});

const mountDialogmoteInnkallingBehandler = () => {
  return mount(
    <MemoryRouter initialEntries={[dialogmoteRoutePath]}>
      <Route path={dialogmoteRoutePath}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockStateBehandler })}>
            <DialogmoteInnkallingBehandler setSelectedBehandler={noOpMethod} />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};
