import { call, put, select, takeEvery } from "redux-saga/effects";
import { get, post } from "@/api/axios";
import * as actions from "./moter_actions";
import * as historikkActions from "../historikk/historikk_actions";
import { MoteDTO } from "./types/moteTypes";
import { SYFOMOTEADMIN_ROOT } from "@/apiConstants";
import { ApiErrorException } from "@/api/errors";

export function* opprettMote(action: any) {
  yield put(actions.oppretterMote());

  const path = `${SYFOMOTEADMIN_ROOT}/moter`;
  try {
    yield call(post, path, action.data);
    yield put(actions.moteOpprettet(action.data));
    yield put(actions.hentMoter(action.data.fnr));
    yield put(historikkActions.hentHistorikkMoter(action.data.fnr));
  } catch (e) {
    //TODO: Add error to reducer and errorboundary to components
    yield put(actions.opprettMoteFeilet());
  }
}

export function* hentMoter(action: any) {
  yield put(actions.henterMoter());
  const path = `${SYFOMOTEADMIN_ROOT}/moter?fnr=${action.fnr}&henttpsdata=true&limit=1`;
  try {
    const data: MoteDTO[] = yield call(get, path);
    yield put(actions.moterHentet(data));
  } catch (e) {
    //TODO: Add error to reducer and errorboundary to components
    if (e instanceof ApiErrorException && e.code === 403) {
      yield put(
        actions.hentMoterIkkeTilgang({
          harTilgang: false,
          begrunnelse: e.error.message,
        })
      );
      return;
    }
    yield put(actions.hentMoterFeilet());
  }
}

export const skalHenteMoter = (state: any) => {
  const reducer = state.moter;
  return !reducer.henter && !reducer.hentingForsokt;
};

export function* hentMoterHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHenteMoter);
  if (skalHente) {
    yield call(hentMoter, action);
  }
}

export function* avbrytMote(action: any) {
  yield put(actions.avbryterMote(action.uuid));

  const path = `${SYFOMOTEADMIN_ROOT}/moter/${action.uuid}/avbryt?varsle=${action.varsle}`;
  try {
    yield call(post, path, []);
    yield put(actions.moteAvbrutt(action.uuid));
    yield put(historikkActions.hentHistorikkMoter(action.fnr));
    window.location.href = `/sykefravaer/moteoversikt`;
  } catch (e) {
    //TODO: Add error to reducer and errorboundary to components
    yield put(actions.avbrytMoteFeilet());
  }
}

export function* bekreftMote(action: any) {
  yield put(actions.bekrefterMote());
  const path = `${SYFOMOTEADMIN_ROOT}/moter/${action.moteUuid}/bekreft?valgtAlternativId=${action.valgtAlternativId}`;

  try {
    yield call(post, path, []);
    yield put(
      actions.moteBekreftet(
        action.moteUuid,
        action.valgtAlternativId,
        new Date()
      )
    );
    yield put(historikkActions.hentHistorikkMoter(action.fnr));
  } catch (e) {
    //TODO: Add error to reducer and errorboundary to components
    yield put(actions.bekreftMoteFeilet());
  }
}

export function* opprettFlereAlternativ(action: any) {
  yield put(actions.oppretterFlereAlternativ());

  const path = `${SYFOMOTEADMIN_ROOT}/moter/${action.moteUuid}/nyealternativer`;
  try {
    yield call(post, path, action.data);
    yield put(historikkActions.hentHistorikkMoter(action.fnr));
    yield put(
      actions.opprettFlereAlternativBekreftet(action.data, action.moteUuid)
    );
  } catch (e) {
    //TODO: Add error to reducer and errorboundary to components
    yield put(actions.opprettFlereAlternativFeilet());
  }
}

export default function* moterSagas() {
  yield takeEvery(
    actions.OPPRETT_FLERE_ALTERNATIV_FORESPURT,
    opprettFlereAlternativ
  );
  yield takeEvery(actions.OPPRETT_MOTE_FORESPURT, opprettMote);
  yield takeEvery(actions.AVBRYT_MOTE_FORESPURT, avbrytMote);
  yield takeEvery(actions.BEKREFT_MOTE_FORESPURT, bekreftMote);
  yield takeEvery(actions.HENT_MOTER_FORESPURT, hentMoterHvisIkkeHentet);
  yield takeEvery(actions.MOTE_OPPRETTET, hentMoter);
}
