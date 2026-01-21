import React from "react";
import { SykmeldingDiagnose } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, HGrid } from "@navikt/ds-react";

const texts = {
  diagnosekode: "Diagnosekode",
};

interface Props {
  diagnose: SykmeldingDiagnose;
  erHovedDiagnose: boolean;
}

export function Diagnose({ diagnose, erHovedDiagnose }: Props) {
  const tittel = erHovedDiagnose ? "Diagnose" : "Bidiagnose";
  return (
    <HGrid gap="space-16" columns={2}>
      <div>
        <BodyShort size="small" weight="semibold">
          {tittel}
        </BodyShort>
        <BodyShort size="small">{diagnose.diagnose}</BodyShort>
      </div>
      <div>
        <BodyShort size="small" weight="semibold">
          {texts.diagnosekode}
        </BodyShort>
        <BodyShort size="small">
          {diagnose.diagnosekode} {diagnose.diagnosesystem}
        </BodyShort>
      </div>
    </HGrid>
  );
}
