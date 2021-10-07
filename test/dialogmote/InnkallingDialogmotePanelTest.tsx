import { expect } from "chai";
import { mount } from "enzyme";
import { Link, MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import {
  InnkallingDialogmotePanel,
  texts as innkallingDialmotePanelTexts,
} from "../../src/components/mote/components/innkalling/InnkallingDialogmotePanel";
import { texts as brukerKanIkkeVarslesPapirpostTexts } from "../../src/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import Alertstripe from "nav-frontend-alertstriper";
import { NyttDialogMote } from "@/components/mote/components/innkalling/NyttDialogMote";
import ModalWrapper from "nav-frontend-modal";
import { brukerKanIkkeVarslesTekst } from "@/components/BrukerKanIkkeVarslesText";
import { ToggleNames } from "@/data/unleash/unleash_types";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const brukerKanVarsles = {
  data: {
    kontaktinfo: {
      skalHaVarsel: true,
    },
  },
};
const brukerKanIkkeVarsles = {
  data: {
    kontaktinfo: {
      skalHaVarsel: false,
    },
  },
};

describe("InnkallingDialogmotePanel med dm2 enabled og dm2 fysisk brev disabled", () => {
  const mockState = {
    unleash: {
      toggles: {
        [ToggleNames.dm2]: true,
        [ToggleNames.dm2VarselFysiskBrev]: false,
      },
    },
  };

  it("viser advarsel når bruker ikke kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanIkkeVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    const alertstripe = wrapper.find(Alertstripe);
    expect(alertstripe.prop("type")).to.equal("advarsel");
    expect(alertstripe.text()).to.contain(brukerKanIkkeVarslesTekst);
    expect(alertstripe.text()).to.contain(
      innkallingDialmotePanelTexts.arenaDialogmoteInnkalling
    );
  });
  it("Nytt dialogmøte-knapp linker direkte til møteplanleggeren uten modaler når bruker ikke kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanIkkeVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(NyttDialogMote).find(Link).prop("to")).to.equal(
      "/sykefravaer/mote"
    );
    expect(wrapper.find(NyttDialogMote).find(ModalWrapper)).to.have.length(0);
  });
  it("viser ingen advarsel når bruker kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(Alertstripe)).to.have.length(0);
  });
  it("Nytt dialogmøte-knapp viser modaler når bruker kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(NyttDialogMote).find(Link)).to.have.length(0);
    expect(wrapper.find(NyttDialogMote).find(ModalWrapper)).to.have.length(2);
  });
});

describe("InnkallingDialogmotePanel med dm2 enabled og dm2 fysisk brev enabled", () => {
  const mockState = {
    unleash: {
      toggles: {
        [ToggleNames.dm2]: true,
        [ToggleNames.dm2VarselFysiskBrev]: true,
      },
    },
  };

  it("viser advarsel om fysisk brev når bruker ikke kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanIkkeVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    const alertstripe = wrapper.find(Alertstripe);
    expect(alertstripe.prop("type")).to.equal("advarsel");
    expect(alertstripe.text()).to.contain(brukerKanIkkeVarslesTekst);
    expect(alertstripe.text()).to.contain(
      brukerKanIkkeVarslesPapirpostTexts.papirpostDialogmote
    );
  });
  it("Nytt dialogmøte-knapp viser modaler når bruker ikke kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanIkkeVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(NyttDialogMote).find(Link)).to.have.length(0);
    expect(wrapper.find(NyttDialogMote).find(ModalWrapper)).to.have.length(2);
  });
  it("viser ingen advarsel når bruker kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(Alertstripe)).to.have.length(0);
  });
  it("Nytt dialogmøte-knapp viser modaler når bruker kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(NyttDialogMote).find(Link)).to.have.length(0);
    expect(wrapper.find(NyttDialogMote).find(ModalWrapper)).to.have.length(2);
  });
});
describe("InnkallingDialogmotePanel med dm2 disabled", () => {
  const mockState = {
    unleash: {
      toggles: {
        [ToggleNames.dm2]: false,
      },
    },
  };

  it("Nytt dialogmøte-knapp linker direkte til møteplanleggeren når bruker ikke kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanIkkeVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(Link).prop("to")).to.equal("/sykefravaer/mote");
  });
  it("Nytt dialogmøte-knapp linker direkte til møteplanleggeren når bruker kan varsles", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/sykefravaer/moteoversikt`]}>
        <Route path="/sykefravaer/moteoversikt">
          <Provider
            store={store({
              ...realState,
              ...mockState,
              navbruker: brukerKanVarsles,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find(Link).prop("to")).to.equal("/sykefravaer/mote");
  });
});
