import React from "react";
import PropTypes from "prop-types";
import { erUtdypendeOpplysningerInformasjon } from "../../utils/sykmeldinger/sykmeldingUtils";

const tekster = {
  UtdypendeOpplysninger: {
    header: "Utdypende opplysninger ved 8 uker",
    sykehistorieTittel:
      "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon",
    paavirkningArbeidsevneTittel: "Hvordan påvirker sykdommen arbeidsevnen?",
    behandlingsResultatTittel:
      "Har behandlingen frem til nå bedret arbeidsevnen?",
    henvisningTittel:
      "Beskriv pågående og planlagt henvisning, utredning og/eller behandling",
    sykehistoriePunkt63Tittel:
      "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon",
    henvisningUtredningBehandlingPunkt63Tittel:
      "Beskriv pågående og planlagt henvisning, utredning og/eller behandling. Lar dette seg kombinere med delvis arbeid?",
  },
};

export const UtdypendeOpplysninger = ({ sykmelding }) => {
  const utdypendeOpplysninger = sykmelding.utdypendeOpplysninger;
  const skalVise = erUtdypendeOpplysningerInformasjon(sykmelding);
  return (
    skalVise && (
      <div className="sykmeldingMotebehovVisning__avsnitt">
        <h5 className="undertittel">{tekster.UtdypendeOpplysninger.header}</h5>

        {utdypendeOpplysninger.sykehistorie && (
          <div>
            <h6 className="sporsmal">
              {tekster.UtdypendeOpplysninger.sykehistorieTittel}
            </h6>
            <p>{utdypendeOpplysninger.sykehistorie}</p>
          </div>
        )}

        {utdypendeOpplysninger.paavirkningArbeidsevne && (
          <div>
            <h6 className="sporsmal">
              {tekster.UtdypendeOpplysninger.paavirkningArbeidsevneTittel}
            </h6>
            <p>{utdypendeOpplysninger.paavirkningArbeidsevne}</p>
          </div>
        )}

        {utdypendeOpplysninger.resultatAvBehandling && (
          <div>
            <h6 className="sporsmal">
              {tekster.UtdypendeOpplysninger.behandlingsResultatTittel}
            </h6>
            <p>{utdypendeOpplysninger.resultatAvBehandling}</p>
          </div>
        )}

        {utdypendeOpplysninger.henvisningUtredningBehandling && (
          <div>
            <h6 className="sporsmal">
              {tekster.UtdypendeOpplysninger.henvisningTittel}
            </h6>
            <p>{utdypendeOpplysninger.henvisningUtredningBehandling}</p>
          </div>
        )}
        {utdypendeOpplysninger.sykehistoriePunkt63 && (
          <div>
            <h6 className="sporsmal">
              {tekster.UtdypendeOpplysninger.sykehistoriePunkt63Tittel}
            </h6>
            <p>{utdypendeOpplysninger.sykehistoriePunkt63}</p>
          </div>
        )}
        {utdypendeOpplysninger.henvisningUtredningBehandlingPunkt63 && (
          <div>
            <h6 className="sporsmal">
              {
                tekster.UtdypendeOpplysninger
                  .henvisningUtredningBehandlingPunkt63Tittel
              }
            </h6>
            <p>{utdypendeOpplysninger.henvisningUtredningBehandlingPunkt63}</p>
          </div>
        )}
      </div>
    )
  );
};

UtdypendeOpplysninger.propTypes = {
  sykmelding: PropTypes.object,
};

export default UtdypendeOpplysninger;
