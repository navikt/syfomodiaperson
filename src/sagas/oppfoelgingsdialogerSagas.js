import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { log } from "@navikt/digisyfo-npm";
import { get } from "../api";
import * as actions from "../actions/oppfoelgingsdialoger_actions";

export function* hentOppfoelgingsdialoger(action) {
  yield put(actions.henterOppfoelgingsdialoger());
  try {
    const path = `${process.env.REACT_APP_OPPFOLGINGSPLANREST_ROOT}/internad/v1/oppfolgingsplan/${action.fnr}`;
    const data = yield call(get, path);
    yield put(actions.hentOppfolgingsdialogerHentet(data));
  } catch (e) {
    log(e);
    yield put(actions.hentOppfoelgingsdialogerFeilet());
  }
}

export const skalHenteOppfolgingsplaner = (state) => {
  const reducer = state.oppfoelgingsdialoger;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export function* hentOppfolgingsplanerHvisIkkeHentet(action) {
  const skalHente = yield select(skalHenteOppfolgingsplaner);
  if (skalHente) {
    yield hentOppfoelgingsdialoger(action);
  }
}

function* watchHentOppfoelgingsdialoger() {
  yield takeEvery(
    actions.HENT_OPPFOELGINGSDIALOGER_FORESPURT,
    hentOppfolgingsplanerHvisIkkeHentet
  );
}

export default function* oppfoelgingsdialogerSagas() {
  yield fork(watchHentOppfoelgingsdialoger);
}
