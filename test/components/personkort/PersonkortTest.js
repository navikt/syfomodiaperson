import React from "react";
import { expect } from "chai";
import { mount, shallow } from "enzyme";
import sinon from "sinon";
import { Utvidbar } from "@navikt/digisyfo-npm";
import EtikettBase from "nav-frontend-etiketter";
import Personkort from "../../../src/components/personkort/Personkort";
import PersonkortVisning from "../../../src/components/personkort/PersonkortVisning";
import { hentBrukersAlderFraFnr } from "../../../src/utils/fnrUtils";
import PersonkortHeader from "../../../src/components/personkort/PersonkortHeader";
import mockOldSykmeldinger from "../../mockdata/sykmeldinger/mockOldSykmeldinger";

describe("Personkort", () => {
  let hentDiskresjonskode;
  let hentEgenansatt;
  let hentFastleger;
  let hentLedere;
  let hentOppfolgingstilfelleperioder;
  let hentSykmeldinger;
  let actions;
  let egenansatt;
  let diskresjonskode;
  let navbruker;
  let fastleger;
  let komponent;
  let sykmeldinger;

  beforeEach(() => {
    diskresjonskode = { data: {} };
    egenansatt = { data: {} };
    fastleger = {
      henter: false,
      hentingFeilet: false,
      hentet: false,
    };
    navbruker = {
      navn: "Knut",
      kontaktinfo: {
        fnr: "1234",
      },
    };
    sykmeldinger = mockOldSykmeldinger;
    hentDiskresjonskode = sinon.spy();
    hentEgenansatt = sinon.spy();
    hentFastleger = sinon.spy();
    hentLedere = sinon.spy();
    hentOppfolgingstilfelleperioder = sinon.spy();
    hentSykmeldinger = sinon.spy();
    actions = {
      hentDiskresjonskode,
      hentEgenansatt,
      hentFastleger,
      hentLedere,
      hentOppfolgingstilfelleperioder,
      hentSykmeldinger,
    };
    komponent = shallow(
      <Personkort
        actions={actions}
        diskresjonskode={diskresjonskode}
        egenansatt={egenansatt}
        fastleger={fastleger}
        navbruker={navbruker}
        sykmeldinger={sykmeldinger}
      />
    );
  });

  it("Skal vise PersonkortHeader", () => {
    komponent = mount(
      <Personkort
        actions={actions}
        diskresjonskode={diskresjonskode}
        egenansatt={egenansatt}
        fastleger={fastleger}
        navbruker={navbruker}
        sykmeldinger={sykmeldinger}
      />
    );
    expect(komponent.find(PersonkortHeader)).to.have.length(1);
  });

  it("Skal vise Utvidbar", () => {
    expect(komponent.find(Utvidbar)).to.have.length(1);
  });

  it("Skal vise PersonkortVisning", () => {
    expect(komponent.find(PersonkortVisning)).to.have.length(1);
  });

  describe("PersonkortHeader", () => {
    beforeEach(() => {
      diskresjonskode = { data: {} };
      egenansatt = { data: {} };
      navbruker = {
        navn: "Knut",
        kontaktinfo: {
          fnr: "1234",
        },
      };
      komponent = shallow(
        <PersonkortHeader
          diskresjonskode={diskresjonskode}
          egenansatt={egenansatt}
          navbruker={navbruker}
          sykmeldinger={sykmeldinger}
        />
      );
    });

    it("Skal vise navbrukers fnr, navn og alder", () => {
      expect(komponent.text()).to.contain(navbruker.navn);
      expect(komponent.text()).to.contain(navbruker.kontaktinfo.fnr);
      expect(komponent.text()).to.contain(
        hentBrukersAlderFraFnr(navbruker.kontaktinfo.fnr)
      );
    });

    it("Skal vise ikke vise noen EtikettBase, om visEtikett gir false", () => {
      komponent = shallow(
        <PersonkortHeader
          diskresjonskode={diskresjonskode}
          egenansatt={egenansatt}
          navbruker={navbruker}
          sykmeldinger={sykmeldinger}
        />
      );
      expect(komponent.find(EtikettBase)).to.have.length(0);
    });

    it("Skal vise en EtikettBase, om bruker har diskresjonskode er 6", () => {
      diskresjonskode = {
        data: {
          diskresjonskode: "6",
        },
      };
      komponent = shallow(
        <PersonkortHeader
          diskresjonskode={diskresjonskode}
          egenansatt={egenansatt}
          navbruker={navbruker}
          sykmeldinger={sykmeldinger}
        />
      );
      expect(komponent.find(EtikettBase)).to.have.length(1);
    });

    it("Skal vise en EtikettBase, om bruker har diskresjonskode 7", () => {
      diskresjonskode = {
        data: {
          diskresjonskode: "7",
        },
      };
      komponent = shallow(
        <PersonkortHeader
          diskresjonskode={diskresjonskode}
          egenansatt={egenansatt}
          navbruker={navbruker}
          sykmeldinger={sykmeldinger}
        />
      );
      expect(komponent.find(EtikettBase)).to.have.length(1);
    });

    it("Skal vise en EtikettBase, om bruker er egenansatt", () => {
      egenansatt = {
        data: {
          erEgenAnsatt: true,
        },
      };
      komponent = shallow(
        <PersonkortHeader
          diskresjonskode={diskresjonskode}
          egenansatt={egenansatt}
          navbruker={navbruker}
          sykmeldinger={sykmeldinger}
        />
      );
      expect(komponent.find(EtikettBase)).to.have.length(1);
    });
  });
});
