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
import oppfoelgingsdialoger, {
  OppfolgingsplanerState,
} from "./oppfolgingsplan/oppfoelgingsdialoger";
import oppfolgingsplanerlps, {
  OppfolgingsplanerlpsState,
} from "./oppfolgingsplan/oppfolgingsplanerlps";
import enhet, { EnhetState } from "./valgtenhet/enhet";
import valgtbruker, { ValgtBrukerState } from "./valgtbruker/valgtbruker";
import sykmeldinger, { SykmeldingerState } from "./sykmelding/sykmeldinger";
import behandlendeEnhet, {
  BehandlendeEnhetState,
} from "./behandlendeenhet/behandlendeEnhet";
import diskresjonskode, {
  DiskresjonskodeState,
} from "./diskresjonskode/diskresjonskode";
import dokumentinfo, {
  DokumentinfoMapState,
} from "./oppfolgingsplan/dokumentinfo";
import tilgang, { TilgangState } from "./tilgang/tilgang";
import soknader, { SykepengesoknaderState } from "./sykepengesoknad/soknader";
import oppfolgingstilfellerperson, {
  OppfolgingstilfellerPersonState,
} from "./oppfolgingstilfelle/oppfolgingstilfellerperson";
import oppfolgingstilfelleperioder, {
  OppfolgingstilfelleperioderMapState,
} from "./oppfolgingstilfelle/oppfolgingstilfelleperioder";
import personadresse, { PersonAdresseState } from "./personinfo/personadresse";
import personoppgaver, {
  PersonOppgaverState,
} from "./personoppgave/personoppgaver";
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
  oppfoelgingsdialoger: OppfolgingsplanerState;
  oppfolgingsplanerlps: OppfolgingsplanerlpsState;
  enhet: EnhetState;
  valgtbruker: ValgtBrukerState;
  sykmeldinger: SykmeldingerState;
  behandlendeEnhet: BehandlendeEnhetState;
  diskresjonskode: DiskresjonskodeState;
  dokumentinfo: DokumentinfoMapState;
  tilgang: TilgangState;
  soknader: SykepengesoknaderState;
  oppfolgingstilfellerperson: OppfolgingstilfellerPersonState;
  oppfolgingstilfelleperioder: OppfolgingstilfelleperioderMapState;
  personadresse: PersonAdresseState;
  personoppgaver: PersonOppgaverState;
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
  oppfoelgingsdialoger,
  oppfolgingsplanerlps,
  enhet,
  valgtbruker,
  sykmeldinger,
  behandlendeEnhet,
  diskresjonskode,
  dokumentinfo,
  tilgang,
  soknader,
  oppfolgingstilfellerperson,
  oppfolgingstilfelleperioder,
  personadresse,
  personoppgaver,
  flaggperson,
  unleash,
});
