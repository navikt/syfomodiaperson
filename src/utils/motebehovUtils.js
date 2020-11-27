import { dagerMellomDatoer } from "./datoUtils";

export const sorterMotebehovDataEtterDato = (a, b) => {
  return b.opprettetDato === a.opprettetDato
    ? 0
    : b.opprettetDato > a.opprettetDato
    ? 1
    : -1;
};

export const finnNyesteMotebehovsvarFraHverDeltaker = (
  sortertMotebehovListe
) => {
  return sortertMotebehovListe.filter((motebehov1, index) => {
    return (
      sortertMotebehovListe.findIndex((motebehov2) => {
        return motebehov1.opprettetAv === motebehov2.opprettetAv;
      }) === index
    );
  });
};

export const finnArbeidstakerMotebehovSvar = (motebehovListe) => {
  return motebehovListe.find((motebehov) => {
    return motebehov.opprettetAv === motebehov.aktorId;
  });
};
export const OPPFOLGINGSFORLOP_MOTEBEHOV_START_DAGER = 16 * 7;
export const OPPFOLGINGSFORLOP_MOTEBEHOV_SLUTT_DAGER = 26 * 7;

export const erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker = (
  startOppfolgingsdato
) => {
  const oppfoelgingstilfelleStartDato = new Date(startOppfolgingsdato);
  oppfoelgingstilfelleStartDato.setHours(0, 0, 0, 0);
  const dagensDato = new Date();
  dagensDato.setHours(0, 0, 0, 0);

  const antallDagerSidenOppfoelgingsTilfelleStart = dagerMellomDatoer(
    oppfoelgingstilfelleStartDato,
    dagensDato
  );

  return (
    antallDagerSidenOppfoelgingsTilfelleStart >=
      OPPFOLGINGSFORLOP_MOTEBEHOV_START_DAGER &&
    antallDagerSidenOppfoelgingsTilfelleStart <
      OPPFOLGINGSFORLOP_MOTEBEHOV_SLUTT_DAGER
  );
};

export const erOppfolgingstilfelleSluttDatoPassert = (sluttOppfolgingsdato) => {
  const oppfolgingstilfelleSluttDato = new Date(sluttOppfolgingsdato);
  oppfolgingstilfelleSluttDato.setHours(0, 0, 0, 0);
  const dagensDato = new Date();
  dagensDato.setHours(0, 0, 0, 0);

  return dagensDato > oppfolgingstilfelleSluttDato;
};

export const harArbeidstakerSvartPaaMotebehov = (motebehovData) => {
  return !!finnArbeidstakerMotebehovSvar(motebehovData);
};

const erAlleMotebehovSvarBehandlet = (motebehovListe) => {
  return (
    motebehovListe.filter((motebehov) => {
      return (
        motebehov.motebehovSvar &&
        motebehov.motebehovSvar.harMotebehov &&
        !motebehov.behandletTidspunkt
      );
    }).length === 0
  );
};

export const erMotebehovBehandlet = (motebehovListe) => {
  return erAlleMotebehovSvarBehandlet(motebehovListe);
};

export const harUbehandletMotebehov = (motebehovListe) => {
  return !erAlleMotebehovSvarBehandlet(motebehovListe);
};

export const hentSistBehandletMotebehov = (motebehovListe) => {
  return (
    [...motebehovListe].sort((mb1, mb2) => {
      return mb2.behandletTidspunkt > mb1.behandletTidspunkt;
    })[0] || {}
  );
};

export const motebehovlisteMedKunJaSvar = (motebehovliste) => {
  return motebehovliste.filter((motebehov) => {
    return motebehov.motebehovSvar && motebehov.motebehovSvar.harMotebehov;
  });
};
