import { call, put, fork, takeEvery } from 'redux-saga/effects';
import { get } from '../api/index';
import * as actions from '../actions/fastleger_actions';
import * as actiontyper from '../actions/actiontyper';

export function* hentFastleger(action) {
    yield put(actions.henterFastleger());
    try {
        const data = yield call(get, `${window.APP_SETTINGS.FASTLEGEREST_ROOT}/fastlege/v1/fastleger?fnr=${action.fnr}`);
        yield put(actions.fastlegerHentet(data));
    } catch (e) {
        yield put(actions.hentFastlegerFeilet());
    }
}

function* watchHentFastleger() {
    yield takeEvery(actiontyper.HENT_FASTLEGER_FORESPURT, hentFastleger);
}

export default function* fastlegerSagas() {
    yield fork(watchHentFastleger);
}
