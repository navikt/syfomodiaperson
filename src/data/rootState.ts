import { combineReducers } from "redux";
import navbruker, { NavbrukerState } from "./navbruker/navbruker";
import modiacontext, { ModiaContextState } from "./modiacontext/modiacontext";
import historikk, { HistorikkState } from "./historikk/historikk";
import moter, { MoterState } from "./mote/moter";
import epostinnhold, { EpostInnholdState } from "./mote/epostinnhold";
import arbeidsgiverEpostinnhold, {
  ArbeidsgiverEpostinnholdState,
} from "./mote/arbeidsgiverEpostinnhold";
import valgtbruker, { ValgtBrukerState } from "./valgtbruker/valgtbruker";
import unleash, { UnleashState } from "./unleash/unleash";

export interface RootState {
  navbruker: NavbrukerState;
  modiacontext: ModiaContextState;
  historikk: HistorikkState;
  moter: MoterState;
  epostinnhold: EpostInnholdState;
  arbeidsgiverEpostinnhold: ArbeidsgiverEpostinnholdState;
  valgtbruker: ValgtBrukerState;
  unleash: UnleashState;
}

export const rootReducer = combineReducers<RootState>({
  navbruker,
  modiacontext,
  historikk,
  moter,
  epostinnhold,
  arbeidsgiverEpostinnhold,
  valgtbruker,
  unleash,
});
