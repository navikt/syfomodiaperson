import { call, put, select, takeLeading } from "redux-saga/effects";
import { get } from "@/api/axios";
import { SykmeldingNewFormatDTO } from "./types/SykmeldingNewFormatDTO";
import { RootState } from "../rootState";
import { SYFOSMREGISTER_ROOT } from "@/apiConstants";
import {
  hentSykmeldingerFeilet,
  hentSykmeldingerHenter,
  SykmeldingerActionTypes,
  sykmeldingerHentet,
} from "./sykmeldinger_actions";
import { ApiErrorException, generalError, getErrorMessage } from "@/api/errors";

export const skalHenteSykmeldinger = (state: RootState) => {
  const reducer = state.sykmeldinger;
  return !(reducer.henter || reducer.hentet || reducer.error);
};

export function* hentSykmeldingerHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHenteSykmeldinger);
  if (skalHente) {
    yield put(hentSykmeldingerHenter());

    const path = `${SYFOSMREGISTER_ROOT}/internal/sykmeldinger`;
    try {
      const data: SykmeldingNewFormatDTO[] = yield call(get, path, action.fnr);
      yield put(sykmeldingerHentet(data, action.fnr));
    } catch (e) {
      if (e instanceof ApiErrorException) {
        yield put(hentSykmeldingerFeilet(e.error));
      } else {
        yield put(hentSykmeldingerFeilet(generalError(getErrorMessage(e))));
      }
    }
  }
}

export default function* sykmeldingerSagas() {
  yield takeLeading(
    SykmeldingerActionTypes.HENT_SYKMELDINGER_FORESPURT,
    hentSykmeldingerHvisIkkeHentet
  );
}
