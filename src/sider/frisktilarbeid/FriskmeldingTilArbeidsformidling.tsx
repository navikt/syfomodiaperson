import React, { useState } from "react";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import FattVedtakSkjema from "@/sider/frisktilarbeid/FattVedtakSkjema";
import NyttVedtak from "@/sider/frisktilarbeid/NyttVedtak";
import { VedtakFattet } from "@/sider/frisktilarbeid/VedtakFattet";

export function FriskmeldingTilArbeidsformidling() {
  const { data } = useVedtakQuery();
  const [isNyVurderingStarted, setIsNyVurderingStarted] = useState(false);

  const vedtak: VedtakResponseDTO | undefined = data[0];
  const isFerdigbehandlet = !!vedtak?.ferdigbehandletAt;
  const isExistingVedtak = !!vedtak;

  if (isExistingVedtak) {
    if (isFerdigbehandlet) {
      if (!isNyVurderingStarted) {
        return <NyttVedtak setIsNyVurderingStarted={setIsNyVurderingStarted} />;
      } else {
        return <FattVedtakSkjema />;
      }
    } else {
      return (
        <VedtakFattet
          vedtak={vedtak}
          setIsNyVurderingStarted={setIsNyVurderingStarted}
        />
      );
    }
  } else {
    if (!isNyVurderingStarted) {
      return <NyttVedtak setIsNyVurderingStarted={setIsNyVurderingStarted} />;
    } else {
      return <FattVedtakSkjema />;
    }
  }
}
