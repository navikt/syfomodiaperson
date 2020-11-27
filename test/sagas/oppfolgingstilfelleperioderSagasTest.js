import { expect } from "chai";
import { put, call } from "redux-saga/effects";
import { get } from "../../src/api";
import {
  HENT_OPPFOLGINGSTILFELLEPERIODER_HENTER,
  HENT_OPPFOLGINGSTILFELLEPERIODER_HENTET,
} from "../../src/actions/oppfolgingstilfelleperioder_actions";
import { hentOppfolgingstilfelleperioder } from "../../src/sagas/oppfolgingstilfelleperioderSagas";

describe("oppfolgingstilfelleSagas", () => {
  const orgnummer = "123456789";
  const fnr = "1234";

  describe("hentOppfolgingstilfelleperioder", () => {
    const generator = hentOppfolgingstilfelleperioder({ fnr }, orgnummer);

    it(`Skal dispatche ${HENT_OPPFOLGINGSTILFELLEPERIODER_HENTER}`, () => {
      const nextPut = put({
        type: HENT_OPPFOLGINGSTILFELLEPERIODER_HENTER,
        orgnummer,
      });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest kalle resttjenesten", () => {
      const nextCall = call(
        get,
        `${process.env.REACT_APP_REST_ROOT}/internad/oppfolgingstilfelleperioder?fnr=${fnr}&orgnummer=${orgnummer}`
      );
      expect(generator.next().value).to.deep.equal(nextCall);
    });

    it(`Skal dispatche ${HENT_OPPFOLGINGSTILFELLEPERIODER_HENTET}`, () => {
      const nextPut = put({
        type: HENT_OPPFOLGINGSTILFELLEPERIODER_HENTET,
        data: [{ fom: null }],
        orgnummer,
      });
      expect(generator.next([{ fom: null }]).value).to.deep.equal(nextPut);
    });
  });
});
