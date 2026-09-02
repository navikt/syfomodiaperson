export interface AapSakerRequestDTO {
  personident: string;
}

export interface AapSoknadDTO {
  sakid: string;
  soknadsdatoer: string[];
  statuskode: string;
  erAktiv: boolean;
}

export interface AapVedtakPeriodeDTO {
  fraOgMedDato: string | null;
  tilOgMedDato: string | null;
}

export interface AapVedtakDTO {
  sakid: string;
  kilde: string;
  vedtaksdato: string;
  perioder: AapVedtakPeriodeDTO[];
  erAktivt: boolean;
}

export interface AapStatusDTO {
  soknader: AapSoknadDTO[];
  vedtak: AapVedtakDTO[];
}
