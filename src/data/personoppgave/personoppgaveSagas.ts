import { call, put, select, takeEvery } from "redux-saga/effects";
import { get, post } from "@/api/axios";
import * as actions from "./personoppgave_actions";
import { PersonOppgave } from "./types/PersonOppgave";
import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";
import { ApiErrorException } from "@/api/errors";

export const skalHentePersonOppgaver = (state: any) => {
  const reducer = state.personoppgaver;
  return !(reducer.henter || reducer.hentingForsokt);
};

export function* hentPersonOppgaverHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHentePersonOppgaver);
  if (skalHente) {
    yield put(actions.hentPersonOppgaverHenter());
    const path = `${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`;
    try {
      const data: PersonOppgave[] = yield call(get, path, action.fnr);
      yield put(actions.hentPersonOppgaverHentet(data || []));
    } catch (e) {
      //TODO: Add error to reducer and errorboundary to components
      yield put(actions.hentPersonOppgaverFeilet());
    }
  }
}

export function* behandlePersonOppgave(action: any) {
  const uuid = action.uuid;
  const referanseUuid = action.referanseUuid;
  const veilederIdent = action.veilederIdent;
  yield put(actions.behandlePersonOppgaveBehandler());

  const path = `${ISPERSONOPPGAVE_ROOT}/personoppgave/${uuid}/behandle`;
  try {
    yield call(post, path, []);
    yield put(
      actions.behandlePersonOppgaveBehandlet(uuid, referanseUuid, veilederIdent)
    );
  } catch (e) {
    //TODO: Add error to reducer and errorboundary to components
    if (e instanceof ApiErrorException && e.code === 409) {
      window.location.reload();
      return;
    }
    yield put(actions.behandlePersonOppgaveFeilet());
  }
}

export default function* personOppgaveSagas() {
  yield takeEvery(
    actions.BEHANDLE_PERSONOPPGAVE_FORESPURT,
    behandlePersonOppgave
  );
  yield takeEvery(
    actions.HENT_PERSONOPPGAVER_FORESPURT,
    hentPersonOppgaverHvisIkkeHentet
  );
}
