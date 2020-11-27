import { call, put, fork, takeEvery } from "redux-saga/effects";
import { setLedetekster, log } from "@navikt/digisyfo-npm";
import { get } from "../api";
import * as actions from "../actions/ledetekster_actions";

export function* hentLedetekster() {
  yield put(actions.henterLedetekster());
  try {
    const path = `${process.env.REACT_APP_TEKSTER_REST_ROOT}/tekster`;
    const ledetekster = yield call(get, path);
    setLedetekster(ledetekster);
    yield put(actions.ledeteksterHentet(ledetekster));
  } catch (e) {
    log(e);
    yield put(actions.hentLedeteksterFeilet());
  }
}

function* watchHentLedetekster() {
  yield takeEvery(actions.HENT_LEDETEKSTER_FORESPURT, hentLedetekster);
}

export default function* ledeteksterSagas() {
  yield fork(watchHentLedetekster);
}
