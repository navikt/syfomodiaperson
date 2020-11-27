import { call, put, fork, takeEvery, all } from "redux-saga/effects";
import { log } from "@navikt/digisyfo-npm";
import { get } from "../api";
import * as actions from "../actions/epostinnhold_actions";
import * as arbeidsgiveractions from "../actions/arbeidsgiverepostinnhold_actions";
import { HENT_BEKREFT_MOTE_ARBEIDSGIVEREPOSTINNHOLD_FORESPURT } from "../actions/actiontyper";

export function* hentBekreftMoteEpostinnhold(action) {
  yield put(actions.henterEpostInnhold());
  try {
    const path = `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/internad/epostinnhold/BEKREFTET?motedeltakeruuid=${action.motedeltakerUuid}&valgtAlternativId=${action.valgtAlternativId}`;
    const data = yield call(get, path);
    yield put(actions.epostInnholdHentet("BEKREFT_TIDSPUNKT", data));
  } catch (e) {
    log(e);
    yield put(actions.hentEpostinnholdFeilet());
  }
}

export function* hentBekreftMoteArbeidsgiverEpostinnhold(action) {
  yield put(arbeidsgiveractions.henterArbeidstakerEpostInnhold());
  try {
    const path = `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/internad/epostinnhold/BEKREFTET?motedeltakeruuid=${action.motedeltakerUuid}&valgtAlternativId=${action.valgtAlternativId}`;
    const data = yield call(get, path);
    yield put(
      arbeidsgiveractions.arbeidsgiverEpostInnholdHentet(
        "BEKREFT_TIDSPUNKT",
        data
      )
    );
  } catch (e) {
    log(e);
    yield put(arbeidsgiveractions.hentArbeidsgiverEpostinnholdFeilet());
  }
}

export function* hentAvbrytMoteEpostinnhold(action) {
  yield put(actions.henterEpostInnhold());
  try {
    const path = `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/internad/epostinnhold/AVBRUTT?motedeltakeruuid=${action.motedeltakerUuid}`;
    const data = yield call(get, path);
    yield put(actions.epostInnholdHentet("AVBRYT_TIDSPUNKT", data));
  } catch (e) {
    log(e);
    yield put(actions.hentEpostinnholdFeilet());
  }
}

function* watchHentBekreftMoteEpostinnhold() {
  yield takeEvery(
    actions.HENT_BEKREFT_MOTE_EPOSTINNHOLD_FORESPURT,
    hentBekreftMoteEpostinnhold
  );
}

function* watchHentBekreftMoteArbeidsgiverEpostinnhold() {
  yield takeEvery(
    HENT_BEKREFT_MOTE_ARBEIDSGIVEREPOSTINNHOLD_FORESPURT,
    hentBekreftMoteArbeidsgiverEpostinnhold
  );
}

function* watchHentAvbrytMoteEpostinnhold() {
  yield takeEvery(
    actions.HENT_AVBRYT_MOTE_EPOSTINNHOLD_FORESPURT,
    hentAvbrytMoteEpostinnhold
  );
}

export default function* epostinnholdSagas() {
  yield all([
    fork(watchHentBekreftMoteEpostinnhold),
    fork(watchHentAvbrytMoteEpostinnhold),
    fork(watchHentAvbrytMoteEpostinnhold),
    fork(watchHentBekreftMoteArbeidsgiverEpostinnhold),
  ]);
}
