import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { log } from "@navikt/digisyfo-npm";
import { get } from "../api";
import * as actions from "../actions/soknader_actions";

export function* hentSoknader(action) {
  const fnr = action.fnr ? action.fnr : "";
  yield put(actions.henterSoknader());
  try {
    const path = `${process.env.REACT_APP_SYFOSOKNAD_ROOT}/veileder/internad/soknader?fnr=${fnr}`;
    const data = yield call(get, path);
    yield put(actions.soknaderHentet(data));
  } catch (e) {
    log(e);
    yield put(actions.hentSoknaderFeilet());
  }
}

export const skalHenteSoknader = (state) => {
  const reducer = state.soknader;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export function* hentSoknaderHvisIkkeHentet(action) {
  const skalHente = yield select(skalHenteSoknader);
  if (skalHente) {
    yield hentSoknader(action);
  }
}

function* watchHentSoknader() {
  yield takeEvery(actions.HENT_SOKNADER_FORESPURT, hentSoknaderHvisIkkeHentet);
}

export default function* soknaderSagas() {
  yield fork(watchHentSoknader);
}
