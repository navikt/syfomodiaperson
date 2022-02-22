import { combineReducers } from "redux";
import ledere, { LedereState } from "./leder/ledere";
import navbruker, { NavbrukerState } from "./navbruker/navbruker";
import modiacontext, { ModiaContextState } from "./modiacontext/modiacontext";
import historikk, { HistorikkState } from "./historikk/historikk";
import moter, { MoterState } from "./mote/moter";
import epostinnhold, { EpostInnholdState } from "./mote/epostinnhold";
import arbeidsgiverEpostinnhold, {
  ArbeidsgiverEpostinnholdState,
} from "./mote/arbeidsgiverEpostinnhold";
import enhet, { EnhetState } from "./valgtenhet/enhet";
import valgtbruker, { ValgtBrukerState } from "./valgtbruker/valgtbruker";
import sykmeldinger, { SykmeldingerState } from "./sykmelding/sykmeldinger";
import oppfolgingstilfelleperioder, {
  OppfolgingstilfelleperioderMapState,
} from "./oppfolgingstilfelle/oppfolgingstilfelleperioder";
import flaggperson, { FlaggpersonState } from "./pengestopp/flaggperson";
import unleash, { UnleashState } from "./unleash/unleash";

export interface RootState {
  ledere: LedereState;
  navbruker: NavbrukerState;
  modiacontext: ModiaContextState;
  historikk: HistorikkState;
  moter: MoterState;
  epostinnhold: EpostInnholdState;
  arbeidsgiverEpostinnhold: ArbeidsgiverEpostinnholdState;
  enhet: EnhetState;
  valgtbruker: ValgtBrukerState;
  sykmeldinger: SykmeldingerState;
  oppfolgingstilfelleperioder: OppfolgingstilfelleperioderMapState;
  flaggperson: FlaggpersonState;
  unleash: UnleashState;
}

export const rootReducer = combineReducers<RootState>({
  ledere,
  navbruker,
  modiacontext,
  historikk,
  moter,
  epostinnhold,
  arbeidsgiverEpostinnhold,
  enhet,
  valgtbruker,
  sykmeldinger,
  oppfolgingstilfelleperioder,
  flaggperson,
  unleash,
});
