import { expect } from "chai";
import deepFreeze from "deep-freeze";
import sinon from "sinon";
import motebehov, { sorterEtterDato } from "../../src/data/motebehov/motebehov";
import * as actions from "../../src/data/motebehov/motebehov_actions";
import * as behandleActions from "../../src/data/motebehov/behandlemotebehov_actions";
import { VEILEDER_IDENT_DEFAULT } from "../../mock/common/mockConstants";

describe("motebehov", () => {
  let clock;
  let veilederIdent;
  let motebehovListe;
  const today = new Date("2017-01-16");

  beforeEach(() => {
    motebehovListe = [
      {
        id: "1",
        opprettetDato: "2017-02-22",
        opprettetAv: "123",
        arbeidstaker: {
          fnr: "123",
        },
        motebehovSvar: {
          friskmeldingForventning: "Ja, i morgen",
          tiltak: "Ligge paa sofaen",
          tiltakResultat: "Funket bra",
          harMotebehov: true,
          forklaring: "Flere tiltak",
        },
      },
      {
        id: "2",
        opprettetDato: "2017-02-24",
        opprettetAv: "123",
        arbeidstaker: {
          fnr: "123",
        },
        motebehovSvar: {
          friskmeldingForventning: "Nei",
          tiltak: "Ligge paa sofaen",
          tiltakResultat: "Funket daarlig",
          harMotebehov: false,
          forklaring: "Jeg vil ikke ha hjelp!",
        },
      },
    ];
    clock = sinon.useFakeTimers(today.getTime()); // 16. januar 2017
    veilederIdent = VEILEDER_IDENT_DEFAULT;
  });

  afterEach(() => {
    clock.restore();
  });

  describe("HENT MØTEBEHOV", () => {
    it(`håndterer ${actions.HENT_MOTEBEHOV_HENTER}`, () => {
      const initialState = deepFreeze({});
      const action = actions.henterMotebehov();

      const nextState = motebehov(initialState, action);

      expect(nextState).to.deep.equal({
        data: [],
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      });
    });

    it(`håndterer ${actions.HENT_MOTEBEHOV_HENTET} , med sortert motebehovliste`, () => {
      const initialState = deepFreeze({
        data: [],
        henter: true,
      });
      const action = actions.motebehovHentet(motebehovListe);

      const nextState = motebehov(initialState, action);

      expect(nextState).to.deep.equal({
        data: motebehovListe,
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
      });
    });

    it(`håndterer ${actions.HENT_MOTEBEHOV_FEILET}`, () => {
      const initialState = deepFreeze({});
      const action = actions.hentMotebehovFeilet();

      const nextState = motebehov(initialState, action);

      expect(nextState).to.deep.equal({
        data: [],
        henter: false,
        hentet: false,
        hentingFeilet: true,
        hentingForsokt: true,
      });
    });

    it(`Håndterer ${behandleActions.BEHANDLE_MOTEBEHOV_BEHANDLET}`, () => {
      const initialState = deepFreeze({
        data: [],
        henter: true,
      });

      const action1 = actions.motebehovHentet(motebehovListe);

      const nextState1 = motebehov(initialState, action1);

      const action2 = behandleActions.behandleMotebehovBehandlet(veilederIdent);

      const nextState2 = motebehov(nextState1, action2);

      expect(nextState2).to.deep.equal({
        data: [
          {
            ...motebehovListe[0],
            behandletTidspunkt: new Date(),
            behandletVeilederIdent: veilederIdent,
          },
          {
            ...motebehovListe[1],
            behandletTidspunkt: new Date(),
            behandletVeilederIdent: veilederIdent,
          },
        ],
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
      });
    });
  });

  describe("sorterEtterDato", () => {
    it("Returnerer nyeste dato", () => {
      const eldsteMotebehov = {
        id: "1",
        opprettetDato: new Date(Date.now() - 3600000),
      };
      const nyesteMotebehov = {
        id: "2",
        opprettetDato: new Date(Date.now()),
      };

      const resultat = sorterEtterDato(eldsteMotebehov, nyesteMotebehov);

      expect(resultat).to.equal(1);
    });
  });
});
