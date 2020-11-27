import { call, put, fork, takeEvery, all } from "redux-saga/effects";
import { get, post } from "../api";
import * as actions from "../actions/modiacontext_actions";
import {
  PUSH_MODIACONTEXT_FORESPURT,
  HENT_AKTIVBRUKER_FORESPURT,
  HENT_AKTIVENHET_FORESPURT,
} from "../actions/actiontyper";

export function* pushModiacontextSaga(action) {
  yield put(actions.pusherModiaContext());
  try {
    const path = `${process.env.REACT_APP_CONTEXTHOLDER_ROOT}/context`;
    yield call(post, path, {
      verdi: action.data.verdi,
      eventType: action.data.eventType,
    });
    yield put(actions.modiaContextPushet(action.data));
  } catch (e) {
    yield put(actions.pushModiaContextFeilet());
  }
}

export function* aktivBrukerSaga(action) {
  yield put(actions.henterAktivBruker());
  try {
    const path = `${process.env.REACT_APP_CONTEXTHOLDER_ROOT}/context/aktivbruker`;
    const data = yield call(get, path);
    action.data.callback(data.aktivBruker);
  } catch (e) {
    yield put(actions.hentAktivBrukerFeilet());
  }
}

export function* aktivEnhetSaga(action) {
  yield put(actions.henterAktivEnhet());
  try {
    const path = `${process.env.REACT_APP_CONTEXTHOLDER_ROOT}/context/aktivenhet`;
    const data = yield call(get, path);
    action.data.callback(data.aktivEnhet);
  } catch (e) {
    yield put(actions.hentAktivEnhetFeilet());
  }
}

function* watchPushModiacontext() {
  yield takeEvery(PUSH_MODIACONTEXT_FORESPURT, pushModiacontextSaga);
}

function* watchAktivBruker() {
  yield takeEvery(HENT_AKTIVBRUKER_FORESPURT, aktivBrukerSaga);
}

function* watchAktivEnhet() {
  yield takeEvery(HENT_AKTIVENHET_FORESPURT, aktivEnhetSaga);
}

export default function* modiacontextSagas() {
  yield all([
    fork(watchPushModiacontext),
    fork(watchAktivBruker),
    fork(watchAktivEnhet),
  ]);
}
