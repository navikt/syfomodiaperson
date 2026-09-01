import { Tag } from "@navikt/ds-react";
import { AapStatusDTO } from "@/data/aap/aapTypes";
import React from "react";
import dayjs from "dayjs";

const texts = {
  aktivtVedtak: "Vedtak AAP",
  aktivSoknad: "Søkt AAP",
  tidligereVedtak: "Vedtak AAP siste 12mnd",
};

function getAapTagText(aapStatus: AapStatusDTO): string | undefined {
  const hasAktivtVedtak = aapStatus.vedtak.some((vedtak) => vedtak.erAktivt);
  if (hasAktivtVedtak) {
    return texts.aktivtVedtak;
  }

  const hasAktivSoknad = aapStatus.soknader.some((soknad) => soknad.erAktiv);
  if (hasAktivSoknad) {
    return texts.aktivSoknad;
  }

  const oneYearAgo = dayjs().subtract(1, "year");
  const hasTidligereVedtak = aapStatus.vedtak.some((vedtak) =>
    vedtak.perioder.some((periode) => {
      const tilOgMedDato = dayjs(periode.tilOgMedDato);
      return (
        tilOgMedDato.isValid() && !tilOgMedDato.isBefore(oneYearAgo, "day")
      );
    }),
  );

  if (hasTidligereVedtak) {
    return texts.tidligereVedtak;
  }
}

interface Props {
  aapStatus: AapStatusDTO;
}

export function AapTag({ aapStatus }: Props) {
  const tagText = getAapTagText(aapStatus);

  return tagText ? (
    <Tag data-color="info" variant="outline" size="small">
      {tagText}
    </Tag>
  ) : null;
}
