import { all } from "redux-saga/effects";
import ledereSagas from "./leder/ledereSagas";
import navbrukerSagas from "./navbruker/navbrukerSagas";
import moterSagas from "./mote/moterSagas";
import motebehovSagas from "./motebehov/motebehovSagas";
import epostinnholdSagas from "./mote/epostinnholdSagas";
import sykmeldingerSagas from "./sykmelding/sykmeldingerSagas";
import modiacontextSagas from "./modiacontext/modiacontextSagas";
import historikkSagas from "./historikk/historikkSagas";
import oppfolgingstilfellePersonSagas from "./oppfolgingstilfelle/oppfolgingstilfellePersonSagas";
import oppfolgingstilfelleperioderSagas from "./oppfolgingstilfelle/oppfolgingstilfelleperioderSagas";
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
    historikkSagas(),
    oppfolgingstilfellePersonSagas(),
    oppfolgingstilfelleperioderSagas(),
    flaggPersonSagas(),
    unleashSagas(),
  ]);
}
