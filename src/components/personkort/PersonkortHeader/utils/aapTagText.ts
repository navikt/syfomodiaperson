import { AapStatusDTO } from "@/data/aap/aapTypes";

import dayjs from "dayjs";

const texts = {
  aktivtVedtak: "Vedtak AAP",
  aktivSoknad: "Søkt AAP",
  tidligereVedtak: "Vedtak AAP siste 12mnd",
};

/**
 * Finner teksten som skal vises i AAP-taggen, eller undefined hvis taggen ikke skal vises.
 */
export function getAapTagText(aapStatus: AapStatusDTO): string | undefined {
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
