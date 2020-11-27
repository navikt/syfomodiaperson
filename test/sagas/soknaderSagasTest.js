import { expect } from "chai";
import { put, call } from "redux-saga/effects";
import { hentSoknader } from "../../src/sagas/soknaderSagas";
import { get } from "../../src/api";
import * as actions from "../../src/actions/soknader_actions";
import mockSoknader from "../mockdata/mockSoknader";

describe("soknaderSagas", () => {
  describe("Henting av søknader", () => {
    const action = actions.hentSoknader();
    const generator = hentSoknader(action);
    const fnr = action.fnr || "";

    it(`Skal dispatche ${actions.HENTER_SOKNADER}`, () => {
      const nextPut = put(actions.henterSoknader());
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal hente søknader", () => {
      const nextCall = call(
        get,
        `${process.env.REACT_APP_SYFOSOKNAD_ROOT}/veileder/internad/soknader?fnr=${fnr}`
      );
      expect(generator.next().value).to.deep.equal(nextCall);
    });

    it(`Skal deretter dispatche ${actions.SOKNADER_HENTET}`, () => {
      const nextPut = put(actions.soknaderHentet(mockSoknader));
      expect(generator.next(mockSoknader).value).to.deep.equal(nextPut);
    });
  });
});
