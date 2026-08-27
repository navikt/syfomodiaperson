import React, { useState } from "react";
import {
  useVedtakQuery,
  useVilkarForVedtakQuery,
} from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import FattVedtakSkjema from "@/sider/frisktilarbeid/FattVedtakSkjema";
import NyttVedtak from "@/sider/frisktilarbeid/NyttVedtak";
import VedtakFattet from "@/sider/frisktilarbeid/VedtakFattet";

export default function FriskmeldingTilArbeidsformidling() {
  const { data } = useVedtakQuery();
  const { data: vilkar, isPending: isVilkarPending } =
    useVilkarForVedtakQuery();
  const [isNyVurderingStarted, setIsNyVurderingStarted] = useState(false);

  const vedtak: VedtakResponseDTO | undefined = data[0];
  const isFerdigbehandlet = !!vedtak?.ferdigbehandletAt;

  if (vedtak && !isFerdigbehandlet) {
    return (
      <VedtakFattet
        vedtak={vedtak}
        setIsNyVurderingStarted={setIsNyVurderingStarted}
      />
    );
  }

  if (!isNyVurderingStarted || !vilkar?.arbeidssokerFom) {
    return (
      <NyttVedtak
        setIsNyVurderingStarted={setIsNyVurderingStarted}
        isRegisteredArbeidssoker={!!vilkar?.isArbeidssoker}
        arbeidssokerFom={vilkar?.arbeidssokerFom}
        isVilkarPending={isVilkarPending}
      />
    );
  }

  return <FattVedtakSkjema arbeidssokerFom={vilkar.arbeidssokerFom} />;
}
