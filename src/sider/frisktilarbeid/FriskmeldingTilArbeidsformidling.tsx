import React, { ReactElement } from "react";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { FerdigbehandletVedtak } from "@/sider/frisktilarbeid/FerdigbehandletVedtak";
import { VedtakFattet } from "@/sider/frisktilarbeid/VedtakFattet";
import { FattNyttVedtak } from "@/sider/frisktilarbeid/FattNyttVedtak";

export const FriskmeldingTilArbeidsformidling = (): ReactElement => {
  const { data } = useVedtakQuery();
  const vedtak: VedtakResponseDTO | undefined = data[0];
  const isFerdigbehandlet = !!vedtak?.ferdigbehandletAt;
  const isExistingVedtak = !!vedtak;

  if (isExistingVedtak) {
    if (isFerdigbehandlet) {
      return <FerdigbehandletVedtak vedtak={vedtak} />;
    } else {
      return <VedtakFattet vedtak={vedtak} />;
    }
  } else {
    return <FattNyttVedtak />;
  }
};
