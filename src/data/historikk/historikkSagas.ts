import { call, put, takeEvery } from "redux-saga/effects";
import { get } from "@/api/axios";
import { HistorikkEvent } from "./types/historikkTypes";
import { SYFOMOTEADMIN_ROOT } from "@/apiConstants";
import {
  henterHistorikkMoter,
  HentHistorikkMoterAction,
  hentHistorikkMoterFeilet,
  HistorikkMoterActionTypes,
  historikkMoterHentet,
} from "./historikk_actions";

export function* hentHistorikkMoter(action: HentHistorikkMoterAction) {
  yield put(henterHistorikkMoter());

  const path = `${SYFOMOTEADMIN_ROOT}/historikk?fnr=${action.fnr}`;
  try {
    const data: HistorikkEvent[] = yield call(get, path);
    yield put(historikkMoterHentet(data));
  } catch (e) {
    //TODO: Add error to reducer and errorboundary to components
    yield put(hentHistorikkMoterFeilet());
  }
}

export default function* historikkSagas() {
  yield takeEvery(
    HistorikkMoterActionTypes.HENT_HISTORIKK_MOTER,
    hentHistorikkMoter
  );
}
