import React, { ReactElement } from "react";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { VedtakFattet } from "@/sider/frisktilarbeid/VedtakFattet";
import { VurderFattVedtak } from "@/sider/frisktilarbeid/VurderFattVedtak";

export const FriskmeldingTilArbeidsformidling = (): ReactElement => {
  const { data } = useVedtakQuery();
  const vedtak: VedtakResponseDTO | undefined = data[0];

  if (!vedtak) {
    return <VurderFattVedtak />;
  } else {
    return <VedtakFattet vedtak={vedtak} />;
  }
};
