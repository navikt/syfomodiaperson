export interface UnntaksvurderingDTO {
  unntaksvurderinger: [
    {
      uuid: string;
      fnr: string;
      organisasjonsnummer: string;
      organisasjonsnavn: string;
      meldtTidspunkt: string;
    },
  ];
}
