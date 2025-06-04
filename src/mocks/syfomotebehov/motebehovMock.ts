import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import {
  FormIdentifier,
  FormSnapshot,
  FormSnapshotFieldOption,
  FormSnapshotFieldType,
  MotebehovFormValuesOutputDTO,
  MotebehovInnmelder,
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
  RadioGroupFieldSnapshot,
  SingleCheckboxFieldSnapshot,
  TextFieldSnapshot,
} from "@/data/motebehov/types/motebehovTypes";
import { addDays } from "@/utils/datoUtils";

export const defaultBegrunnelse: TextFieldSnapshot = {
  fieldId: "begrunnelseText",
  fieldType: FormSnapshotFieldType.TEXT,
  description:
    "Hva ønsker du å ta opp i møtet? Hva tenker du at NAV kan bistå med? Ikke skriv sensitiv informasjon, for eksempel detaljerte opplysninger om helse.",
  label: "Begrunnelse",
  value: "Møter er bra!",
  wasRequired: true,
};

export const createBegrunnelse = (textValue: string): TextFieldSnapshot => ({
  ...defaultBegrunnelse,
  value: textValue,
});

export const createOnskerTolk = (
  isChecked: boolean
): SingleCheckboxFieldSnapshot => ({
  ...defaultOnskerTolk,
  value: isChecked,
});

export const createSykmelderDeltar = (
  isChecked: boolean
): SingleCheckboxFieldSnapshot => ({
  ...defaultOnskerSykmelderDeltar,
  value: isChecked,
});

export const createSykmelderDeltarBegrunnelse = (
  textValue: string
): TextFieldSnapshot => ({
  ...defaultOnskerSykmelderDeltarBegrunnelse,
  value: textValue,
});

export const createOnskerTolkBegrunnelse = (
  textValue: string
): TextFieldSnapshot => ({
  ...defaultOnskerTolkBegrunnelse,
  value: textValue,
});

export const defaultFormValue: MotebehovFormValuesOutputDTO = {
  harMotebehov: false,
  begrunnelse: null,
  onskerSykmelderDeltar: null,
  onskerSykmelderDeltarBegrunnelse: null,
  onskerTolk: null,
  tolkSprak: null,
  formSnapshot: null,
};

export const getFormIdentifier = (
  motebehovSkjemaType: MotebehovSkjemaType,
  motebehovInnmelder: MotebehovInnmelder
): FormIdentifier => {
  if (motebehovInnmelder === MotebehovInnmelder.ARBEIDSTAKER) {
    switch (motebehovSkjemaType) {
      case MotebehovSkjemaType.SVAR_BEHOV:
        return FormIdentifier.MOTEBEHOV_ARBEIDSTAKER_SVAR;
      case MotebehovSkjemaType.MELD_BEHOV:
        return FormIdentifier.MOTEBEHOV_ARBEIDSTAKER_MELD;
    }
  } else {
    switch (motebehovSkjemaType) {
      case MotebehovSkjemaType.SVAR_BEHOV:
        return FormIdentifier.MOTEBEHOV_ARBEIDSGIVER_SVAR;
      case MotebehovSkjemaType.MELD_BEHOV:
        return FormIdentifier.MOTEBEHOV_ARBEIDSGIVER_MELD;
    }
  }
};

export const createFormValues = (
  {
    harMotebehov,
    begrunnelse,
    onskerSykmelderDeltar,
    onskerSykmelderDeltarBegrunnelse,
    onskerTolk,
    tolkSprak,
  }: MotebehovFormValuesOutputDTO,
  motebehovSkjemaType: MotebehovSkjemaType,
  motebehovInnmelder: MotebehovInnmelder
): MotebehovFormValuesOutputDTO => ({
  harMotebehov: harMotebehov,
  begrunnelse: begrunnelse,
  onskerSykmelderDeltar: onskerSykmelderDeltar,
  onskerSykmelderDeltarBegrunnelse: onskerSykmelderDeltarBegrunnelse,
  onskerTolk: onskerTolk,
  tolkSprak: tolkSprak,
  formSnapshot: {
    ...defaultFormSnapshot,
    formIdentifier: getFormIdentifier(motebehovSkjemaType, motebehovInnmelder),
    fieldSnapshots: [
      ...(motebehovSkjemaType === MotebehovSkjemaType.SVAR_BEHOV
        ? [svarPaBehovForMote(harMotebehov)]
        : []),
      ...(begrunnelse ? [createBegrunnelse(begrunnelse)] : []),
      ...(onskerSykmelderDeltar != null
        ? [createSykmelderDeltar(onskerSykmelderDeltar)]
        : []),
      ...(onskerSykmelderDeltarBegrunnelse
        ? [createSykmelderDeltarBegrunnelse(onskerSykmelderDeltarBegrunnelse)]
        : []),
      ...(onskerTolk != null ? [createOnskerTolk(onskerTolk)] : []),
      ...(tolkSprak ? [createOnskerTolkBegrunnelse(tolkSprak)] : []),
    ],
  },
});

export const defaultOnskerTolk: SingleCheckboxFieldSnapshot = {
  fieldId: "onskerTolkCheckbox",
  fieldType: FormSnapshotFieldType.CHECKBOX_SINGLE,
  description: null,
  label: "Vi har behov for tolk.",
  value: true,
};

export const defaultOnskerTolkBegrunnelse: TextFieldSnapshot = {
  fieldId: "onskerTolkBegrunnelseText",
  fieldType: FormSnapshotFieldType.TEXT,
  description: null,
  label: "Hva slags tolk har dere behov for?",
  value: "Har behov for svensk tolk",
  wasRequired: true,
};

