import React from "react";
import PropTypes from "prop-types";
import { erBedringAvArbeidsevnenInformasjon } from "../../utils/sykmeldinger/sykmeldingUtils";

const tekster = {
  bedreArbeidsevnen: {
    header: "Hva skal til for å bedre arbeidsevnen?",
    tilretteleggingTittel:
      "Tilrettelegging/hensyn som bør tas på arbeidsplassen. Beskriv",
    tiltakNavTittel: "Tiltak i regi av NAV. Beskriv",
    tiltakAndreTittel: "Eventuelle andre innspill til NAV. Beskriv",
  },
};

export const BedreArbeidsevnen = ({ sykmelding }) => {
  const arbeidsevne = sykmelding.arbeidsevne;
  return (
    !!erBedringAvArbeidsevnenInformasjon(sykmelding) && (
      <div className="sykmeldingMotebehovVisning__avsnitt">
        <h5 className="undertittel">{tekster.bedreArbeidsevnen.header}</h5>

        {arbeidsevne.tilretteleggingArbeidsplass && (
          <div>
            <h6 className="sporsmal">
              {tekster.bedreArbeidsevnen.tilretteleggingTittel}
            </h6>
            <p>{arbeidsevne.tilretteleggingArbeidsplass}</p>
          </div>
        )}

        {arbeidsevne.tiltakNAV && (
          <div>
            <h6 className="sporsmal">
              {tekster.bedreArbeidsevnen.tiltakNavTittel}
            </h6>
            <p>{arbeidsevne.tiltakNAV}</p>
          </div>
        )}

        {arbeidsevne.tiltakAndre && (
          <div>
            <h6 className="sporsmal">
              {tekster.bedreArbeidsevnen.tiltakAndreTittel}
            </h6>
            <p>{arbeidsevne.tiltakAndre}</p>
          </div>
        )}
      </div>
    )
  );
};

BedreArbeidsevnen.propTypes = {
  sykmelding: PropTypes.object,
};

export default BedreArbeidsevnen;
