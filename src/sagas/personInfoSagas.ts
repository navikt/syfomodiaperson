import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get } from "../api";
import * as actions from "../actions/personInfo_actions";

export function* hentPersonAdresse(action: any) {
  yield put(actions.hentPersonAdresseHenter());
  try {
    const path = `${process.env.REACT_APP_SYFOPERSON_ROOT}/person/adresse`;
    const data = yield call(get, path, action.fnr);
    yield put(actions.hentPersonAdresseHentet(data));
  } catch (e) {
    yield put(actions.hentPersonAdresseFeilet());
  }
}

export const skalHentePersonAdresse = (state: any) => {
  const reducer = state.personadresse;
  return !(reducer.henter || reducer.hentingForsokt);
};

export function* hentPersonAdresseHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHentePersonAdresse);
  if (skalHente) {
    yield hentPersonAdresse(action);
  }
}

function* watchHentPersonAdresse() {
  yield takeEvery(
    actions.HENT_PERSON_ADRESSE_FORESPURT,
    hentPersonAdresseHvisIkkeHentet
  );
}

export default function* personAdresseSagas() {
  yield all([fork(watchHentPersonAdresse)]);
}
