export interface PersonOppgave {
  uuid: string;
  referanseUuid: string;
  fnr: string;
  virksomhetsnummer: string;
  type: PersonOppgaveType;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  opprettet: Date;
  duplikatReferanseUuid: string | null;
}

export enum PersonOppgaveType {
  OPPFOLGINGSPLANLPS = "OPPFOLGINGSPLANLPS",
  DIALOGMOTESVAR = "DIALOGMOTESVAR",
  BEHANDLERDIALOG_SVAR = "BEHANDLERDIALOG_SVAR",
  BEHANDLERDIALOG_MELDING_UBESVART = "BEHANDLERDIALOG_MELDING_UBESVART",
  BEHANDLERDIALOG_MELDING_AVVIST = "BEHANDLERDIALOG_MELDING_AVVIST",
  BEHANDLER_BER_OM_BISTAND = "BEHANDLER_BER_OM_BISTAND",
}
