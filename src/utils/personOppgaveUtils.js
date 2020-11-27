export const isPersonOppgaveBehandlet = (personOppgave) => {
  return !!(personOppgave && personOppgave.behandletTidspunkt);
};
