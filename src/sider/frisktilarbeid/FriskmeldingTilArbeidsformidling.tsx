import React, { useState } from "react";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { FerdigbehandletVedtak } from "@/sider/frisktilarbeid/FerdigbehandletVedtak";
import { VedtakFattet } from "@/sider/frisktilarbeid/VedtakFattet";
import { FattVedtakSkjema } from "@/sider/frisktilarbeid/FattVedtakSkjema";

export function FriskmeldingTilArbeidsformidling() {
  const { data } = useVedtakQuery();
  const [isNyVurderingStarted, setStartNyVurdering] = useState(false);

  const vedtak: VedtakResponseDTO | undefined = data[0];
  const isFerdigbehandlet = !!vedtak?.ferdigbehandletAt;
  const isExistingVedtak = !!vedtak;

  if (isExistingVedtak) {
    if (isFerdigbehandlet) {
      if (!isNyVurderingStarted) {
        return (
          <FerdigbehandletVedtak
            vedtak={vedtak}
            setStartNyVurdering={setStartNyVurdering}
          />
        );
      } else {
        return <FattVedtakSkjema />;
      }
    } else {
      return <VedtakFattet vedtak={vedtak} />;
    }
  } else {
    return <FattVedtakSkjema />;
  }
}
