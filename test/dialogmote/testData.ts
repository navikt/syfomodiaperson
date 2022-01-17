import {
  DialogmotedeltakerArbeidsgiverVarselDTO,
  DialogmotedeltakerArbeidstakerVarselDTO,
  DialogmotedeltakerBehandlerDTO,
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
  VarselSvarDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import {
  BehandlerDialogmeldingDTO,
  BehandlerType,
} from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { leggTilDagerPaDato, toDatePrettyPrint } from "@/utils/datoUtils";
import { InputDateStringToISODateString } from "nav-datovelger/lib/utils/dateFormatUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GRUNERLOKKA,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import { capitalizeWord } from "@/utils/stringUtils";
import { behandlerNavn } from "@/utils/behandlerUtils";

export const arbeidstaker = {
  navn: "Arne Arbeidstaker",
  personident: "05087321470",
};
export const arbeidsgiver = {
  orgnr: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
};
export const navEnhet = {
  id: ENHET_GRUNERLOKKA.nummer,
  navn: ENHET_GRUNERLOKKA.navn,
};
export const behandlendeEnhet = {
  enhetId: navEnhet.id,
  navn: navEnhet.navn,
};
export const veileder: Partial<VeilederinfoDTO> = {
  navn: "Vetle Veileder",
  epost: "vetle.veileder@nav.no",
  telefonnummer: "12345678",
};
export const narmesteLederNavn = "Tatten Tattover";

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
};
export const dialogmoteMedBehandler: DialogmoteDTO = {
  ...dialogmote,
  behandler: behandlerDeltaker,
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
  enhet: {
    valgtEnhet: navEnhet,
  },
  valgtbruker: {
    personident: arbeidstaker.personident,
  },
  ledere: {
    currentLedere: [
      {
        uuid: "3",
        arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
        virksomhetsnummer: arbeidsgiver.orgnr,
        virksomhetsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
        narmesteLederPersonIdentNumber: "02690001009",
        narmesteLederTelefonnummer: "12345666",
        narmesteLederEpost: "test3@test.no",
        narmesteLederNavn: narmesteLederNavn,
        aktivFom: new Date(),
        aktivTom: null,
        arbeidsgiverForskutterer: false,
        timestamp: "2020-02-06T12:00:00+01:00",
        status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
      },
    ],
  },
};

export const mockStateBehandler = {
  ...mockState,
  unleash: {
    toggles: {
      [ToggleNames.dm2]: true,
      [ToggleNames.dm2VarselFysiskBrev]: false,
      [ToggleNames.dm2InnkallingFastlege]: true,
    },
  },
};

const moteSted = "Sted for møtet";
const moteDato = toDatePrettyPrint(leggTilDagerPaDato(new Date(), 1)) as string;
const moteDatoAsISODateString = InputDateStringToISODateString(moteDato);
const moteKlokkeslett = "08:00";
const moteDatoTid = `${moteDatoAsISODateString}T${moteKlokkeslett}:00`;
const moteVideoLink = "https://video.nav.no";

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
export const lederNavn = "Grønn Bamse";
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
};
export const endretMote: typeof mote = {
  sted: endretSted,
  dato: endretDato,
  datoAsISODateString: endretDatoAsISODateString,
  datoTid: endretDatoTid,
  klokkeslett: endretKlokkeslett,
  videolink: endretVideolink,
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
