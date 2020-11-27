export const getTidligsteSendtDato = (soknad) => {
  if (soknad.sendtTilNAVDato && soknad.sendtTilArbeidsgiverDato) {
    return soknad.sendtTilNAVDato > soknad.sendtTilArbeidsgiverDato
      ? soknad.sendtTilArbeidsgiverDato
      : soknad.sendtTilNAVDato;
  }
  return soknad.sendtTilNAVDato || soknad.sendtTilArbeidsgiverDato;
};

export const sorterEtterDato = (soknad1, soknad2) => {
  const dato1 = new Date(getTidligsteSendtDato(soknad1));
  const dato2 = new Date(getTidligsteSendtDato(soknad2));

  if (dato1.getTime() > dato2.getTime()) {
    return -1;
  }
  if (dato1.getTime() < dato2.getTime()) {
    return 1;
  }
  return 0;
};

export const sorterEtterOpprettetDato = (soknad1, soknad2) => {
  if (
    new Date(soknad1.opprettetDato).getTime() >
    new Date(soknad2.opprettetDato).getTime()
  ) {
    return 1;
  }
  if (
    new Date(soknad1.opprettetDato).getTime() <
    new Date(soknad2.opprettetDato).getTime()
  ) {
    return -1;
  }
  return 0;
};

export const sorterEtterPerioder = (soknad1, soknad2) => {
  if (new Date(soknad1.tom).getTime() < new Date(soknad2.tom).getTime()) {
    return 1;
  }
  if (new Date(soknad1.tom).getTime() > new Date(soknad2.tom).getTime()) {
    return -1;
  }
  return 0;
};

export const erSendtTilBeggeMenIkkeSamtidig = (sykepengesoknad) => {
  return (
    sykepengesoknad.sendtTilNAVDato &&
    sykepengesoknad.sendtTilArbeidsgiverDato &&
    sykepengesoknad.sendtTilNAVDato.getTime() !==
      sykepengesoknad.sendtTilArbeidsgiverDato.getTime()
  );
};

export const getSendtTilSuffix = (sykepengesoknad) => {
  if (
    sykepengesoknad.sendtTilArbeidsgiverDato &&
    sykepengesoknad.sendtTilNAVDato
  ) {
    return ".til-arbeidsgiver-og-nav";
  }
  if (sykepengesoknad.sendtTilArbeidsgiverDato) {
    return ".til-arbeidsgiver";
  }
  if (sykepengesoknad.sendtTilNAVDato) {
    return ".til-nav";
  }
  return "";
};
