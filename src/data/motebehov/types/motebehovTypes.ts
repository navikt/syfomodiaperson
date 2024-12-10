export interface MotebehovSvarVeilederDTO {
  harMotebehov: boolean;
  forklaring: string | null;
}

export interface MotebehovVeilederDTO {
  id: string;
  opprettetDato: Date;
  aktorId: string;
  opprettetAv: string;
  opprettetAvNavn: string | null;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  motebehovSvar: MotebehovSvarVeilederDTO;
  tildeltEnhet: string | null;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  skjemaType: MotebehovSkjemaType | null;
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
  begrunnelse: string | null;
  tildeltEnhet: string | null;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  skjemaType: MotebehovSkjemaType.MELD_BEHOV;
}

export interface SvarMotebehov {
  id: string;
  opprettetDato: Date;
  opprettetAv: string;
  opprettetAvNavn: string | null;
  innmelder: MotebehovInnmelder;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  motebehovSvar: MotebehovSvarVeilederDTO;
  tildeltEnhet: string | null;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  skjemaType: MotebehovSkjemaType.SVAR_BEHOV;
}

export enum MotebehovInnmelder {
  ARBEIDSTAKER = "ARBEIDSTAKER",
  ARBEIDSGIVER = "ARBEIDSGIVER",
}
