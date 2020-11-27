import React from "react";
import { Link } from "react-router";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount } from "enzyme";
import { BRUKER, NAV_VEILEDER, ARBEIDSGIVER } from "../../../src/konstanter";
import BesvarteTidspunkter from "../../../src/mote/components/BesvarteTidspunkter";
import { NavKan } from "../../../src/mote/components/SvarMedIkon";
import { getTidligereAlternativer } from "../../../src/utils/moteplanleggerUtils";
import {
  moteBesvartMedNyeAlternativerIkkeBesvart,
  moteBesvartMedNyeAlternativerBesvart,
  moteBesvartTrueAvArbeidsgiver,
  moteIkkeBesvart,
} from "../../mockdata/mockMoteforesporsel";

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("BesvarteTidspunkter", () => {
  let component;
  let getComp;

  beforeEach(() => {
    process.env = {
      APP_ROOT: "/",
    };
    getComp = (mote, opts) => {
      const alternativer = getTidligereAlternativer(mote);
      return mount(
        <BesvarteTidspunkter
          mote={mote}
          alternativer={alternativer}
          {...opts}
        />
      );
    };
  });

  it("Skal inneholde et .js-alternativ for hvert alternativ", () => {
    component = getComp(moteBesvartMedNyeAlternativerIkkeBesvart);
    expect(component.find(".js-alternativ")).to.have.length(2);
  });

  it("Skal vise svar til annen bruker", () => {
    component = getComp(moteBesvartMedNyeAlternativerIkkeBesvart);
    expect(component.find(".js-alternativ")).to.have.length(2);
  });

  it("Skal vise svaret til NAV", () => {
    expect(component.find(NavKan)).to.have.length(2);
  });

  it('Skal ikke vise "Bekreft tidspunkt"-knapp', () => {
    expect(component.find(".js-bekreft-tidspunkt")).to.have.length(0);
  });

  describe('Når deltakertype === "arbeidsgiver"', () => {
    beforeEach(() => {
      component = getComp(moteBesvartMedNyeAlternativerBesvart, {
        deltakertype: ARBEIDSGIVER,
      });
    });

    it("Skal vise svar til annen bruker", () => {
      expect(component.find(".js-alternativ")).to.have.length(4);
    });

    it("SKal vise svar til innlogget bruker", () => {
      expect(component.find(".js-alternativ")).to.have.length(4);
    });

    it('Skal ikke vise "Bekreft tidspunkt"-knapp', () => {
      expect(component.find(".js-bekreft-tidspunkt")).to.have.length(0);
    });

    it("Skal vise NavKan", () => {
      expect(component.find(NavKan)).to.have.length(4);
    });
  });

  describe('Når deltakertype === "NAV_VEILEDER" når moteBesvartTrueAvArbeidsgiver', () => {
    beforeEach(() => {
      component = mount(
        <BesvarteTidspunkter
          mote={moteBesvartTrueAvArbeidsgiver}
          alternativer={moteBesvartTrueAvArbeidsgiver.alternativer}
          deltakertype={NAV_VEILEDER}
          fnr="123"
        />
      );
    });

    it('Skal vise "Bekreft tidspunkt"-lenker', () => {
      expect(component.find(Link)).to.have.length(2);
      expect(component.find("a.js-bekreft-tidspunkt")).to.have.length(2);
    });

    it("Lenken skal ha riktig to-parameter", () => {
      component.find(Link).forEach((l) => {
        expect(l.prop("to")).to.contain("/sykefravaer/123/mote/bekreft/");
      });
    });

    it("Skal ikke vise NavKan", () => {
      expect(component.find(NavKan)).to.have.length(0);
    });
  });

  describe('Når deltakertype === "NAV_VEILEDER" når moteIkkeBesvart', () => {
    beforeEach(() => {
      component = mount(
        <BesvarteTidspunkter
          mote={moteIkkeBesvart}
          alternativer={moteIkkeBesvart.alternativer}
          deltakertype={NAV_VEILEDER}
          fnr="123"
        />
      );
    });

    it('Skal vise "Bekreft tidspunkt"-lenker', () => {
      expect(component.find(Link)).to.have.length(2);
      expect(component.find("a.js-bekreft-tidspunkt")).to.have.length(2);
    });

    it("Lenken skal ha riktig to-parameter", () => {
      component.find(Link).forEach((l) => {
        expect(l.prop("to")).to.contain("/sykefravaer/123/mote/bekreft/");
      });
    });
  });

  describe("Når det ikke finnes arbeidsgiver på møtet fordi brukeren f.eks. er reservert i KRR", () => {
    beforeEach(() => {
      const mote = Object.assign({}, moteBesvartTrueAvArbeidsgiver, {
        deltakere: moteBesvartTrueAvArbeidsgiver.deltakere.filter((d) => {
          return d.type === ARBEIDSGIVER;
        }),
      });
      component = mount(
        <BesvarteTidspunkter
          mote={mote}
          alternativer={moteBesvartTrueAvArbeidsgiver.alternativer}
          deltakertype={NAV_VEILEDER}
          fnr="123"
        />
      );
    });
  });

  describe("Når det bare finnes bruker på møtet fordi arbeidsgiveren av en eller annen grunn ikke er der", () => {
    beforeEach(() => {
      const mote = Object.assign({}, moteBesvartTrueAvArbeidsgiver, {
        deltakere: moteBesvartTrueAvArbeidsgiver.deltakere.filter((d) => {
          return d.type === BRUKER;
        }),
      });
      component = mount(
        <BesvarteTidspunkter
          mote={mote}
          alternativer={moteBesvartTrueAvArbeidsgiver.alternativer}
          deltakertype={NAV_VEILEDER}
          fnr="123"
        />
      );
    });
  });
});
