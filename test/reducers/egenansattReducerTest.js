import { expect } from "chai";
import deepFreeze from "deep-freeze";
import * as actions from "../../src/actions/egenansatt_actions";
import egenansatt from "../../src/reducers/egenansatt";
import {
  HENTER_EGENANSATT,
  EGENANSATT_HENTET,
  HENT_EGENANSATT_FEILET,
} from "../../src/actions/egenansatt_actions";

describe("egenansatt", () => {
  describe("henter", () => {
    const initialState = deepFreeze({
      henter: false,
      hentet: false,
      hentingFeilet: false,
      data: {},
    });

    it(`håndterer ${HENTER_EGENANSATT}`, () => {
      const action = actions.henterEgenansatt();
      const nextState = egenansatt(initialState, action);
      expect(nextState).to.deep.equal({
        henter: true,
        hentet: false,
        hentingFeilet: false,
        data: {},
      });
    });

    it(`håndterer ${EGENANSATT_HENTET}`, () => {
      const data = true;
      const action = actions.egenansattHentet(data);
      const nextState = egenansatt(initialState, action);
      expect(nextState).to.deep.equal({
        henter: false,
        hentet: true,
        hentingFeilet: false,
        data: {
          erEgenAnsatt: data,
        },
      });
    });

    it(`håndterer ${HENT_EGENANSATT_FEILET}`, () => {
      const action = actions.hentEgenansattFeilet();
      const nextState = egenansatt(initialState, action);
      expect(nextState).to.deep.equal({
        henter: false,
        hentet: false,
        hentingFeilet: true,
        data: {},
      });
    });
  });
});
