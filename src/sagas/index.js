import { tidslinjerSagas } from "@navikt/digisyfo-npm";
import { all } from "redux-saga/effects";
import ledereSagas from "./ledereSagas";
import fastlegerSagas from "./fastlegerSagas";
import navbrukerSagas from "./navbrukerSagas";
import moterSagas from "./moterSagas";
import motebehovSagas from "./motebehovSagas";
import epostinnholdSagas from "./epostinnholdSagas";
import sykmeldingerSagas from "./sykmeldingerSagas";
import oppfoelgingsdialogerSagas from "./oppfoelgingsdialogerSagas";
import oppfolgingsplanerLPSSagas from "./oppfolgingsplanerLPSSagas";
import modiacontextSagas from "./modiacontextSagas";
import historikkSagas from "./historikkSagas";
import behandlendeEnhetSagas from "./behandlendeEnhetSagas";
import dokumentInfoSagas from "./dokumentInfoSagas";
import virksomhetSagas from "./virksomhetSagas";
import veilederinfoSagas from "./veilederinfoSagas";
import diskresjonskodeSagas from "./diskresjonskodeSagas";
import egenansattSagas from "./egenansattSagas";
import ledeteksterSagas from "./ledeteksterSagas";
import tilgangSagas from "./tilgangSagas";
import soknaderSagas from "./soknaderSagas";
import oppfolgingstilfelleperioderSagas from "./oppfolgingstilfelleperioderSagas";
import personInfoSagas from "./personInfoSagas";
import personoppgaveSagas from "./personoppgaveSagas";
import flaggPersonSagas from "./flaggPersonSagas";
import vedtakSagas from "./vedtakSagas";

export default function* rootSaga() {
  yield all([
    ledereSagas(),
    fastlegerSagas(),
    navbrukerSagas(),
    moterSagas(),
    motebehovSagas(),
    ledeteksterSagas(),
    epostinnholdSagas(),
    virksomhetSagas(),
    modiacontextSagas(),
    sykmeldingerSagas(),
    oppfoelgingsdialogerSagas(),
    oppfolgingsplanerLPSSagas(),
    historikkSagas(),
    behandlendeEnhetSagas(),
    dokumentInfoSagas(),
    veilederinfoSagas(),
    diskresjonskodeSagas(),
    egenansattSagas(),
    tilgangSagas(),
    tidslinjerSagas(),
    soknaderSagas(),
    oppfolgingstilfelleperioderSagas(),
    personInfoSagas(),
    personoppgaveSagas(),
    flaggPersonSagas(),
    vedtakSagas(),
  ]);
}
