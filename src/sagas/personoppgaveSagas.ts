import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get, post } from "../api";
import * as actions from "../actions/personoppgave_actions";

export function* hentPersonOppgaver(action: any) {
  yield put(actions.hentPersonOppgaverHenter());
  try {
    const path = "/ispersonoppgave/api/v1/personoppgave/personident";
    const data = yield call(get, path, action.fnr);
    const personOppgaveList = data || [];
    yield put(actions.hentPersonOppgaverHentet(personOppgaveList));
  } catch (e) {
    yield put(actions.hentPersonOppgaverFeilet());
  }
}

export const skalHentePersonOppgaver = (state: any) => {
  const reducer = state.personoppgaver;
  return !(reducer.henter || reducer.hentingForsokt);
};

export function* hentPersonOppgaverHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHentePersonOppgaver);
  if (skalHente) {
    yield hentPersonOppgaver(action);
  }
}

function* watchHentPersonOppgaver() {
  yield takeEvery(
    actions.HENT_PERSONOPPGAVER_FORESPURT,
    hentPersonOppgaverHvisIkkeHentet
  );
}

export function* behandlePersonOppgave(action: any) {
  const uuid = action.uuid;
  const referanseUuid = action.referanseUuid;
  const veilederIdent = action.veilederIdent;
  yield put(actions.behandlePersonOppgaveBehandler());
  try {
    const path = `/ispersonoppgave/api/v1/personoppgave/${uuid}/behandle`;
    yield call(post, path);
    yield put(
      actions.behandlePersonOppgaveBehandlet(uuid, referanseUuid, veilederIdent)
    );
  } catch (e) {
    if (e.message === "409") {
      window.location.reload();
      return;
    }
    yield put(actions.behandlePersonOppgaveFeilet());
  }
}

function* watchBehandlePersonOppgave() {
  yield takeEvery(
    actions.BEHANDLE_PERSONOPPGAVE_FORESPURT,
    behandlePersonOppgave
  );
}

export default function* personOppgaveSagas() {
  yield all([fork(watchHentPersonOppgaver), fork(watchBehandlePersonOppgave)]);
}
