import React from "react";
import { expect } from "chai";
import { SykmeldingUtdragContainer } from "@/components/speiling/sykepengsoknader/SykmeldingUtdragContainer";
import {
  mockSykepengeSoknad,
  mockSykmeldinger,
} from "../mockdata/sykmeldinger/mockSykmeldinger";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { newSMFormat2OldFormat } from "@/utils/sykmeldinger/sykmeldingParser";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const fnr = "12345000000";

const sykmelding = mockSykmeldinger.find((s) => {
  return s.id === mockSykepengeSoknad.sykmeldingId;
});

describe("SykmeldingUtdrag", () => {
  it("Skal hente sykmeldinger", () => {
    const mockStore = store({ ...realState });
    render(
      <Provider store={mockStore}>
        <SykmeldingUtdragContainer fnr={fnr} soknad={mockSykepengeSoknad} />
      </Provider>
    );
    const hentSykmeldingerAction = {
      type: "HENT_SYKMELDINGER_FORESPURT",
      fnr: "12345000000",
    };
    expect(mockStore.getActions()).to.deep.equal([hentSykmeldingerAction]);
  });

  it("Skal vise SykmeldingUtdrag for riktig sykmelding", () => {
    const sykmeldingerData = mockSykmeldinger.map((s) =>
      newSMFormat2OldFormat(s, fnr)
    );
    const mockStore = store({
      ...realState,
      sykmeldinger: { data: sykmeldingerData },
    });
    const wrapper = render(
      <Provider store={mockStore}>
        <SykmeldingUtdragContainer fnr={fnr} soknad={mockSykepengeSoknad} />
      </Provider>
    );
    userEvent.click(wrapper.getByRole("button"));
    expect(sykmelding?.sykmeldingStatus?.arbeidsgiver?.orgNavn).to.equal(
      "PONTYPANDY FIRE SERVICE"
    );
    expect(wrapper.getByText("PONTYPANDY FIRE SERVICE")).to.exist;
  });
});
