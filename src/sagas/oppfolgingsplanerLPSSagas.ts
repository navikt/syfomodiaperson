import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get } from "../api";
import * as actions from "../actions/oppfolgingsplanerlps_actions";
import { PersonOppgave } from "../types/PersonOppgave";

export function* hentOppfolgingsplanerLPS(
  action: any,
  personOppgaveList: PersonOppgave[]
) {
  yield put(actions.hentOppfolgingsplanerLPSHenter());
  try {
    const path = `${process.env.REACT_APP_OPPFOLGINGSPLANREST_ROOT}/internad/oppfolgingsplan/lps`;
    const data = yield call(get, path, action.fnr);
    yield put(actions.hentOppfolgingsplanerLPSHentet(data, personOppgaveList));
  } catch (e) {
    yield put(actions.hentOppfolgingsplanerLPSFeilet());
  }
}

export const skalHenteOppfolgingsplanerLPS = (state: any) => {
  const reducer = state.oppfolgingsplanerlps;
  const harHentetPersonOppgaver = state.personoppgaver.hentet;
  return harHentetPersonOppgaver && !(reducer.henter || reducer.hentingForsokt);
};

export const hentPersonOppgaver = (state: any) => {
  const hentetPersonOppgaver = state.personoppgaver.hentet;
  if (hentetPersonOppgaver) {
    return state.personoppgaver.data;
  }
  return [];
};

export function* hentOppfolgingsplanerLPSHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHenteOppfolgingsplanerLPS);
  if (skalHente) {
    const personOppgaveList = yield select(hentPersonOppgaver);
    yield hentOppfolgingsplanerLPS(action, personOppgaveList);
  }
}

function* watchHentOppfolgingsplanerLPS() {
  yield takeEvery(
    actions.HENT_OPPFOLGINGSPLANER_LPS_FORESPURT,
    hentOppfolgingsplanerLPSHvisIkkeHentet
  );
}

export default function* oppfolgingsplanerLPSSagas() {
  yield all([fork(watchHentOppfolgingsplanerLPS)]);
}
