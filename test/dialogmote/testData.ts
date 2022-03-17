import {
  DialogmotedeltakerArbeidsgiverVarselDTO,
  DialogmotedeltakerArbeidstakerVarselDTO,
  DialogmotedeltakerBehandlerDTO,
  DialogmoteDTO,
  DialogmoteStatus,
  DocumentComponentType,
  MotedeltakerVarselType,
  VarselSvarDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import {
  BehandlerDialogmeldingDTO,
  BehandlerType,
} from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { leggTilDagerPaDato, toDatePrettyPrint } from "@/utils/datoUtils";
import { InputDateStringToISODateString } from "nav-datovelger/lib/utils/dateFormatUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  BEHANDLENDE_ENHET_DEFAULT,
  ENHET_GRUNERLOKKA,
  NARMESTE_LEDER_DEFAULT,
  VEILEDER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import { capitalizeWord } from "@/utils/stringUtils";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { referatTexts } from "@/data/dialogmote/dialogmoteTexts";

export const arbeidstaker = {
  navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
};
export const arbeidsgiver = {
  orgnr: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
};
export const navEnhet = {
  id: ENHET_GRUNERLOKKA.nummer,
  navn: ENHET_GRUNERLOKKA.navn,
};
export const behandlendeEnhet = BEHANDLENDE_ENHET_DEFAULT;
export const veileder = VEILEDER_DEFAULT;

export const narmesteLederNavn = NARMESTE_LEDER_DEFAULT.navn;

export const behandler: BehandlerDialogmeldingDTO = {
  fnr: "01038521470",
  behandlerRef: "behandler-ref-uuid",
  kontor: "Greendale Legekontor",
  telefon: "11223344",
  fornavn: "Dean",
  etternavn: "Pelton",
  type: BehandlerType.FASTLEGE,
};
export const behandlerDeltaker: DialogmotedeltakerBehandlerDTO = {
  behandlerType: behandler.type,
  type: "BEHANDLER",
  uuid: "456def",
  personIdent: "01038521470",
  behandlerRef: "456def",
  varselList: [],
  behandlerKontor: "Greendale Legekontor",
  behandlerNavn: "Dean Pelton",
  deltatt: true,
  mottarReferat: true,
};

export const dialogmote: DialogmoteDTO = {
  arbeidsgiver: {
    virksomhetsnummer: arbeidsgiver.orgnr,
    type: "ARBEIDSGIVER",
    varselList: [],
  },
  arbeidstaker: {
    personIdent: arbeidstaker.personident,
    type: "ARBEIDSTAKER",
    varselList: [],
  },
  createdAt: "",
  opprettetAv: "",
  status: DialogmoteStatus.INNKALT,
  tildeltEnhet: "",
  tildeltVeilederIdent: "",
  updatedAt: "",
  uuid: "123abc",
  tid: "2021-05-10T09:00:00.000",
  sted: "Videomøte",
  referatList: [],
};
export const dialogmoteMedBehandler: DialogmoteDTO = {
  ...dialogmote,
  behandler: behandlerDeltaker,
};
const dialogmoteMedBehandlerIkkeDeltatt: DialogmoteDTO = {
  ...dialogmote,
  behandler: {
    ...behandlerDeltaker,
    deltatt: false,
    mottarReferat: false,
  },
};

export const varselArbeidsgiver = (
  type: MotedeltakerVarselType,
  lestDato?: string,
  svar?: VarselSvarDTO
): DialogmotedeltakerArbeidsgiverVarselDTO => ({
  uuid: "",
  varselType: type,
  fritekst: "",
  document: [],
  createdAt: "",
  lestDato,
  status: "",
  svar,
});

export const varselArbeidstaker = (
  type: MotedeltakerVarselType,
  lestDato?: string,
  svar?: VarselSvarDTO
): DialogmotedeltakerArbeidstakerVarselDTO => ({
  uuid: "",
  varselType: type,
  fritekst: "",
  document: [],
  digitalt: true,
  createdAt: "",
  lestDato,
  svar,
});

export const dialogmoteMedVarsel = (
  varselArbeidsgiver: DialogmotedeltakerArbeidsgiverVarselDTO[],
  varselArbeidstaker: DialogmotedeltakerArbeidstakerVarselDTO[]
): DialogmoteDTO => ({
  ...dialogmote,
  arbeidsgiver: {
    virksomhetsnummer: arbeidsgiver.orgnr,
    type: "ARBEIDSGIVER",
    varselList: varselArbeidsgiver,
  },
  arbeidstaker: {
    personIdent: arbeidstaker.personident,
    type: "ARBEIDSTAKER",
    varselList: varselArbeidstaker,
  },
});

export const mockState = {
  navbruker: {
    data: {
      navn: arbeidstaker.navn,
      kontaktinfo: {
        fnr: arbeidstaker.personident,
      },
    },
  },
};

const moteSted = "Sted for møtet";
const moteDato = toDatePrettyPrint(leggTilDagerPaDato(new Date(), 1)) as string;
const moteDatoAsISODateString = InputDateStringToISODateString(moteDato);
const moteKlokkeslett = "08:00";
const moteDatoTid = `${moteDatoAsISODateString}T${moteKlokkeslett}:00`;
const moteVideoLink = "https://video.nav.no";
const arbeidsgivernavn = VIRKSOMHET_PONTYPANDY.virksomhetsnavn;

const endretSted = "Videomøte endret";
const endretDato = toDatePrettyPrint(
  leggTilDagerPaDato(new Date(), 2)
) as string;
const endretKlokkeslett = "09:00";
const endretDatoAsISODateString = InputDateStringToISODateString(endretDato);
const endretDatoTid = `${InputDateStringToISODateString(
  endretDato
)}T${endretKlokkeslett}:00`;
const endretVideolink = "https://video.nav.no/asxs";

const fritekstTilBehandler = "Noe fritekst til behandler";
const fritekstTilArbeidstaker = "Noe fritekst til arbeidstaker";
const fritekstTilArbeidsgiver = "Noe fritekst til arbeidsgiver";
const situasjonTekst = "Noe tekst om situasjonen";
const konklusjonTekst = "Noe tekst om konklusjon";
const arbeidsgiversOppgave = "Noe tekst om arbeidsgivers oppgave";
const arbeidstakersOppgave = "Noe tekst om arbeidstakers oppgave";
const veiledersOppgave = "Noe tekst om veileders oppgave";
const behandlersOppgave = "Noe tekst om behandlers oppgave";

export const annenDeltakerNavn = "Bodil Bolle";
export const annenDeltakerFunksjon = "Verneombud";
export const behandlerDeltakerTekst = `Behandler: ${capitalizeWord(
  behandler.type.toLowerCase()
)} ${behandlerNavn(behandler)}`;

export const mote = {
  sted: moteSted,
  dato: moteDato,
  datoAsISODateString: moteDatoAsISODateString,
  klokkeslett: moteKlokkeslett,
  datoTid: moteDatoTid,
  videolink: moteVideoLink,
  arbeidsgivernavn: arbeidsgivernavn,
};
export const endretMote: typeof mote = {
  sted: endretSted,
  dato: endretDato,
  datoAsISODateString: endretDatoAsISODateString,
  datoTid: endretDatoTid,
  klokkeslett: endretKlokkeslett,
  videolink: endretVideolink,
  arbeidsgivernavn: arbeidsgivernavn,
};

export const moteTekster = {
  fritekstTilArbeidstaker,
  fritekstTilArbeidsgiver,
  fritekstTilBehandler,
  situasjonTekst,
  konklusjonTekst,
  arbeidsgiversOppgave,
  arbeidstakersOppgave,
  veiledersOppgave,
  behandlersOppgave,
};

export const referatStandardTekst = referatTexts.standardTekster[3];

const lagretReferat = {
  uuid: "123abc",
  situasjon: situasjonTekst,
  arbeidsgiverOppgave: arbeidsgiversOppgave,
  arbeidstakerOppgave: arbeidstakersOppgave,
  narmesteLederNavn: narmesteLederNavn,
  konklusjon: konklusjonTekst,
  document: [
    {
      key: referatStandardTekst.key,
      title: referatStandardTekst.label,
      texts: [referatStandardTekst.text],
      type: DocumentComponentType.PARAGRAPH,
    },
  ],
  ferdigstilt: false,
  andreDeltakere: [
    { navn: annenDeltakerNavn, funksjon: annenDeltakerFunksjon },
  ],
};

export const dialogmoteMedReferat: DialogmoteDTO = {
  ...dialogmote,
  referatList: [lagretReferat],
};

export const dialogmoteMedReferatBehandlerIkkeDeltatt: DialogmoteDTO = {
  ...dialogmoteMedBehandlerIkkeDeltatt,
  referatList: [lagretReferat],
};
