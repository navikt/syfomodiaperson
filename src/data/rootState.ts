import { combineReducers } from "redux";
import fastleger, { FastlegerState } from "./fastlege/fastleger";
import ledere, { LedereState } from "./leder/ledere";
import navbruker, { NavbrukerState } from "./navbruker/navbruker";
import modiacontext, { ModiaContextState } from "./modiacontext/modiacontext";
import historikk, { HistorikkState } from "./historikk/historikk";
import moter, { MoterState } from "./mote/moter";
import motebehov, { MotebehovState } from "./motebehov/motebehov";
import motebehovBehandling, {
  MotebehovBehandlingState,
} from "./motebehov/motebehovBehandling";
import virksomhet, { VirksomhetMapState } from "./virksomhet/virksomhet";
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
import veilederinfo, { VeilederinfoState } from "./veilederinfo/veilederinfo";
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
import vedtak, { VedtakState } from "./vedtak/vedtak";
import dialogmote, { DialogmoteState } from "./dialogmote/dialogmote";
import unleash, { UnleashState } from "./unleash/unleash";

export interface RootState {
  fastleger: FastlegerState;
  ledere: LedereState;
  navbruker: NavbrukerState;
  modiacontext: ModiaContextState;
  historikk: HistorikkState;
  moter: MoterState;
  motebehov: MotebehovState;
  motebehovBehandling: MotebehovBehandlingState;
  virksomhet: VirksomhetMapState;
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
  veilederinfo: VeilederinfoState;
  tilgang: TilgangState;
  soknader: SykepengesoknaderState;
  oppfolgingstilfellerperson: OppfolgingstilfellerPersonState;
  oppfolgingstilfelleperioder: OppfolgingstilfelleperioderMapState;
  personadresse: PersonAdresseState;
  personoppgaver: PersonOppgaverState;
  flaggperson: FlaggpersonState;
  vedtak: VedtakState;
  dialogmote: DialogmoteState;
  unleash: UnleashState;
}

export const rootReducer = combineReducers<RootState>({
  fastleger,
  ledere,
  navbruker,
  modiacontext,
  historikk,
  moter,
  motebehov,
  motebehovBehandling,
  virksomhet,
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
  veilederinfo,
  tilgang,
  soknader,
  oppfolgingstilfellerperson,
  oppfolgingstilfelleperioder,
  personadresse,
  personoppgaver,
  flaggperson,
  vedtak,
  dialogmote,
  unleash,
});
