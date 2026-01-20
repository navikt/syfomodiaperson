import React from "react";
import { SykmeldingDiagnose } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, HGrid } from "@navikt/ds-react";

interface DiagnoseBoksProps {
  diagnose: SykmeldingDiagnose;
  erHovedDiagnose: boolean;
}

function DiagnoseBoks({ diagnose, erHovedDiagnose }: DiagnoseBoksProps) {
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
          Diagnosekode
        </BodyShort>
        <BodyShort size="small">
          {diagnose.diagnosekode} {diagnose.diagnosesystem}
        </BodyShort>
      </div>
    </HGrid>
  );
}

interface DiagnoserProps {
  biDiagnoser: SykmeldingDiagnose[];
  hovedDiagnose?: SykmeldingDiagnose;
}

export default function Diagnoser(diagnoserProps: DiagnoserProps) {
  const biDiagnoser = diagnoserProps.biDiagnoser;
  const hovedDiagnose = diagnoserProps.hovedDiagnose;
  return (
    <>
      {hovedDiagnose && (
        <DiagnoseBoks diagnose={hovedDiagnose} erHovedDiagnose />
      )}

      {biDiagnoser.map((diagnose, index) => (
          <DiagnoseBoks
            key={index}
            diagnose={diagnose}
            erHovedDiagnose={false}
          />
      ))}
    </>
  );
}
