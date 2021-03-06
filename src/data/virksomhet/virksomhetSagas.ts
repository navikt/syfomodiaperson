import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get } from "../../api";
import * as actions from "./virksomhet_actions";

export function* hentVirksomhet(action: any) {
  const orgnummer = action.orgnummer;
  yield put(actions.henterVirksomhet(orgnummer));
  try {
    const path = `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/internad/virksomhet/${orgnummer}`;
    const data = yield call(get, path);
    yield put(actions.virksomhetHentet(orgnummer, data));
  } catch (e) {
    yield put(actions.hentVirksomhetFeilet(orgnummer));
  }
}

export const skalHenteVirksomhet = (state: any, action: any) => {
  const orgnummer = action.orgnummer || {};
  const reducer = state.virksomhet[orgnummer] || {};
  return (!reducer.henter && !reducer.hentingForsokt) || false;
};

export function* hentVirksomhetHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHenteVirksomhet, action);
  if (skalHente) {
    yield hentVirksomhet(action);
  }
}

function* watchHentVirksomhet() {
  yield takeEvery(
    actions.HENT_VIRKSOMHET_FORESPURT,
    hentVirksomhetHvisIkkeHentet
  );
}

export default function* virksomhetSagas() {
  yield all([fork(watchHentVirksomhet)]);
}
