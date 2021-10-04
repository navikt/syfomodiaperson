import { call, put, select, takeEvery } from "redux-saga/effects";
import { get } from "@/api/axios";
import * as actions from "./ledere_actions";
import { HentLedereAction } from "./ledere_actions";
import { RootState } from "../rootState";
import { NarmesteLederRelasjonDTO } from "./ledere";
import { ISNARMESTELEDER_ROOT } from "@/apiConstants";

export const skalHenteLedere = (state: RootState) => {
  const reducer = state.ledere;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export const ISNARMESTELEDER_NARMESTELEDERRELASJON_PERSONIDENT_PATH =
  "/narmestelederrelasjon/personident";

export function* hentLedereHvisIkkeHentet(action: HentLedereAction) {
  const skalHente = yield select(skalHenteLedere);
  if (skalHente) {
    yield put(actions.henterLedere());

    const path = `${ISNARMESTELEDER_ROOT}${ISNARMESTELEDER_NARMESTELEDERRELASJON_PERSONIDENT_PATH}`;
    try {
      const data: NarmesteLederRelasjonDTO[] = yield call(
        get,
        path,
        action.fnr
      );
      yield put(actions.ledereHentet(data));
    } catch (e) {
      //TODO: Add error to reducer and errorboundary to components
      yield put(actions.hentLedereFailed());
    }
  }
}

export default function* ledereSagas() {
  yield takeEvery(actions.HENT_LEDERE_FORESPURT, hentLedereHvisIkkeHentet);
}
