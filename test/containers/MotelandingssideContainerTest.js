import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import AppSpinner from "../../src/components/AppSpinner";
import Feilmelding from "../../src/components/Feilmelding";
import {
  mapStateToProps,
  MotelandingssideSide,
} from "../../src/containers/MotelandingssideContainer";

describe("MotelandingssideContainer", () => {
  describe("MotelandingssideSide", () => {
    let hentMoter;
    let tilgang;
    let component;

    beforeEach(() => {
      hentMoter = sinon.spy();
      tilgang = {
        harTilgang: true,
      };
    });

    it("Skal vise AppSpinner", () => {
      component = shallow(
        <MotelandingssideSide tilgang={tilgang} hentMoter={hentMoter} henter />
      );

      expect(component.find(AppSpinner)).to.have.length(1);
    });

    it("Skal hente møter ved init", () => {
      component = shallow(
        <MotelandingssideSide
          tilgang={tilgang}
          fnr="123"
          hentMoter={hentMoter}
          mote={{}}
        />
      );
      expect(hentMoter.calledOnce).to.be.equal(true);
      expect(hentMoter.calledWith("123")).to.be.equal(true);
    });

    it("Skal vise feilmelding hvis hentingFeilet", () => {
      component = shallow(
        <MotelandingssideSide
          tilgang={tilgang}
          hentMoter={hentMoter}
          mote={{}}
          hentingFeilet
        />
      );

      expect(component.find(Feilmelding)).to.have.length(1);
    });
  });

  describe("mapStateToProps", () => {
    let state;
    let ownProps;

    beforeEach(() => {
      state = {
        navbruker: {
          data: {
            fnr: "887766",
          },
        },
        moter: {
          data: [],
        },
        motebehov: {
          data: [],
        },
        virksomhet: {
          navn: "BEKK",
        },
        tilgang: {
          data: {
            harTilgang: true,
          },
          hentingFeilet: false,
          henter: false,
        },
        ledetekster: {
          hentingFeilet: false,
          henter: false,
          data: {},
        },
      };
      ownProps = {
        params: {
          fnr: "887766",
        },
      };
    });

    it("Skal returnere fnr", () => {
      const props = mapStateToProps(state, ownProps);

      expect(props.fnr).to.equal("887766");
    });

    it("Skal returnere opprettet møte", () => {
      state.moter.data = [
        {
          id: 1,
          status: "OPPRETTET",
        },
      ];

      const props = mapStateToProps(state, ownProps);

      expect(props.mote).to.deep.equal({
        id: 1,
        status: "OPPRETTET",
      });
    });

    it("Skal returnere BEKREFTET møte", () => {
      state.moter.data = [
        {
          id: 1,
          status: "BEKREFTET",
        },
      ];

      const props = mapStateToProps(state, ownProps);

      expect(props.mote).to.deep.equal({
        id: 1,
        status: "BEKREFTET",
      });
    });

    it("Skal ikke returnere avbrutt mote", () => {
      state.moter.data = [
        {
          id: 1,
          status: "AVBRUTT",
        },
      ];

      const props = mapStateToProps(state, ownProps);

      expect(props.mote).to.be.equal(undefined);
    });

    it("Skal returnere mote === undefined dersom det ikke finnes møter", () => {
      state.moter.data = [];

      const props = mapStateToProps(state, ownProps);

      expect(props.mote).to.be.equal(undefined);
    });

    it("Skal returnere henter når det hentes møter", () => {
      state.moter.data = [
        {
          id: 1,
        },
      ];
      state.moter.henter = true;

      const props = mapStateToProps(state, ownProps);

      expect(props.henter).to.be.equal(true);
    });

    it("Skal returnere henter når det ikke hentes møter", () => {
      state.moter.data = [
        {
          id: 1,
        },
      ];
      state.moter.henter = false;

      const props = mapStateToProps(state, ownProps);

      expect(props.henter).to.be.equal(false);
    });
  });
});
