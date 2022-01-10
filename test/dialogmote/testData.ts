import {
  DialogmotedeltakerBehandlerDTO,
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
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GRUNERLOKKA,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";

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

export const moteSted = "Møtested";
export const moteDato = toDatePrettyPrint(
  leggTilDagerPaDato(new Date(), 1)
) as string;
export const moteDatoAsISODateString = InputDateStringToISODateString(moteDato);
export const moteKlokkeslett = "08:00";
export const moteDatoTid = `${moteDatoAsISODateString}T${moteKlokkeslett}:00`;
export const moteVideoLink = "https://video.nav.no";

export const fritekstTilBehandler = "Noe fritekst til behandler";

export const expectedBehandlerInnkalling = [
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
