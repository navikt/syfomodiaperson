import React from "react";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks.ts";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils.ts";
import { BodyShort } from "@navikt/ds-react";

interface Props {
  tid: string;
  sted: string;
  virksomhetsnummer: string;
}

export function ReferatPanelSubtitle({ tid, sted, virksomhetsnummer }: Props) {
  const { virksomhetsnavn } = useVirksomhetQuery(virksomhetsnummer);
  const moteDatoTid = tilDatoMedUkedagOgManedNavnOgKlokkeslett(tid);
  const timeAndPlace = `Møtetidspunkt: ${moteDatoTid} - ${sted}`;
  const arbeidsgiver = `Arbeidsgiver: ${virksomhetsnavn}`;

  return (
    <>
      <BodyShort size="small">{timeAndPlace}</BodyShort>
      <BodyShort size="small">{arbeidsgiver}</BodyShort>
    </>
  );
}
