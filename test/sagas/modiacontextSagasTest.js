import { expect } from "chai";
import { put, call } from "redux-saga/effects";
import { get, post } from "../../src/api";
import {
  aktivEnhetSaga,
  pushModiacontextSaga,
  aktivBrukerSaga,
} from "../../src/sagas/modiacontextSagas";
import {
  HENTER_AKTIVENHET,
  PUSHER_MODIACONTEXT,
  HENTER_AKTIVBRUKER,
} from "../../src/actions/actiontyper";

describe("modiacontextSagas", () => {
  let apiPath;

  beforeEach(() => {
    apiPath = "/modiacontextholder/api";
    process.env = {
      REACT_APP_CONTEXTHOLDER_ROOT: apiPath,
    };
  });

  describe("aktivEnhetSaga", () => {
    const generator = aktivEnhetSaga();

    it(`Skal dispatche ${HENTER_AKTIVENHET}`, () => {
      const nextPut = put({ type: HENTER_AKTIVENHET });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest hente aktiv enhet", () => {
      const path = `${apiPath}/context/aktivenhet`;
      const nextCall = call(get, path);
      expect(generator.next().value).to.deep.equal(nextCall);
    });
  });

  describe("aktivBrukerSaga", () => {
    const generator = aktivBrukerSaga();

    it(`Skal dispatche ${HENTER_AKTIVBRUKER}`, () => {
      const nextPut = put({ type: HENTER_AKTIVBRUKER });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest hente aktiv bruker", () => {
      const path = `${apiPath}/context/aktivbruker`;
      const nextCall = call(get, path);
      expect(generator.next().value).to.deep.equal(nextCall);
    });
  });

  describe("pushModiacontextSaga", () => {
    const generator = pushModiacontextSaga({
      data: {
        verdi: "fnr",
        eventType: "event1",
      },
    });

    it(`Skal dispatche ${PUSHER_MODIACONTEXT}`, () => {
      const nextPut = put({ type: PUSHER_MODIACONTEXT });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest pushe context", () => {
      const path = `${apiPath}/context`;
      const nextCall = call(post, path, {
        verdi: "fnr",
        eventType: "event1",
      });
      expect(generator.next().value).to.deep.equal(nextCall);
    });
  });
});
