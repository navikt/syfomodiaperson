import { call, put, fork, takeEvery } from "redux-saga/effects";
import { log } from "@navikt/digisyfo-npm";
import { get } from "../api";
import * as actions from "../actions/historikk_actions";

export function* hentHistorikkOppfoelgingsdialog(action) {
  yield put(actions.henterHistorikk("OPPFOELGINGSDIALOG"));
  try {
    const path = `${process.env.REACT_APP_OPPFOLGINGSPLANREST_ROOT}/internad/v1/oppfolgingsplan/${action.fnr}/historikk`;
    const data = yield call(get, path);
    yield put(actions.historikkHentet(data, "OPPFOELGINGSDIALOG"));
  } catch (e) {
    log(e);
    yield put(actions.hentHistorikkFeilet("OPPFOELGINGSDIALOG"));
  }
}

export function* hentHistorikkMoter(action) {
  yield put(actions.henterHistorikk("MOTER"));
  try {
    const path = `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/internad/historikk?fnr=${action.fnr}`;
    const data = yield call(get, path);
    yield put(actions.historikkHentet(data, "MOTER"));
  } catch (e) {
    log(e);
    yield put(actions.hentHistorikkFeilet("MOTER"));
  }
}

export function* hentHistorikkMotebehov(action) {
  yield put(actions.henterHistorikk("MOTEBEHOV"));
  try {
    const path = `${process.env.REACT_APP_SYFOMOTEBEHOV_ROOT}/internad/veileder/historikk?fnr=${action.fnr}`;
    const data = yield call(get, path);
    yield put(actions.historikkHentet(data, "MOTEBEHOV"));
  } catch (e) {
    log(e);
    yield put(actions.hentHistorikkFeilet("MOTEBEHOV"));
  }
}

function* watchHentHistorikkOppfoelgingsdialog() {
  yield takeEvery(
    "HENT_HISTORIKK_OPPFOELGINGSDIALOG_FORESPURT",
    hentHistorikkOppfoelgingsdialog
  );
}

function* watchHentHistorikkMoter() {
  yield takeEvery("HENT_HISTORIKK_MOTER_FORESPURT", hentHistorikkMoter);
}

function* watchHentHistorikkMotebehov() {
  yield takeEvery("HENT_HISTORIKK_MOTEBEHOV_FORESPURT", hentHistorikkMotebehov);
}

export default function* historikkSagas() {
  yield fork(watchHentHistorikkOppfoelgingsdialog);
  yield fork(watchHentHistorikkMoter);
  yield fork(watchHentHistorikkMotebehov);
}
