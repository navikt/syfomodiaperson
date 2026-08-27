import { Tag } from "@navikt/ds-react";
import { AapStatusDTO } from "@/data/aap/aapTypes";
import React from "react";

const texts = {
  aktivtVedtak: "Vedtak AAP",
  aktivSoknad: "Søkt AAP",
  tidligereVedtak: "Vedtak AAP siste 12mnd",
};

interface Props {
  aapStatus: AapStatusDTO;
}

export function AapTag({ aapStatus }: Props) {
  const ettArSiden = new Date();
  ettArSiden.setFullYear(ettArSiden.getFullYear() - 1);

  const hasAktivtVedtak = aapStatus.vedtak.some((vedtak) => vedtak.erAktivt);
  if (hasAktivtVedtak) {
    return (
      <Tag data-color="info" variant="outline" size="small">
        {texts.aktivtVedtak}
      </Tag>
    );
  }

  const hasAktivSoknad = aapStatus.soknader.some((soknad) => soknad.erAktiv);
  if (hasAktivSoknad) {
    return (
      <Tag data-color="info" variant="outline" size="small">
        {texts.aktivSoknad}
      </Tag>
    );
  }

  const hasTidligereVedtak = aapStatus.vedtak.some((vedtak) =>
    vedtak.perioder.some((periode) => {
      if (!periode.tilOgMedDato) return false;
      const tilOgMed = new Date(periode.tilOgMedDato).getTime();
      return !Number.isNaN(tilOgMed) && tilOgMed >= ettArSiden.getTime();
    }),
  );

  if (hasTidligereVedtak) {
    return (
      <Tag data-color="info" variant="outline" size="small">
        {texts.tidligereVedtak}
      </Tag>
    );
  }

  return null;
}
