import { combineReducers } from "redux";
import ledere, { LedereState } from "./leder/ledere";
import navbruker, { NavbrukerState } from "./navbruker/navbruker";
import modiacontext, { ModiaContextState } from "./modiacontext/modiacontext";
import historikk, { HistorikkState } from "./historikk/historikk";
import moter, { MoterState } from "./mote/moter";
import motebehov, { MotebehovState } from "./motebehov/motebehov";
import motebehovBehandling, {
  MotebehovBehandlingState,
} from "./motebehov/motebehovBehandling";
import epostinnhold, { EpostInnholdState } from "./mote/epostinnhold";
import arbeidsgiverEpostinnhold, {
  ArbeidsgiverEpostinnholdState,
} from "./mote/arbeidsgiverEpostinnhold";
import enhet, { EnhetState } from "./valgtenhet/enhet";
import valgtbruker, { ValgtBrukerState } from "./valgtbruker/valgtbruker";
import sykmeldinger, { SykmeldingerState } from "./sykmelding/sykmeldinger";
import oppfolgingstilfellerperson, {
  OppfolgingstilfellerPersonState,
} from "./oppfolgingstilfelle/oppfolgingstilfellerperson";
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
  motebehov: MotebehovState;
  motebehovBehandling: MotebehovBehandlingState;
  epostinnhold: EpostInnholdState;
  arbeidsgiverEpostinnhold: ArbeidsgiverEpostinnholdState;
  enhet: EnhetState;
  valgtbruker: ValgtBrukerState;
  sykmeldinger: SykmeldingerState;
  oppfolgingstilfellerperson: OppfolgingstilfellerPersonState;
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
  motebehov,
  motebehovBehandling,
  epostinnhold,
  arbeidsgiverEpostinnhold,
  enhet,
  valgtbruker,
  sykmeldinger,
  oppfolgingstilfellerperson,
  oppfolgingstilfelleperioder,
  flaggperson,
  unleash,
});
