import React from "react";
import BoksRad from "./BoksRad";
import { SykmeldingDiagnose } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface DiagnoseBoksProps {
  diagnose: SykmeldingDiagnose;
  erBiDiagnose?: boolean;
}

export const DiagnoseBoks = ({ diagnose, erBiDiagnose }: DiagnoseBoksProps) => {
  const diagnoseTittel = erBiDiagnose ? "Bidiagnose" : "Diagnose";
  const diagnosekodeTittel = "Diagnosekode";

  return (
    <div className="sykmeldingMotebehovVisning__diagnoseBoks">
      <BoksRad
        kolonne1Tekst={diagnoseTittel}
        kolonne2Tekst={diagnosekodeTittel}
        erTittel
      />
      <BoksRad
        kolonne1Tekst={diagnose.diagnose}
        kolonne2Tekst={`${diagnose.diagnosekode} ${diagnose.diagnosesystem}`}
      />
    </div>
  );
};

interface DiagnoserProps {
  biDiagnoser: SykmeldingDiagnose[];
  hovedDiagnose?: SykmeldingDiagnose;
}

export default function Diagnoser(diagnoserProps: DiagnoserProps) {
  const biDiagnoser = diagnoserProps.biDiagnoser;
  const hovedDiagnose = diagnoserProps.hovedDiagnose;
  return (
    <div className="sykmeldingMotebehovVisning__diagnoser">
      {hovedDiagnose && <DiagnoseBoks diagnose={hovedDiagnose} />}

      {biDiagnoser.map((diagnose, index) => {
        return <DiagnoseBoks key={index} diagnose={diagnose} erBiDiagnose />;
      })}
    </div>
  );
}
