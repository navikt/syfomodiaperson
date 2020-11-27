import React from "react";
import PropTypes from "prop-types";
import BoksRad from "./BoksRad";

export const DiagnoseBoks = ({ diagnose, erBiDiagnose = false }) => {
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

DiagnoseBoks.propTypes = {
  diagnose: PropTypes.object,
  erBiDiagnose: PropTypes.bool,
};

export const Diagnoser = ({ hovedDiagnose, biDiagnoser }) => {
  return (
    <div className="sykmeldingMotebehovVisning__diagnoser">
      {hovedDiagnose && <DiagnoseBoks diagnose={hovedDiagnose} />}

      {biDiagnoser.map((diagnose, index) => {
        return <DiagnoseBoks key={index} diagnose={diagnose} erBiDiagnose />;
      })}
    </div>
  );
};

Diagnoser.propTypes = {
  hovedDiagnose: PropTypes.object,
  biDiagnoser: PropTypes.arrayOf(PropTypes.object),
};

export default Diagnoser;
