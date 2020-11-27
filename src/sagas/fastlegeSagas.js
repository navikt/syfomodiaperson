import { call, put, fork, takeEvery } from "redux-saga/effects";
import { get } from "../api";
import * as actions from "../actions/fastlege_actions";
import * as actiontyper from "../actions/actiontyper";

export function* hentFastleger(action) {
  yield put(actions.henterFastleger());
  try {
    const path = `${process.env.REACT_APP_FASTLEGEREST_ROOT}/internad/fastlege/v1/fastleger?fnr=${action.fnr}`;
    const data = yield call(get, path);
    yield put(actions.fastlegerHentet(data));
  } catch (e) {
    if (e.message === "404") {
      yield put(actions.fastlegerIkkeFunnet());
      return;
    }
    yield put(actions.hentFastlegerFeilet());
  }
}

function* watchHentFastleger() {
  yield takeEvery(actiontyper.HENT_FASTLEGER_FORESPURT, hentFastleger);
}

export default function* fastlegerSagas() {
  yield fork(watchHentFastleger);
}
