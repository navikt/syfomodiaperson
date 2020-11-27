import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import { SykmeldingUtdrag } from "@navikt/digisyfo-npm";
import {
  Container,
  mapStateToProps,
} from "../../src/connected-components/SykmeldingUtdrag";
import sykmeldinger from "../../src/reducers/sykmeldinger";
import mockSykepengesoknader from "../mockdata/mockSykepengesoknader";
import mockSykmeldinger from "../mockdata/sykmeldinger/mockSykmeldinger";
import { sykmeldingerHentet } from "../../src/actions/sykmeldinger_actions";
import ledetekster from "../../src/reducers/ledetekster";

describe("SykmeldingUtdrag", () => {
  let state;
  let actions;
  let hentSykmeldinger;
  let ownProps;
  const ARBEIDSTAKERSOKNAD_ID = "b9732cc7-6101-446e-a1ef-ec25a425b4fb";
  let sykmelding;

  beforeEach(() => {
    state = {
      sykmeldinger: sykmeldinger(),
      ledetekster: ledetekster(),
    };
    hentSykmeldinger = sinon.spy();
    actions = { hentSykmeldinger };
    ownProps = {
      fnr: "12345000000",
      soknad: mockSykepengesoknader.find((s) => {
        return s.id === ARBEIDSTAKERSOKNAD_ID;
      }),
    };
    sykmelding = mockSykmeldinger.find((s) => {
      return s.id === ownProps.soknad.sykmeldingId;
    });
  });

  it("Skal hente sykmeldinger", () => {
    shallow(
      <Container
        {...mapStateToProps(state, ownProps)}
        {...ownProps}
        {...actions}
      />
    );
    expect(hentSykmeldinger.called).to.equal(true);
  });

  it("Skal returnere riktig sykmelding", () => {
    state.sykmeldinger = sykmeldinger(
      sykmeldinger(),
      sykmeldingerHentet(mockSykmeldinger)
    );
    const props = mapStateToProps(state, ownProps);
    expect(props.sykmelding.id).to.equal(sykmelding.id);
  });

  describe("Når søknaden er en arbeidstaker-søknad", () => {
    beforeEach(() => {
      state.sykmeldinger = sykmeldinger(
        sykmeldinger(),
        sykmeldingerHentet(mockSykmeldinger)
      );
    });

    it("Skal vise et SykmeldingUtdrag", () => {
      const component = shallow(
        <Container
          {...mapStateToProps(state, ownProps)}
          {...ownProps}
          {...actions}
        />
      );
      expect(component.find(SykmeldingUtdrag).length).to.equal(1);
    });
  });
});
