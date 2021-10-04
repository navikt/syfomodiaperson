import { call, put, select, takeEvery } from "redux-saga/effects";
import { LedereState } from "../leder/ledere";
import { get } from "@/api/axios";
import { OppfolgingstilfellePersonArbeidsgiver } from "./types/OppfolgingstilfellePersonArbeidsgiver";
import { RootState } from "../rootState";
import {
  HentOppfolgingstilfelleperioderAction,
  hentOppfolgingstilfelleperioderFeilet,
  hentOppfolgingstilfelleperioderHenter,
  hentOppfolgingstilfelleperioderHentet,
  OppfolgingstilfelleperioderActionTypes,
} from "./oppfolgingstilfelleperioder_actions";
import { MODIASYFOREST_ROOT } from "@/apiConstants";

export function* hentOppfolgingstilfelleperioder(
  action: HentOppfolgingstilfelleperioderAction,
  orgnummer: string
) {
  yield put(hentOppfolgingstilfelleperioderHenter(orgnummer));

  const path = `${MODIASYFOREST_ROOT}/oppfolgingstilfelleperioder?fnr=${action.fnr}&orgnummer=${orgnummer}`;
  try {
    const data: OppfolgingstilfellePersonArbeidsgiver[] = yield call(get, path);
    yield put(hentOppfolgingstilfelleperioderHentet(data, orgnummer));
  } catch (e) {
    //TODO: Add error to reducer and errorboundary to components
    yield put(hentOppfolgingstilfelleperioderFeilet(orgnummer));
  }
}

export const hentLedereVirksomhetsnummerList = (ledere: LedereState) => {
  const erLedereHentet = ledere.hentet;
  if (erLedereHentet) {
    return ledere.currentLedere.map((leder) => {
      return leder.virksomhetsnummer;
    });
  }
  return [];
};

export const hentSykmeldingerVirksomhetsnummerList = (sykmeldinger: any) => {
  const erSykmeldingerHentet = sykmeldinger.hentet;
  if (erSykmeldingerHentet) {
    return sykmeldinger.data
      .filter((sykmelding: any) => {
        return sykmelding.mottakendeArbeidsgiver;
      })
      .map((sykmelding: any) => {
        return sykmelding.mottakendeArbeidsgiver.virksomhetsnummer;
      });
  }
  return [];
};

export const hentVirksomhetsnummerList = (state: RootState) => {
  const ledereVirksomhetNrList = hentLedereVirksomhetsnummerList(state.ledere);
  const sykmeldingerVirksomhetsNrList = hentSykmeldingerVirksomhetsnummerList(
    state.sykmeldinger
  );
  return [
    ...new Set([...sykmeldingerVirksomhetsNrList, ...ledereVirksomhetNrList]),
  ];
};

export const skalHenteOppfolgingstilfelleperioder = (
  state: any,
  orgnummer: string
) => {
  const reducer = state.oppfolgingstilfelleperioder[orgnummer] || {};
  return (!reducer.henter && !reducer.hentingForsokt) || false;
};

export function* hentOppfolgingstilfelleperioderHvisIkkeHentet(
  action: HentOppfolgingstilfelleperioderAction
) {
  const virksomhetsNrList = yield select(hentVirksomhetsnummerList);
  for (let i = 0; i < virksomhetsNrList.length; i++) {
    const skalHente = yield select(
      skalHenteOppfolgingstilfelleperioder,
      virksomhetsNrList[i]
    );
    if (skalHente) {
      yield call(hentOppfolgingstilfelleperioder, action, virksomhetsNrList[i]);
    }
  }
}

export default function* oppfolgingstilfelleperioderSagas() {
  yield takeEvery(
    OppfolgingstilfelleperioderActionTypes.HENT_OPPFOLGINGSTILFELLEPERIODER_FORESPURT,
    hentOppfolgingstilfelleperioderHvisIkkeHentet
  );
}
