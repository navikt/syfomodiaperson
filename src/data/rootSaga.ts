import { all } from "redux-saga/effects";
import ledereSagas from "./leder/ledereSagas";
import fastlegerSagas from "./fastlege/fastlegerSagas";
import navbrukerSagas from "./navbruker/navbrukerSagas";
import moterSagas from "./mote/moterSagas";
import motebehovSagas from "./motebehov/motebehovSagas";
import epostinnholdSagas from "./mote/epostinnholdSagas";
import sykmeldingerSagas from "./sykmelding/sykmeldingerSagas";
import oppfoelgingsdialogerSagas from "./oppfolgingsplan/oppfoelgingsdialogerSagas";
import oppfolgingsplanerLPSSagas from "./oppfolgingsplan/oppfolgingsplanerLPSSagas";
import modiacontextSagas from "./modiacontext/modiacontextSagas";
import historikkSagas from "./historikk/historikkSagas";
import behandlendeEnhetSagas from "./behandlendeenhet/behandlendeEnhetSagas";
import dokumentInfoSagas from "./oppfolgingsplan/dokumentInfoSagas";
import diskresjonskodeSagas from "./diskresjonskode/diskresjonskodeSagas";
import tilgangSagas from "./tilgang/tilgangSagas";
import soknaderSagas from "./sykepengesoknad/soknaderSagas";
import oppfolgingstilfellePersonSagas from "./oppfolgingstilfelle/oppfolgingstilfellePersonSagas";
import oppfolgingstilfelleperioderSagas from "./oppfolgingstilfelle/oppfolgingstilfelleperioderSagas";
import personInfoSagas from "./personinfo/personInfoSagas";
import personoppgaveSagas from "./personoppgave/personoppgaveSagas";
import flaggPersonSagas from "./pengestopp/flaggPersonSagas";
import dialogmoteSagas from "./dialogmote/dialogmoteSagas";
import unleashSagas from "./unleash/unleashSagas";

export default function* rootSaga() {
  yield all([
    ledereSagas(),
    fastlegerSagas(),
    navbrukerSagas(),
    moterSagas(),
    motebehovSagas(),
    epostinnholdSagas(),
    modiacontextSagas(),
    sykmeldingerSagas(),
    oppfoelgingsdialogerSagas(),
    oppfolgingsplanerLPSSagas(),
    historikkSagas(),
    behandlendeEnhetSagas(),
    dokumentInfoSagas(),
    diskresjonskodeSagas(),
    tilgangSagas(),
    soknaderSagas(),
    oppfolgingstilfellePersonSagas(),
    oppfolgingstilfelleperioderSagas(),
    personInfoSagas(),
    personoppgaveSagas(),
    flaggPersonSagas(),
    dialogmoteSagas(),
    unleashSagas(),
  ]);
}
