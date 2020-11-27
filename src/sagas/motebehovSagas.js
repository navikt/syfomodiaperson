import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { log } from "@navikt/digisyfo-npm";
import { get, post } from "../api";
import * as actions from "../actions/motebehov_actions";
import * as behandleActions from "../actions/behandlemotebehov_actions";

export function* hentMotebehov(action) {
  const fnr = action.fnr ? action.fnr : "";
  yield put(actions.henterMotebehov());
  try {
    const path = `${process.env.REACT_APP_SYFOMOTEBEHOV_ROOT}/internad/veileder/motebehov?fnr=${fnr}`;
    const data = yield call(get, path);
    yield put(actions.motebehovHentet(data));
  } catch (e) {
    if (e.status === 403) {
      yield put(actions.hentMotebehovIkkeTilgang(e.tilgang));
      return;
    }
    log(e);
    yield put(actions.hentMotebehovFeilet());
  }
}

export const skalHenteMotebehov = (state) => {
  const reducer = state.motebehov;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export function* hentMotebehovHvisIkkeHentet(action) {
  const skalHente = yield select(skalHenteMotebehov);
  if (skalHente) {
    yield hentMotebehov(action);
  }
}

export function* behandleMotebehov(action) {
  const fnr = action.fnr;
  yield put(behandleActions.behandleMotebehovBehandler());
  try {
    const path = `${process.env.REACT_APP_SYFOMOTEBEHOV_ROOT}/internad/veileder/motebehov/${fnr}/behandle`;
    yield call(post, path);
    yield put(behandleActions.behandleMotebehovBehandlet(action.veilederIdent));
  } catch (e) {
    if (e.status === 403) {
      yield put(behandleActions.behandleMotebehovForbudt());
      return;
    } else if (e.message === "409") {
      window.location.reload();
      return;
    }
    log(e);
    yield put(behandleActions.behandleMotebehovFeilet());
  }
}

function* watchHentMotebehov() {
  yield takeEvery(
    actions.HENT_MOTEBEHOV_FORESPURT,
    hentMotebehovHvisIkkeHentet
  );
}

function* watchbehandleMotebehov() {
  yield takeEvery(
    behandleActions.BEHANDLE_MOTEBEHOV_FORESPURT,
    behandleMotebehov
  );
}

export default function* motebehovSagas() {
  yield all([fork(watchHentMotebehov), fork(watchbehandleMotebehov)]);
}
