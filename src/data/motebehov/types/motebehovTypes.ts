export interface MotebehovVeilederDTO {
  id: string;
  opprettetDato: Date;
  opprettetAv: string;
  opprettetAvNavn: string | null;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  innmelderType: MotebehovInnmelder; //TODO: Usikker på når det kommer ARBEIDSTAKER | ARBEIDSGIVER,
  skjemaType: MotebehovSkjemaType | null; // Skal tydeligvis ikke være nullable
  formValues: MotebehovFormValuesOutputDTO;
}

export interface MotebehovFormValuesOutputDTO {
  harMotebehov: boolean;
  // formSnapshot: FormSnapshot?, //TODO: Usikker på om denne bare skal ignoreres
  begrunnelse: string | null;
  onskerSykmelderDeltar: boolean | null;
  onskerSykmelderDeltarBegrunnelse: string | null;
  onskerTolk: boolean | null;
  tolkSprak: string | null;
}

export enum MotebehovSkjemaType {
  MELD_BEHOV = "MELD_BEHOV",
  SVAR_BEHOV = "SVAR_BEHOV",
}

export interface MeldtMotebehov {
  id: string;
  opprettetDato: Date;
  opprettetAv: string;
  opprettetAvNavn: string | null;
  innmelder: MotebehovInnmelder;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  skjemaType: MotebehovSkjemaType.MELD_BEHOV;
  formValues: MotebehovFormValuesOutputDTO;
}

export interface SvarMotebehov {
  id: string;
  opprettetDato: Date;
  opprettetAv: string;
  opprettetAvNavn: string | null;
  innmelder: MotebehovInnmelder;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  skjemaType: MotebehovSkjemaType.SVAR_BEHOV;
  formValues: MotebehovFormValuesOutputDTO;
}

export enum MotebehovInnmelder {
  ARBEIDSTAKER = "ARBEIDSTAKER",
  ARBEIDSGIVER = "ARBEIDSGIVER",
}
