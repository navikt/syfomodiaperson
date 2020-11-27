import { expect } from "chai";
import { put, call } from "redux-saga/effects";
import { get } from "../../../src/api";
import * as actions from "../../../src/actions/virksomhet_actions";
import { hentVirksomhet } from "../../../src/sagas/virksomhetSagas";

describe("virksomhetSagas", () => {
  beforeEach(() => {
    process.env = {
      REACT_APP_REST_ROOT: "/sykefravaer",
      REACT_APP_MOTEADMIN_REST_ROOT: "/moteadmin",
    };
  });

  describe("Epost for bekreftelse av møtetidspunkt", () => {
    const orgnummer = "88776655";
    const action = actions.hentVirksomhet(orgnummer);
    const generator = hentVirksomhet(action);

    it(`Skal dispatche ${actions.HENTER_VIRKSOMHET}`, () => {
      const nextPut = put({
        type: actions.HENTER_VIRKSOMHET,
        orgnummer,
      });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal deretter prøve å hente virksomhet", () => {
      const path = "/moteadmin/internad/virksomhet/88776655";
      const nextCall = call(get, path);
      expect(generator.next().value).to.deep.equal(nextCall);
    });

    it(`Skal deretter dispatche ${actions.HENTER_VIRKSOMHET}`, () => {
      const data = {
        navn: "NAV Consulting",
      };
      const nextPut = put({
        type: actions.VIRKSOMHET_HENTET,
        orgnummer,
        data,
      });
      expect(generator.next(data).value).to.deep.equal(nextPut);
    });
  });
});
