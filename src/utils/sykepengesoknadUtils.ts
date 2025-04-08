import {
  Soknadstype,
  SporsmalDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  utland: "Søknad om å beholde sykepenger utenfor EØS\n",
  reisetilskudd: "Søknad om reisetilskudd",
  gradertReisetilskudd: "Søknad om gradert reisetilskudd",
  friskmeldingTilArbeidsformidling:
    "Søknad om sykepenger - Friskmelding til arbeidsformidling",
  tittel: "Søknad om sykepenger",
};

export const getTidligsteSendtDato = (soknad: any) => {
  if (soknad.sendtTilNAVDato && soknad.sendtTilArbeidsgiverDato) {
    return soknad.sendtTilNAVDato > soknad.sendtTilArbeidsgiverDato
      ? soknad.sendtTilArbeidsgiverDato
      : soknad.sendtTilNAVDato;
  }
  return soknad.sendtTilNAVDato || soknad.sendtTilArbeidsgiverDato;
};

export const sorterEtterDato = (
  soknad1: SykepengesoknadDTO,
  soknad2: SykepengesoknadDTO
) => {
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

export const sorterEtterOpprettetDato = (
  soknad1: SykepengesoknadDTO,
  soknad2: SykepengesoknadDTO
) => {
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

export const sorterEtterPerioder = (
  soknad1: SykepengesoknadDTO,
  soknad2: SykepengesoknadDTO
) => {
  if (new Date(soknad1.tom).getTime() < new Date(soknad2.tom).getTime()) {
    return 1;
  }
  if (new Date(soknad1.tom).getTime() > new Date(soknad2.tom).getTime()) {
    return -1;
  }
  return 0;
};

export const erSendtTilBeggeMenIkkeSamtidig = (
  sykepengesoknad: SykepengesoknadDTO
) => {
  return (
    sykepengesoknad.sendtTilNAVDato &&
    sykepengesoknad.sendtTilArbeidsgiverDato &&
    sykepengesoknad.sendtTilNAVDato.getTime() !==
      sykepengesoknad.sendtTilArbeidsgiverDato.getTime()
  );
};

export const getSendtTilSuffix = (sykepengesoknad: SykepengesoknadDTO) => {
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

export const erVaerKlarOverAt = (s: SporsmalDTO): boolean =>
  s.tag === "VAER_KLAR_OVER_AT";

export const erTilSlutt = (s: SporsmalDTO): boolean => s.tag === "TIL_SLUTT";

export const tittelFromSoknadstype = (soknadstype: Soknadstype) => {
  switch (soknadstype) {
    case Soknadstype.OPPHOLD_UTLAND: {
      return texts.utland;
    }
    case Soknadstype.REISETILSKUDD: {
      return texts.reisetilskudd;
    }
    case Soknadstype.GRADERT_REISETILSKUDD: {
      return texts.gradertReisetilskudd;
    }
    case Soknadstype.FRISKMELDT_TIL_ARBEIDSFORMIDLING: {
      return texts.friskmeldingTilArbeidsformidling;
    }
    default: {
      return texts.tittel;
    }
  }
};