export const defaultOnskerSykmelderDeltar: SingleCheckboxFieldSnapshot = {
  fieldId: "onskerSykmelderDeltarCheckbox",
  fieldType: FormSnapshotFieldType.CHECKBOX_SINGLE,
  description: null,
  label: "Jeg ønsker at sykmelder (lege/behandler) også deltar i møtet.",
  value: true,
};

export const defaultOnskerSykmelderDeltarBegrunnelse: TextFieldSnapshot = {
  fieldId: "onskerSykmelderDeltarBegrunnelseText",
  fieldType: FormSnapshotFieldType.TEXT,
  description: null,
  label: "Hvorfor ønsker du at lege/behandler deltar i møtet?",
  value: "Ønsker at legen min er tilstede",
  wasRequired: true,
};

export const defaultFormSnapshot: FormSnapshot = {
  formIdentifier: FormIdentifier.MOTEBEHOV_ARBEIDSTAKER_SVAR,
  formSemanticVersion: "1.0.0",
  fieldSnapshots: [],
};

const isJaValgt = (value: boolean): FormSnapshotFieldOption[] => [
  {
    optionId: "Ja",
    optionLabel: "Ja, vi har behov for et dialogmøte.",
    wasSelected: value,
  },
  {
    optionId: "Nei",
    optionLabel: "Nei, vi har ikke behov for et dialogmøte nå.",
    wasSelected: !value,
  },
];

export const svarPaBehovForMote = (
  value: boolean
): RadioGroupFieldSnapshot => ({
  fieldId: "harBehovRadioGroup",
  fieldType: FormSnapshotFieldType.RADIO_GROUP,
  description:
    "Du svarer på vegne av arbeidsgiver. Den ansatte har fått det samme spørsmålet og svarer på vegne av seg selv.",
  label: "Har dere behov for et dialogmøte med NAV?",
  selectedOptionId: value ? "Ja" : "Nei",
  selectedOptionLabel: value
    ? "Ja, vi har behov for et dialogmøte."
    : "Nei, vi har ikke behov for et dialogmøte nå.",
  options: isJaValgt(value),
  wasRequired: true,
});

export const svartJaMotebehovArbeidstakerUbehandletMock: MotebehovVeilederDTO =
  {
    id: "11111111-ee10-44b6-bddf-54d049ef25f9",
    opprettetDato: addDays(new Date(), -25),
    opprettetAvNavn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
    arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    innmelderType: MotebehovInnmelder.ARBEIDSTAKER,
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
    formValues: createFormValues(
      {
        ...defaultFormValue,
        harMotebehov: true,
        begrunnelse: "Jeg svarer på møtebehov ved 17 uker",
        onskerSykmelderDeltar: null,
        onskerSykmelderDeltarBegrunnelse: null,
        onskerTolk: null,
        tolkSprak: null,
      },
      MotebehovSkjemaType.SVAR_BEHOV,
      MotebehovInnmelder.ARBEIDSTAKER
    ),
  };

export const meldtMotebehovArbeidstakerBehandletMock = (
  skjemaType: MotebehovSkjemaType = MotebehovSkjemaType.MELD_BEHOV,
  innmelderType: MotebehovInnmelder = MotebehovInnmelder.ARBEIDSTAKER
): MotebehovVeilederDTO => {
  return {
    id: "33333333-ee10-44b6-bddf-54d049ef25f2",
    opprettetDato: addDays(new Date(), -10),
    opprettetAvNavn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
    arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: "000999000",
    innmelderType: innmelderType,
    behandletTidspunkt: addDays(new Date(), -1),
    behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
    skjemaType: skjemaType,
    formValues: createFormValues(
      {
        ...defaultFormValue,
        harMotebehov: true,
        begrunnelse: "Møter er bra!",
        onskerSykmelderDeltar: true,
        onskerSykmelderDeltarBegrunnelse: "Ønsker at legen min er tilstede",
        onskerTolk: true,
        tolkSprak: "Har behov for svensk tolk",
      },
      skjemaType,
      innmelderType
    ),
  };
};

export const svartNeiMotebehovArbeidsgiverUbehandletMock = (
  skjemaType: MotebehovSkjemaType = MotebehovSkjemaType.SVAR_BEHOV,
  innmelderType: MotebehovInnmelder = MotebehovInnmelder.ARBEIDSGIVER
): MotebehovVeilederDTO => {
  return {
    id: "22222222-9e9b-40b0-bd1c-d1c39dc5f481",
    opprettetDato: addDays(new Date(), -5),
    opprettetAvNavn: "Are Arbeidsgiver",
    arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    skjemaType: skjemaType,
    innmelderType: innmelderType,
    formValues: createFormValues(
      {
        ...defaultFormValue,
        harMotebehov: false,
        begrunnelse: "Jeg liker ikke møte!!",
      },
      skjemaType,
      innmelderType
    ),
  };
};

export const meldtMotebehovArbeidsgiverBehandletMock = {
  ...svartNeiMotebehovArbeidsgiverUbehandletMock(
    MotebehovSkjemaType.MELD_BEHOV
  ),
  opprettetDato: addDays(new Date(), -10),
  behandletTidspunkt: addDays(new Date(), -1),
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  formValues: createFormValues(
    {
      ...defaultFormValue,
      harMotebehov: true,
      begrunnelse: "Jeg liker møte.",
    },
    MotebehovSkjemaType.MELD_BEHOV,
    MotebehovInnmelder.ARBEIDSGIVER
  ),
};

export const motebehovMock = [
  svartJaMotebehovArbeidstakerUbehandletMock,
  meldtMotebehovArbeidstakerBehandletMock(),
  svartNeiMotebehovArbeidsgiverUbehandletMock(),
];
