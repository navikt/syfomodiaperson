import React from "react";
import { expect } from "chai";
import { SykmeldingUtdragContainer } from "@/components/speiling/sykepengsoknader/SykmeldingUtdragContainer";
import mockSykmeldinger from "../mockdata/sykmeldinger/mockSykmeldinger";
import SykmeldingUtdrag from "../../src/components/speiling/sykepengsoknader/soknad-felles/SykmeldingUtdrag";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { newSMFormat2OldFormat } from "@/utils/sykmeldinger/sykmeldingParser";
import { toDateWithoutNullCheck } from "@/utils/datoUtils";
import {
  SoknadstatusDTO,
  SoknadstypeDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const fnr = "12345000000";
const soknad: SykepengesoknadDTO = {
  arbeidsgiver: {
    navn: "KONKURS BEDRIFT OG VENNER AS",
    orgnummer: "000111222",
  },
  fom: toDateWithoutNullCheck("2018-08-18"),
  id: "b9732cc7-6101-446e-a1ef-ec25a425b4fb",
  opprettetDato: toDateWithoutNullCheck("2018-09-07"),
  status: SoknadstatusDTO.NY,
  sykmeldingId: "e425a750-7f39-4974-9a06-fa1775f987c9",
  tom: toDateWithoutNullCheck("2018-08-31"),
  soknadstype: SoknadstypeDTO.ARBEIDSTAKERE,
  sporsmal: [],
};
const sykmelding = mockSykmeldinger.find((s) => {
  return s.id === soknad.sykmeldingId;
});

describe("SykmeldingUtdrag", () => {
  it("Skal hente sykmeldinger", () => {
    const mockStore = store({ ...realState });
    render(
      <Provider store={mockStore}>
        <SykmeldingUtdragContainer fnr={fnr} soknad={soknad} />
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
        <SykmeldingUtdragContainer fnr={fnr} soknad={soknad} />
      </Provider>
    );
    userEvent.click(wrapper.getByRole("button"));
    expect(sykmelding?.sykmeldingStatus?.arbeidsgiver?.orgNavn).to.equal(
      "PONTYPANDY FIRE SERVICE"
    );
    expect(wrapper.getByText("PONTYPANDY FIRE SERVICE")).to.exist;
  });
});
