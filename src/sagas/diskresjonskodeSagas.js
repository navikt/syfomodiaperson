import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get } from "../api";
import * as actions from "../actions/diskresjonskode_actions";

export function* hentDiskresjonskodeSaga(action) {
  yield put(actions.henterDiskresjonskode());
  try {
    const path = `${process.env.REACT_APP_SYFOPERSON_ROOT}/person/diskresjonskode/${action.fnr}`;
    const data = yield call(get, path);
    yield put(actions.diskresjonskodeHentet(data));
  } catch (e) {
    yield put(actions.hentDiskresjonskodeFeilet());
  }
}

export const skalHenteDiskresjonskode = (state) => {
  const reducer = state.diskresjonskode;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export function* hentDiskresjonskodeHvisIkkeHentet(action) {
  const skalHente = yield select(skalHenteDiskresjonskode);
  if (skalHente) {
    yield hentDiskresjonskodeSaga(action);
  }
}

function* watchHentDiskresjonskode() {
  yield takeEvery(
    actions.HENT_DISKRESJONSKODE_FORESPURT,
    hentDiskresjonskodeHvisIkkeHentet
  );
}

export default function* diskresjonskodeSagas() {
  yield fork(watchHentDiskresjonskode);
}
