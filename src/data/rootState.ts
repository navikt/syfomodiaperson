import { combineReducers } from "redux";
import navbruker, { NavbrukerState } from "./navbruker/navbruker";
import historikk, { HistorikkState } from "./historikk/historikk";
import moter, { MoterState } from "./mote/moter";
import epostinnhold, { EpostInnholdState } from "./mote/epostinnhold";
import arbeidsgiverEpostinnhold, {
  ArbeidsgiverEpostinnholdState,
} from "./mote/arbeidsgiverEpostinnhold";

export interface RootState {
  navbruker: NavbrukerState;
  historikk: HistorikkState;
  moter: MoterState;
  epostinnhold: EpostInnholdState;
  arbeidsgiverEpostinnhold: ArbeidsgiverEpostinnholdState;
}

export const rootReducer = combineReducers<RootState>({
  navbruker,
  historikk,
  moter,
  epostinnhold,
  arbeidsgiverEpostinnhold,
});
