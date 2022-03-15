const texts = {
  geografisk:
    "Du har ikke tilgang til å se denne personen fordi den har geografisk tilhørighet som du ikke har tilgang til",
  syfo:
    "Alle veiledere og saksbehandlere som har behov for å se opplysninger om sykefravær og sykefraværsoppfølging bør ha tilgang. Din lokale identansvarlige kan tildele tilgangen som heter «sykefraværsoppfølging»",
  kode6: "Brukeren er registrert med skjermingskode 6.",
  kode7: "Brukeren er registrert med skjermingskode 7.",
  egenAnsatt:
    "Du har ikke tilgang til å se personer som er registrert som egenansatt.",
  genericError: "Det skjedde en feil",
};

export const hentBegrunnelseTekst = (begrunnelse: string | null): string => {
  let begrunnelseTekst = texts.genericError;
  if (begrunnelse === "GEOGRAFISK") {
    begrunnelseTekst = texts.geografisk;
  } else if (begrunnelse === "SYFO") {
    begrunnelseTekst = texts.syfo;
  } else if (begrunnelse === "KODE6") {
    begrunnelseTekst = texts.kode6;
  } else if (begrunnelse === "KODE7") {
    begrunnelseTekst = texts.kode7;
  } else if (begrunnelse === "EGEN_ANSATT") {
    begrunnelseTekst = texts.egenAnsatt;
  }

  return begrunnelseTekst;
};
