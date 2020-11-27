const texts = {
  tilArbeidsgiverOgNav:
    '<a href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Utbetalinger/Utbetalinger/Utbetalingsdatoer%2C+feriepenger+og+skattetrekk?kap=499628" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
  tilNav:
    'Sykepenger utbetales etter at NAV har innvilget søknaden. <a href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Utbetalinger/Utbetalinger/Utbetalingsdatoer%2C+feriepenger+og+skattetrekk?kap=499628" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
  tilArbeidsgiver: "Du får sykepengene utbetalt fra arbeidsgiveren din.",
};

const hentSykepengetekst = (soknad) => {
  return (soknad.sendtTilNAVDato || soknad.innsendtDato) &&
    soknad.sendtTilArbeidsgiverDato
    ? { __html: texts.tilArbeidsgiverOgNav }
    : soknad.sendtTilNAVDato || soknad.innsendtDato
    ? { __html: texts.tilNav }
    : { __html: texts.tilArbeidsgiver };
};

export default hentSykepengetekst;
