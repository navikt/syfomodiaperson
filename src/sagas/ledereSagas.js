import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { log } from "@navikt/digisyfo-npm";
import { get } from "../api";
import * as actiontype from "../actions/actiontyper";

export function* hentLedere(action) {
  yield put({ type: actiontype.HENTER_LEDERE });
  try {
    const path = `${process.env.REACT_APP_REST_ROOT}/internad/allnaermesteledere?fnr=${action.fnr}`;
    const data = yield call(get, path);
    yield put({ type: actiontype.LEDERE_HENTET, data });
  } catch (e) {
    log(e);
    yield put({ type: actiontype.HENT_LEDERE_FEILET });
  }
}

export const skalHenteLedere = (state) => {
  const reducer = state.ledere;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export function* hentLedereHvisIkkeHentet(action) {
  const skalHente = yield select(skalHenteLedere);
  if (skalHente) {
    yield hentLedere(action);
  }
}

function* watchHentLedere() {
  yield takeEvery(actiontype.HENT_LEDERE_FORESPURT, hentLedereHvisIkkeHentet);
}

export default function* ledereSagas() {
  yield fork(watchHentLedere);
}
