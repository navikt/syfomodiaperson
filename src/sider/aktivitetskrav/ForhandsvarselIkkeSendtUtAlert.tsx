import { Alert, BodyShort, Label } from "@navikt/ds-react";
import React from "react";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";

const texts = {
  header: "Teknisk feil påvirket forhåndsvarsler mellom 27. februar - 12. mars",
  info: "Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars blitt varslet på riktig måte. I mange av sakene har bruker fått forlenget frist til 9. april 2025, og fristen i Modia er oppdatert tilsvarende. Dersom berørte brukere tar kontakt, skal det gis forlenget frist.",
};

export default function ForhandsvarselIkkeSendtUtAlert() {
  const { data } = useAktivitetskravQuery();
  const start = new Date("2025-02-27T12:00:00Z");
  const end = new Date("2025-03-10T00:00:00Z");

  const isForhandsvarsel = (vurdering: AktivitetskravVurderingDTO) =>
    vurdering.status === AktivitetskravStatus.FORHANDSVARSEL;
  const isBetweenDates = (vurdering: AktivitetskravVurderingDTO) =>
    start <= new Date(vurdering.createdAt) &&
    new Date(vurdering.createdAt) <= end;

  const showVarsel = data
    .flatMap((aktivitetskrav) =>
      aktivitetskrav.vurderinger.filter(isForhandsvarsel)
    )
    .some(isBetweenDates);

  return (
    showVarsel && (
      <Alert
        variant={"error"}
        size={"medium"}
        className={"mb-2"}
        contentMaxWidth={false}
      >
        <Label>{texts.header}</Label>
        <BodyShort>{texts.info}</BodyShort>
      </Alert>
    )
  );
}
