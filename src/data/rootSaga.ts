import { all } from "redux-saga/effects";
import ledereSagas from "./leder/ledereSagas";
import navbrukerSagas from "./navbruker/navbrukerSagas";
import moterSagas from "./mote/moterSagas";
import motebehovSagas from "./motebehov/motebehovSagas";
import epostinnholdSagas from "./mote/epostinnholdSagas";
import sykmeldingerSagas from "./sykmelding/sykmeldingerSagas";
import oppfoelgingsdialogerSagas from "./oppfolgingsplan/oppfoelgingsdialogerSagas";
import oppfolgingsplanerLPSSagas from "./oppfolgingsplan/oppfolgingsplanerLPSSagas";
import modiacontextSagas from "./modiacontext/modiacontextSagas";
import historikkSagas from "./historikk/historikkSagas";
import dokumentInfoSagas from "./oppfolgingsplan/dokumentInfoSagas";
import oppfolgingstilfellePersonSagas from "./oppfolgingstilfelle/oppfolgingstilfellePersonSagas";
import oppfolgingstilfelleperioderSagas from "./oppfolgingstilfelle/oppfolgingstilfelleperioderSagas";
import personoppgaveSagas from "./personoppgave/personoppgaveSagas";
import flaggPersonSagas from "./pengestopp/flaggPersonSagas";
import unleashSagas from "./unleash/unleashSagas";

export default function* rootSaga() {
  yield all([
    ledereSagas(),
    navbrukerSagas(),
    moterSagas(),
    motebehovSagas(),
    epostinnholdSagas(),
    modiacontextSagas(),
    sykmeldingerSagas(),
    oppfoelgingsdialogerSagas(),
    oppfolgingsplanerLPSSagas(),
    historikkSagas(),
    dokumentInfoSagas(),
    oppfolgingstilfellePersonSagas(),
    oppfolgingstilfelleperioderSagas(),
    personoppgaveSagas(),
    flaggPersonSagas(),
    unleashSagas(),
  ]);
}
