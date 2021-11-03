import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import {
  BehandlerDialogmeldingDTO,
  BehandlerType,
} from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";
import { ToggleNames } from "@/data/unleash/unleash_types";
import {
  commonTexts,
  innkallingTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  leggTilDagerPaDato,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
  toDatePrettyPrint,
} from "@/utils/datoUtils";
import { genererDato } from "@/components/mote/utils";
import { InputDateStringToISODateString } from "nav-datovelger/lib/utils/dateFormatUtils";

export const arbeidstaker = {
  navn: "Arne Arbeidstaker",
  personident: "05087321470",
};
export const arbeidsgiver = {
  orgnr: "912345678",
};
export const navEnhet = {
  id: "0315",
  navn: "NAV Grünerløkka",
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
export const behandlere: BehandlerDialogmeldingDTO[] = [
  {
    type: BehandlerType.FASTLEGE,
    behandlerRef: "123",
    fornavn: "Dorte",
    etternavn: "Doktorsen",
  },
];

export const behandler: BehandlerDialogmeldingDTO = {
  behandlerRef: "behandler-ref-uuid",
  kontor: "Greendale Legekontor",
  telefon: "11223344",
  fornavn: "Dean",
  etternavn: "Pelton",
  type: BehandlerType.FASTLEGE,
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
  behandler: {
    behandlerType: behandler.type,
    type: "BEHANDLER",
    uuid: "456def",
    behandlerRef: "456def",
    varselList: [],
    behandlerKontor: "Greendale Legekontor",
    behandlerNavn: "Dean Pelton",
  },
};

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
        arbeidstakerPersonIdentNumber: "19026900010",
        virksomhetsnummer: "110110110",
        virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
        narmesteLederPersonIdentNumber: "02690001009",
        narmesteLederTelefonnummer: "12345666",
        narmesteLederEpost: "test3@test.no",
        narmesteLederNavn: "Tatten Tattover",
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
        arbeidstakerPersonIdentNumber: "19026900010",
        virksomhetsnummer: "110110110",
        virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
        narmesteLederPersonIdentNumber: "02690001009",
        narmesteLederTelefonnummer: "12345666",
        narmesteLederEpost: "test3@test.no",
        narmesteLederNavn: "Tatten Tattover",
        aktivFom: new Date(),
        aktivTom: null,
        arbeidsgiverForskutterer: false,
        timestamp: "2020-02-06T12:00:00+01:00",
        status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
      },
    ],
  },
  unleash: {
    toggles: {
      [ToggleNames.dm2]: true,
      [ToggleNames.dm2VarselFysiskBrev]: false,
      [ToggleNames.dm2InnkallingFastlege]: true,
    },
  },
};

export const fritekstTilBehandler = "Noe fritekst til behandler";

export const expectedBehandlerInnkalling = [
  {
    texts: [""],
    title: innkallingTexts.moteTidTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [""],
    title: innkallingTexts.moteStedTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.behandler.intro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.behandler.intro2],
    type: "PARAGRAPH",
  },
  {
    texts: [fritekstTilBehandler],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.behandler.outro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.behandler.outro2],
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
];

export const moteSted = "Møtested";
export const moteDato = toDatePrettyPrint(
  leggTilDagerPaDato(new Date(), 1)
) as string;
export const moteDatoAsISODateString = InputDateStringToISODateString(moteDato);
export const moteKlokkeslett = "08:00";
export const moteDatoTid = `${moteDatoAsISODateString}T${moteKlokkeslett}:00`;
export const moteVideoLink = "https://video.nav.no";
export const fritekstTilArbeidstaker = "Noe fritekst til arbeidstaker";
export const expectedArbeidstakerInnkalling = [
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(moteDatoAsISODateString, moteKlokkeslett)
      ),
    ],
    title: innkallingTexts.moteTidTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [moteSted],
    title: innkallingTexts.moteStedTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [moteVideoLink],
    title: innkallingTexts.videoLinkTitle,
    type: "LINK",
  },
  {
    texts: [`Hei ${arbeidstaker.navn}`],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidstaker.intro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidstaker.intro2],
    type: "PARAGRAPH",
  },
  {
    texts: [fritekstTilArbeidstaker],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidstaker.outro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidstaker.outro2Text],
    title: innkallingTexts.arbeidstaker.outro2Title,
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
];

export const fritekstTilArbeidsgiver = "Noe fritekst til arbeidsgiver";
export const expectedArbeidsgiverInnkalling = [
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(moteDatoAsISODateString, moteKlokkeslett)
      ),
    ],
    title: innkallingTexts.moteTidTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [moteSted],
    title: innkallingTexts.moteStedTitle,
    type: "PARAGRAPH",
  },
  {
    texts: [moteVideoLink],
    title: innkallingTexts.videoLinkTitle,
    type: "LINK",
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidsgiver.intro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidsgiver.intro2],
    type: "PARAGRAPH",
  },
  {
    texts: [fritekstTilArbeidsgiver],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidsgiver.outro1],
    type: "PARAGRAPH",
  },
  {
    texts: [innkallingTexts.arbeidsgiver.outro2],
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.arbeidsgiverTlfLabel, commonTexts.arbeidsgiverTlf],
    type: "PARAGRAPH",
  },
];
