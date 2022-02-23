export interface PersonOppgave {
  uuid: string;
  referanseUuid: string;
  fnr: string;
  virksomhetsnummer: string;
  type: string;
  behandletTidspunkt: Date;
  behandletVeilederIdent: string;
  opprettet: Date;
}

export const PersonOppgaveType = {
  OPPFOLGINGSPLANLPS: "OPPFOLGINGSPLANLPS",
};
