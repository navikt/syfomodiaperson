import { call, put, select, takeEvery } from "redux-saga/effects";
import * as actions from "./oppfolgingstilfellerperson_actions";
import { get } from "@/api/axios";
import { OppfolgingstilfellePerson } from "./types/OppfolgingstilfellePerson";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { SykmeldingerState } from "@/data/sykmelding/sykmeldinger";
import { RootState } from "@/data/rootState";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

export const harInnsendtSykmeldingUtenArbeidsgiver = (
  sykmeldinger: SykmeldingerState
) => {
  const erSykmeldingerHentet = sykmeldinger.hentet;
  if (erSykmeldingerHentet) {
    return (
      sykmeldinger.data.filter((sykmelding: SykmeldingOldFormat) => {
        return !sykmelding.mottakendeArbeidsgiver;
      }).length > 0
    );
  }
  return false;
};

export const skalHenteOppfolgingstilfelleperioder = (state: RootState) => {
  if (harInnsendtSykmeldingUtenArbeidsgiver(state.sykmeldinger)) {
    const reducer = state.oppfolgingstilfellerperson;
    return (!reducer.henter && !reducer.hentingForsokt) || false;
  } else {
    return false;
  }
};

export function* hentOppfolgingstilfellerPersonHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHenteOppfolgingstilfelleperioder);
  if (skalHente) {
    yield put(actions.hentOppfolgingstilfellerPersonUtenArbeidsiverHenter());

    const path = `${SYFOPERSON_ROOT}/person/oppfolgingstilfelle/utenarbeidsgiver`;
    try {
      const data: OppfolgingstilfellePerson[] = yield call(
        get,
        path,
        action.fnr
      );
      yield put(
        actions.hentOppfolgingstilfellerPersonUtenArbeidsiverHentet(data)
      );
    } catch (e) {
      //TODO: Add error to reducer and errorboundary to components
      yield put(actions.hentOppfolgingstilfellerPersonUtenArbeidsiverFeilet());
    }
  }
}

export default function* oppfolgingstilfellerPersonSagas() {
  yield takeEvery(
    actions.HENT_OPPFOLGINGSTILFELLER_PERSON_FORESPURT,
    hentOppfolgingstilfellerPersonHvisIkkeHentet
  );
}
