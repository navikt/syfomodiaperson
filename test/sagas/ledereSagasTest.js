import { expect } from "chai";
import { put, call } from "redux-saga/effects";
import { get } from "../../src/api";
import { hentLedere } from "../../src/sagas/ledereSagas";
import { HENTER_LEDERE, LEDERE_HENTET } from "../../src/actions/actiontyper";

describe("ledereSagas", () => {
  beforeEach(() => {
    process.env = {
      REACT_APP_REST_ROOT: "/sykefravaer",
    };
  });

  const generator = hentLedere({
    fnr: "55",
  });

  it(`Skal dispatche ${HENTER_LEDERE}`, () => {
    const nextPut = put({ type: HENTER_LEDERE });
    expect(generator.next().value).to.deep.equal(nextPut);
  });

  it("Skal dernest hente ledere", () => {
    const nextCall = call(
      get,
      "/sykefravaer/internad/allnaermesteledere?fnr=55"
    );
    expect(generator.next().value).to.deep.equal(nextCall);
  });

  it("Skal dernest hente ledere", () => {
    const nextPut = put({
      type: LEDERE_HENTET,
      data: "mine data",
    });
    expect(generator.next("mine data").value).to.deep.equal(nextPut);
  });
});
