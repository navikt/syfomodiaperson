export interface ArbeidsforholdDTO {
  navArbeidsforholdId: number;
  opprettet: string;
  sistBekreftet: string;
  orgnummer: string;
  type: string; // Ordinært arbeidsforhold el.
  ansettelseStart: string;
  ansettelseSlutt: string | null;
  ansettelsesform: string | null; // Fast ansettelse el.
  yrke: string;
  stillingsprosent: string;
}

export interface ArbeidsforholdPersonDTO {
  personident: string;
  arbeidsforhold: ArbeidsforholdDTO[];
}
