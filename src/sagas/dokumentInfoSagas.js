import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get } from "../api";
import * as actions from "../actions/dokumentinfo_actions";

export function* dokumentInfoSaga(action) {
  yield put(actions.henterDokumentinfo(action.id));
  try {
    const path = `${process.env.REACT_APP_OPPFOLGINGSPLANREST_ROOT}/internad/dokument/${action.id}/dokumentinfo`;
    const data = yield call(get, path);
    yield put(actions.dokumentinfoHentet(action.id, data));
  } catch (e) {
    yield put(actions.hentDokumentinfoFeilet(action.id));
  }
}

export const skalHenteDokumentInfo = (state, action) => {
  const planId = action.id || {};
  const reducer = state.dokumentinfo[planId] || {};
  return (!reducer.henter && !reducer.hentingForsokt) || false;
};

export function* hentMotebehovHvisIkkeHentet(action) {
  const skalHente = yield select(skalHenteDokumentInfo, action);
  if (skalHente) {
    yield dokumentInfoSaga(action);
  }
}

function* watchHentDokumentInfo() {
  yield takeEvery(
    actions.HENT_DOKUMENTINFO_FORESPURT,
    hentMotebehovHvisIkkeHentet
  );
}

export default function* dokumentInfoSagas() {
  yield all([fork(watchHentDokumentInfo)]);
}
