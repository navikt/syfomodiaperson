import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get, post } from "../api";
import * as actions from "../actions/flaggperson_actions";
import { stoppAutomatikk2StatusEndring } from "../utils/pengestoppUtils";
import { FlaggpersonState } from "../reducers/flaggperson";

export function* hentStatus(action: any) {
  yield put(actions.henterStatus());
  try {
    const path = `${process.env.REACT_APP_ISPENGESTOPP_ROOT}/v1/person/status?fnr=${action.fnr}`;
    const data = yield call(get, path);

    if (data && !!data.err) {
      yield put(actions.hentStatusFeilet());
    } else {
      const statuses = data ? data : [];

      yield put(actions.statusHentet(statuses, action.fnr));
    }
  } catch (e) {
    yield put(actions.hentStatusFeilet());
  }
}

export const skalHenteStatus = (state: { flaggperson: any }) => {
  const reducer = state.flaggperson;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export function* hentStatusHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHenteStatus);
  if (skalHente) {
    yield hentStatus(action);
  }
}

function* watchHentStatus() {
  yield takeEvery(actions.HENT_STATUS_FORESPURT, hentStatusHvisIkkeHentet);
}

export const skalEndreStatus = (state: { flaggperson: FlaggpersonState }) => {
  const reducer = state.flaggperson;
  return !(reducer.endrer || reducer.endret);
};

export function* endreStatusHvisIkkeEndret(action: any) {
  const skalEndre = yield select(skalEndreStatus);
  if (skalEndre) {
    yield endreStatus(action);
  }
}

export function* endreStatus(action: any) {
  yield put(actions.endrerStatus());
  try {
    const path = `${process.env.REACT_APP_ISPENGESTOPP_ROOT}/v1/person/flagg`;

    yield call(post, path, action.stoppAutomatikk);
    yield put(actions.statusEndret());
    yield put(
      actions.statusHentet(
        stoppAutomatikk2StatusEndring(action.stoppAutomatikk),
        action.fnr
      )
    );
  } catch (e) {
    yield put(actions.endreStatusFeilet());
  }
}

function* watchEndreStatus() {
  yield takeEvery(actions.ENDRE_STATUS_FORESPURT, endreStatusHvisIkkeEndret);
}

export default function* flaggPersonSagas() {
  yield all([fork(watchEndreStatus), fork(watchHentStatus)]);
}
