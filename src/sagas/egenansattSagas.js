import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get } from "../api";
import * as actions from "../actions/egenansatt_actions";

export function* hentEgenansattSaga(action) {
  yield put(actions.henterEgenansatt());
  try {
    const path = `${process.env.REACT_APP_SYFOPERSON_ROOT}/person/egenansatt/${action.fnr}`;
    const data = yield call(get, path);
    yield put(actions.egenansattHentet(data));
  } catch (e) {
    yield put(actions.hentEgenansattFeilet());
  }
}

export const skalHenteEgenansatt = (state) => {
  const reducer = state.egenansatt;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export function* hentEgenansattHvisIkkeHentet(action) {
  const skalHente = yield select(skalHenteEgenansatt);
  if (skalHente) {
    yield hentEgenansattSaga(action);
  }
}

function* watchHentEgenansatt() {
  yield takeEvery(
    actions.HENT_EGENANSATT_FORESPURT,
    hentEgenansattHvisIkkeHentet
  );
}

export default function* egenansattSagas() {
  yield fork(watchHentEgenansatt);
}
