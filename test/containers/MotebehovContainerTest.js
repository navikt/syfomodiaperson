import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import AppSpinner from "../../src/components/AppSpinner";
import Feilmelding from "../../src/components/Feilmelding";
import Motebehov from "../../src/components/motebehov/Motebehov";
import {
  mapStateToProps,
  MotebehovSide,
} from "../../src/containers/MotebehovContainer";
import { ANTALL_MS_DAG } from "../../src/utils/datoUtils";

describe("MotebehovContainer", () => {
  describe("MotebehovSide", () => {
    let actions;
    let hentLedere;
    let hentMotebehov;
    let hentOppfoelgingsdialoger;
    let hentOppfolgingstilfelleperioder;
    let hentSykmeldinger;
    let tilgang;
    let motebehovTilgang;
    let ledereData;
    beforeEach(() => {
      hentLedere = sinon.spy();
      hentMotebehov = sinon.spy();
      hentOppfoelgingsdialoger = sinon.spy();
      hentOppfolgingstilfelleperioder = sinon.spy();
      hentSykmeldinger = sinon.spy();
      tilgang = {
        harTilgang: true,
      };
      motebehovTilgang = {};
      actions = {
        hentLedere,
        hentMotebehov,
        hentOppfoelgingsdialoger,
        hentOppfolgingstilfelleperioder,
        hentSykmeldinger,
      };
      ledereData = [];
    });

    it("Skal vise AppSpinner hvis man henter møtebehov/ledetekster", () => {
      const component = shallow(
        <MotebehovSide
          tilgang={tilgang}
          actions={actions}
          henter
          motebehovForsoktHentet
          motebehovTilgang={motebehovTilgang}
          ledereData={ledereData}
        />
      );

      expect(component.find(AppSpinner)).to.have.length(1);
    });

    it("Skal vise AppSpinner hvis noe blir hentet", () => {
      const component = shallow(
        <MotebehovSide
          tilgang={tilgang}
          actions={actions}
          henter
          motebehovTilgang={motebehovTilgang}
          ledereData={ledereData}
        />
      );

      expect(component.find(AppSpinner)).to.have.length(1);
    });

    it("Skal vise feilmelding hvis hentingFeilet", () => {
      const component = shallow(
        <MotebehovSide
          tilgang={tilgang}
          actions={actions}
          motebehovListe={[]}
          motebehovTilgang={motebehovTilgang}
          motebehovForsoktHentet
          hentingFeilet
          ledereData={ledereData}
        />
      );

      expect(component.find(Feilmelding)).to.have.length(1);
    });

    it("Skal vise Motebehov hvis det finnes innsendte møtebehov", () => {
      const motebehovListeUtenFlereSvarFraSammePerson = [
        {
          id: "123",
          motebehovSvar: {},
        },
      ];

      const component = shallow(
        <MotebehovSide
          tilgang={tilgang}
          fnr="fnr"
          actions={actions}
          motebehovListeUtenFlereSvarFraSammePerson={
            motebehovListeUtenFlereSvarFraSammePerson
          }
          motebehovTilgang={motebehovTilgang}
          skalHenteMotebehov
          ledereData={ledereData}
        />
      );

      expect(component.find(Motebehov)).to.have.length(1);
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
        motebehov: {
          data: [],
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
        veilederinfo: {
          data: {},
        },
        ledere: {
          data: [],
        },
        oppfoelgingsdialoger: {
          data: [],
        },
        sykmeldinger: {
          data: [],
        },
        oppfolgingstilfelleperioder: [],
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

    it("Skal returnere motebehov === undefined dersom det ikke finnes møtebehov", () => {
      state.motebehov.data = [];

      const props = mapStateToProps(state, ownProps);

      expect(props.motebehov).to.be.equal(undefined);
    });

    it("Skal returnere henter når møtebehov og ledetekster ikke har blitt forsøkt hentet", () => {
      state.motebehov.data = [
        {
          id: 1,
        },
      ];
      state.motebehov.hentet = false;
      state.motebehov.hentingFeilet = false;

      state.ledetekster.hentet = false;
      state.ledetekster.hentingFeilet = false;

      const props = mapStateToProps(state, ownProps);

      expect(props.henter).to.be.equal(true);
    });

    it("Skal ikke returnere henter når alt er forsøkt hentet", () => {
      state.motebehov.data = [
        {
          id: 1,
        },
      ];
      state.motebehov.hentet = true;
      state.ledetekster.hentet = true;
      state.oppfoelgingsdialoger.hentet = true;
      state.ledere.hentet = true;

      const props = mapStateToProps(state, ownProps);

      expect(props.henter).to.be.equal(false);
    });

    it("Skal returnere hentingFeilet når henting av møtebehov feiler", () => {
      state.motebehov.data = [
        {
          id: 1,
        },
      ];
      state.motebehov.hentingFeilet = true;

      const props = mapStateToProps(state, ownProps);

      expect(props.hentingFeilet).to.be.equal(true);
    });

    it("Skal returnere hentingFeilet når henting av møtebehov ikke feiler", () => {
      state.motebehov.data = [
        {
          id: 1,
        },
      ];
      state.motebehov.hentingFeilet = false;

      const props = mapStateToProps(state, ownProps);

      expect(props.hentingFeilet).to.be.equal(false);
    });

    it("Skal returnere ett element i listen med møtebehov hvis alle motebehovsvar er fra samme person", () => {
      state.motebehov.data = [
        {
          id: "1",
          virksomhetsnummer: "123",
        },
        {
          id: "2",
          virksomhetsnummer: "123",
        },
      ];

      const props = mapStateToProps(state, ownProps);

      expect(props.motebehovListeUtenFlereSvarFraSammePerson).to.have.length(1);
    });

    it("Skal returnere to elementer i listen med møtebehov hvis to motebehovSvar er fra ulike personer", () => {
      state.motebehov.data = [
        {
          id: "1",
          virksomhetsnummer: "123",
          opprettetAv: "sykmeldt",
        },
        {
          id: "2",
          virksomhetsnummer: "123",
          opprettetAv: "leder1",
        },
        {
          id: "3",
          virksomhetsnummer: "123",
          opprettetAv: "leder1",
        },
      ];

      const props = mapStateToProps(state, ownProps);

      expect(props.motebehovListeUtenFlereSvarFraSammePerson).to.have.length(2);
    });

    it("Skal returnere det nyeste motebehovsvaret når det finnes flere svar", () => {
      const eldsteDato = new Date("2018-05-05");
      const nyesteDato = new Date("2018-10-10");
      state.motebehov.data = [
        {
          id: "1",
          virksomhetsnummer: "123",
          opprettetDato: eldsteDato,
        },
        {
          id: "2",
          virksomhetsnummer: "123",
          opprettetDato: nyesteDato,
        },
      ];

      const props = mapStateToProps(state, ownProps);
      const motebehovet = props.motebehovListeUtenFlereSvarFraSammePerson[0];

      expect(motebehovet.opprettetDato).to.equal(nyesteDato);
    });

    it("Skal returnere ledereUtenInnsendtMotebehov hvis den sykmeldte er i et aktivt oppfølgingstilfelle i møtebehovperioden", () => {
      const leder1 = "Leder1";
      const leder2 = "Leder2";
      const virksomhet1 = "123";
      const virksomhet2 = "999";
      const sykmeldt = "Sykmeldt";

      state.ledere.data = [
        {
          aktoerId: leder1,
          orgnummer: virksomhet1,
        },
        {
          aktoerId: leder2,
          orgnummer: virksomhet2,
        },
      ];

      state.oppfolgingstilfelleperioder[virksomhet1] = {
        data: [
          {
            orgnummer: virksomhet1,
            fom: new Date(Date.now() - ANTALL_MS_DAG * 120),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 90),
          },
          {
            orgnummer: virksomhet1,
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: virksomhet1,
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
          {
            orgnummer: virksomhet1,
            fom: new Date(Date.now() - ANTALL_MS_DAG * 5),
            tom: new Date(Date.now() + ANTALL_MS_DAG * 15),
          },
        ],
      };
      state.oppfolgingstilfelleperioder[virksomhet2] = {
        data: [
          {
            orgnummer: virksomhet2,
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: virksomhet2,
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
        ],
      };

      const props = mapStateToProps(state, ownProps);
      const leder = props.ledereUtenInnsendtMotebehov[0];

      expect(leder).to.deep.equal({
        aktoerId: leder1,
        orgnummer: virksomhet1,
      });
    });
  });
});
