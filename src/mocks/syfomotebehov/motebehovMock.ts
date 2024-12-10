import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  ENHET_GRUNERLOKKA,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import {
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
} from "@/data/motebehov/types/motebehovTypes";
import { addDays } from "@/utils/datoUtils";

const motebehovArbeidstakerUbehandletMock: MotebehovVeilederDTO = {
  id: "11111111-ee10-44b6-bddf-54d049ef25f9",
  opprettetDato: addDays(new Date(), -25),
  aktorId: "1",
  opprettetAv: "1",
  opprettetAvNavn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
  virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  motebehovSvar: {
    harMotebehov: true,
    forklaring: "Jeg svarer på møtebehov ved 17 uker",
  },
  tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
  behandletTidspunkt: null,
  behandletVeilederIdent: null,
  skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
};

const motebehovArbeidstakerBehandletMock: MotebehovVeilederDTO = {
  id: "33333333-ee10-44b6-bddf-54d049ef25f2",
  opprettetDato: addDays(new Date(), -10),
  aktorId: "1",
  opprettetAv: "1",
  opprettetAvNavn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
  virksomhetsnummer: "000999000",
  motebehovSvar: {
    harMotebehov: true,
    forklaring: "Møter er bra!",
  },
  tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
  behandletTidspunkt: addDays(new Date(), -1),
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  skjemaType: MotebehovSkjemaType.MELD_BEHOV,
};

const motebehovArbeidsgiverMock: MotebehovVeilederDTO = {
  id: "22222222-9e9b-40b0-bd1c-d1c39dc5f481",
  opprettetDato: addDays(new Date(), -5),
  aktorId: "1",
  opprettetAv: "1902690001009",
  opprettetAvNavn: "Are Arbeidsgiver",
  arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
  virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  motebehovSvar: {
    harMotebehov: false,
    forklaring: "Jeg liker ikke møte!!",
  },
  tildeltEnhet: "0330",
  behandletTidspunkt: null,
  behandletVeilederIdent: null,
  skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
};

export const motebehovMock = [
  motebehovArbeidstakerUbehandletMock,
  motebehovArbeidstakerBehandletMock,
  motebehovArbeidsgiverMock,
];
