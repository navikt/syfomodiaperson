export interface UnntaksvurderingDTO {
  unntaksvurderinger: Unntaksvurdering[];
}

export interface Unntaksvurdering {
  uuid: string;
  fnr: string;
  organisasjonsnummer: string;
  organisasjonsnavn: string;
  meldtTidspunkt: string;
}
