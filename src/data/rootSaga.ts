import { all } from "redux-saga/effects";
import navbrukerSagas from "./navbruker/navbrukerSagas";

export default function* rootSaga() {
  yield all([navbrukerSagas()]);
}
