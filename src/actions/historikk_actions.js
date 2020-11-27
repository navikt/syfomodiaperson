export function hentHistorikkFeilet(kilde) {
  return {
    type: `HENT_HISTORIKK_FEILET_${kilde}`,
  };
}

export function henterHistorikk(kilde) {
  return {
    type: `HENTER_HISTORIKK_${kilde}`,
  };
}

export function hentHistorikk(fnr, kilde) {
  return {
    type: `HENT_HISTORIKK_${kilde}_FORESPURT`,
    fnr,
  };
}

export function historikkHentet(data, kilde) {
  return {
    type: `HISTORIKK_HENTET_${kilde}`,
    data,
  };
}
