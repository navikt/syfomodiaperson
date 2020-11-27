import { expect } from "chai";
import { call, put } from "redux-saga/effects";
import { get } from "../../src/api";
import { hentMotebehov } from "../../src/sagas/motebehovSagas";
import {
  HENT_MOTEBEHOV_HENTER,
  HENT_MOTEBEHOV_HENTET,
} from "../../src/actions/motebehov_actions";

describe("motebehovSagas", () => {
  beforeEach(() => {
    process.env = {
      REACT_APP_REST_ROOT: "http://tjenester.nav.no/",
      REACT_APP_SYFOMOTEBEHOV_ROOT: "https://app-q1.adeo.no/syfomotebehov/api",
    };
  });

  describe("hentMotebehov", () => {
    const generator = hentMotebehov({
      fnr: "123",
    });

    it(`Skal dispatche ${HENT_MOTEBEHOV_HENTER}`, () => {
      const nextPut = put({ type: HENT_MOTEBEHOV_HENTER });

      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal hente et array bestående av motebehov", () => {
      const nextCall = call(
        get,
        `${process.env.REACT_APP_SYFOMOTEBEHOV_ROOT}/internad/veileder/motebehov?fnr=123`
      );

      expect(generator.next().value).to.deep.equal(nextCall);
    });

    it(`Skal dispatche ${HENT_MOTEBEHOV_HENTET}`, () => {
      const nextPut = put({
        type: HENT_MOTEBEHOV_HENTET,
        data: [{ id: 1 }],
      });

      expect(generator.next([{ id: 1 }]).value).to.deep.equal(nextPut);
    });
  });
});
