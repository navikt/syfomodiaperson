import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import {
  MotebehovInnmelder,
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
} from "@/data/motebehov/types/motebehovTypes";
import { addDays } from "@/utils/datoUtils";

export const svartJaMotebehovArbeidstakerUbehandletMock: MotebehovVeilederDTO = {
  id: "11111111-ee10-44b6-bddf-54d049ef25f9",
  opprettetDato: addDays(new Date(), -25),
  opprettetAv: "1",
  opprettetAvNavn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
  virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  innmelderType: MotebehovInnmelder.ARBEIDSTAKER,
  behandletTidspunkt: null,
  behandletVeilederIdent: null,
  skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
  formValues: {
    harMotebehov: true,
    begrunnelse: "Jeg svarer på møtebehov ved 17 uker",
    onskerSykmelderDeltar: null,
    onskerSykmelderDeltarBegrunnelse: null,
    onskerTolk: null,
    tolkSprak: null,
  },
};

export const meldtMotebehovArbeidstakerBehandletMock: MotebehovVeilederDTO = {
  id: "33333333-ee10-44b6-bddf-54d049ef25f2",
  opprettetDato: addDays(new Date(), -10),
  opprettetAv: "1",
  opprettetAvNavn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
  virksomhetsnummer: "000999000",
  innmelderType: MotebehovInnmelder.ARBEIDSTAKER,
  behandletTidspunkt: addDays(new Date(), -1),
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  skjemaType: MotebehovSkjemaType.MELD_BEHOV,
  formValues: {
    harMotebehov: true,
    begrunnelse: "Møter er bra!",
    onskerSykmelderDeltar: null,
    onskerSykmelderDeltarBegrunnelse: null,
    onskerTolk: null,
    tolkSprak: null,
  },
};

export const svartNeiMotebehovArbeidsgiverUbehandletMock: MotebehovVeilederDTO =
  {
    id: "22222222-9e9b-40b0-bd1c-d1c39dc5f481",
    opprettetDato: addDays(new Date(), -5),
    opprettetAv: "1902690001009",
    opprettetAvNavn: "Are Arbeidsgiver",
    arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
    innmelderType: MotebehovInnmelder.ARBEIDSGIVER,
    formValues: {
      harMotebehov: false,
      begrunnelse: "Jeg liker ikke møte!!",
      onskerSykmelderDeltar: null,
      onskerSykmelderDeltarBegrunnelse: null,
      onskerTolk: null,
      tolkSprak: null,
    },
  };

export const motebehovMock = [
  svartJaMotebehovArbeidstakerUbehandletMock,
  meldtMotebehovArbeidstakerBehandletMock,
  svartNeiMotebehovArbeidsgiverUbehandletMock,
];
