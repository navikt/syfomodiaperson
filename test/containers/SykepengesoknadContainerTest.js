import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import {
  Container,
  mapStateToProps,
} from "../../src/components/speiling/sykepengsoknader/container/SykepengesoknadContainer";
import soknader from "../../src/data/sykepengesoknad/soknader";
import sykmeldinger from "../../src/data/sykmelding/sykmeldinger";
import { soknaderHentet } from "../../src/data/sykepengesoknad/soknader_actions";
import mockSoknader from "../mockdata/mockSoknader";
import Feilmelding from "../../src/components/Feilmelding";
import SykepengesoknadUtland from "../../src/components/speiling/sykepengsoknader/soknad-utland/SykepengesoknadUtland";
import { sykmeldingerHentet } from "../../src/data/sykmelding/sykmeldinger_actions";

describe("SykepengesoknadContainer", () => {
  let actions;
  let state;
  let ownProps;
  let settOwnPropsId;
  let hentSoknader;
  let hentSykmeldinger;
  const ARBEIDSTAKERSOKNAD_ID = "b9732cc7-6101-446e-a1ef-ec25a425b4fb";
  const NAERINGSDRIVENDESOKNAD_ID = "faadf7c1-3aac-4758-8673-e9cee1316a3c";
  const OPPHOLD_UTLAND_ID = "e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee";

  beforeEach(() => {
    hentSoknader = sinon.spy();
    hentSykmeldinger = sinon.spy();
    actions = {
      hentSoknader,
      hentSykmeldinger,
    };
    state = {
      soknader: soknader(soknader(), soknaderHentet(mockSoknader)),
      sykmeldinger: sykmeldinger(sykmeldinger(), sykmeldingerHentet([])),
      tilgang: {
        data: {
          harTilgang: true,
        },
      },
      navbruker: {
        data: {
          navn: "Ola Nordmann",
        },
      },
      valgtbruker: {
        personident: "887766",
      },
    };
    ownProps = {
      match: {
        params: {
          sykepengesoknadId: "1",
        },
      },
    };
    settOwnPropsId = (soknadId) => {
      ownProps.match.params.sykepengesoknadId = soknadId;
    };
  });

  describe("Visning av sykepengesøknad for arbeidstakere", () => {
    it("Skal vise SendtSoknadArbeidstakerNy", () => {
      settOwnPropsId(OPPHOLD_UTLAND_ID);
      const component = shallow(
        <Container {...mapStateToProps(state, ownProps)} actions={actions} />
      );
      expect(component.find(SykepengesoknadUtland).length).to.equal(1);
    });
  });

  describe("Håndtering av feil", () => {
    it("Skal vise feilmelding hvis søknaden er en selvstendig-søknad og henting av selvstendig-søknader feiler", () => {
      settOwnPropsId(NAERINGSDRIVENDESOKNAD_ID);
      state.soknader.hentingFeilet = true;
      state.soknader.data = [];
      const component = shallow(
        <Container {...mapStateToProps(state, ownProps)} actions={actions} />
      );
      expect(component.find(Feilmelding)).to.have.length(1);
    });
  });
});
