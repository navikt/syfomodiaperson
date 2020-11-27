import { call, put, fork, all, takeEvery } from "redux-saga/effects";
import { get } from "../api";
import * as actions from "../actions/veilederinfo_actions";

export function* hentVeilederinfoSaga() {
  yield put(actions.henterVeilederinfo());
  try {
    const path = `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/internad/veilederinfo`;
    const data = yield call(get, path);
    yield put(actions.veilederinfoHentet(data));
  } catch (e) {
    yield put(actions.hentVeilederinfoFeilet());
  }
}

function* watchHentVeilederinfo() {
  yield takeEvery(actions.HENT_VEILEDERINFO_FORESPURT, hentVeilederinfoSaga);
}

export default function* veilederinfoSagas() {
  yield all([fork(watchHentVeilederinfo)]);
}
