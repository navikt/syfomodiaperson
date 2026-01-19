import React from "react";
import { SykmeldingDiagnose } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { Column, Row } from "nav-frontend-grid";

interface DiagnoseBoksProps {
  diagnose: SykmeldingDiagnose;
  erHovedDiagnose: boolean;
}

function DiagnoseBoks({ diagnose, erHovedDiagnose }: DiagnoseBoksProps) {
  const tittel = erHovedDiagnose ? "Diagnose" : "Bidiagnose";
  return (
    <div className="sykmeldingMotebehovVisning__diagnoseBoks">
      <Row>
        <Column className="col-sm-6">
          <p className="sykmeldingMotebehovVisning__boksRad--tittel">
            {tittel}
          </p>
          <p className="sykmeldingMotebehovVisning__boksRad--tekst">
            {diagnose.diagnose}
          </p>
        </Column>
        <Column className="col-sm-6">
          <p className="sykmeldingMotebehovVisning__boksRad--tittel">
            Diagnosekode
          </p>
          <p className="sykmeldingMotebehovVisning__boksRad--tekst">
            {diagnose.diagnosekode} {diagnose.diagnosesystem}
          </p>
        </Column>
      </Row>
    </div>
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
    <div className="sykmeldingMotebehovVisning__diagnoser">
      {hovedDiagnose && (
        <DiagnoseBoks diagnose={hovedDiagnose} erHovedDiagnose />
      )}

      {biDiagnoser.map((diagnose, index) => (
        <DiagnoseBoks key={index} diagnose={diagnose} erHovedDiagnose={false} />
      ))}
    </div>
  );
}
