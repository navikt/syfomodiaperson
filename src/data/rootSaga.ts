import { all } from "redux-saga/effects";
import navbrukerSagas from "./navbruker/navbrukerSagas";
import moterSagas from "./mote/moterSagas";
import epostinnholdSagas from "./mote/epostinnholdSagas";
import historikkSagas from "./historikk/historikkSagas";

export default function* rootSaga() {
  yield all([
    navbrukerSagas(),
    moterSagas(),
    epostinnholdSagas(),
    historikkSagas(),
  ]);
}
