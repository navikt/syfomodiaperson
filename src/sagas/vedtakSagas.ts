import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get } from "../api";
import * as actions from "../actions/vedtak_actions";
import { VedtakState } from "../reducers/vedtak";

export function* hentVedtak(action: any) {
  yield put(actions.hentVedtakHenter());
  try {
    const path = `${process.env.REACT_APP_VEDTAK_ROOT}?fnr=${action.fnr}`;
    const data = yield call(get, path);

    if (data && !!data.err) {
      yield put(actions.hentVedtakFeilet());
    } else {
      const vedtakdata = data ? data : {};

      yield put(actions.hentVedtakHentet(vedtakdata, action.fnr));
    }
  } catch (e) {
    yield put(actions.hentVedtakFeilet());
  }
}

export const skalHenteVedtak = (state: { vedtak: VedtakState }) => {
  const reducer = state.vedtak;
  return !(reducer.henter || reducer.hentingForsokt);
};

export function* hentVedtakHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHenteVedtak);
  if (skalHente) {
    yield hentVedtak(action);
  }
}

function* watchHentVedtak() {
  yield takeEvery(actions.HENT_VEDTAK_FORESPURT, hentVedtakHvisIkkeHentet);
}

export default function* vedtakSagas() {
  yield all([fork(watchHentVedtak)]);
}
