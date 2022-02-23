import { all } from "redux-saga/effects";
import ledereSagas from "./leder/ledereSagas";
import navbrukerSagas from "./navbruker/navbrukerSagas";
import moterSagas from "./mote/moterSagas";
import epostinnholdSagas from "./mote/epostinnholdSagas";
import sykmeldingerSagas from "./sykmelding/sykmeldingerSagas";
import modiacontextSagas from "./modiacontext/modiacontextSagas";
import historikkSagas from "./historikk/historikkSagas";
import flaggPersonSagas from "./pengestopp/flaggPersonSagas";
import unleashSagas from "./unleash/unleashSagas";

export default function* rootSaga() {
  yield all([
    ledereSagas(),
    navbrukerSagas(),
    moterSagas(),
    epostinnholdSagas(),
    modiacontextSagas(),
    sykmeldingerSagas(),
    historikkSagas(),
    flaggPersonSagas(),
    unleashSagas(),
  ]);
}
