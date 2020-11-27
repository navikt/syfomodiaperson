import React from "react";
import {
  getLedetekst,
  getSykmeldingOpplysning,
  keyValue,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";
import SykmeldingOpplysning from "./SykmeldingOpplysning";

const UtdypendeOpplysninger = ({ sykmelding, ledetekster }) => {
  const visSeksjon =
    sykmelding.utdypendeOpplysninger.sykehistorie ||
    sykmelding.utdypendeOpplysninger.paavirkningArbeidsevne ||
    sykmelding.utdypendeOpplysninger.resultatAvBehandling ||
    sykmelding.utdypendeOpplysninger.henvisningUtredningBehandling;

  if (
    sykmelding.utdypendeOpplysninger.grupper &&
    sykmelding.utdypendeOpplysninger.grupper.length > 0
  ) {
    return (
      <div className="sykmeldingSeksjon">
        <h4 className="sykmeldingSeksjon__tittel">
          {getLedetekst("din-sykmelding.utdypende.tittel", ledetekster)}
        </h4>

        {sykmelding.utdypendeOpplysninger.grupper.map((gruppe) => {
          return gruppe.sporsmal.map((sporsmal) => {
            return (
              <SykmeldingOpplysning
                key={`${sykmelding.id}-${sporsmal.id}`}
                tittel={getLedetekst(
                  `din-sykmelding.utdypende.${sporsmal.id}.tittel`,
                  ledetekster
                )}
              >
                <p className="opplysning__verdi">{sporsmal.svar}</p>
              </SykmeldingOpplysning>
            );
          });
        })}
      </div>
    );
  }
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">
        {getLedetekst("din-sykmelding.utdypende.tittel", ledetekster)}
      </h4>
      {getSykmeldingOpplysning(
        sykmelding.utdypendeOpplysninger,
        "sykehistorie",
        getLedetekst(
          "din-sykmelding.utdypende.sykehistorie.tittel",
          ledetekster
        )
      )}
      {getSykmeldingOpplysning(
        sykmelding.utdypendeOpplysninger,
        "paavirkningArbeidsevne",
        getLedetekst(
          "din-sykmelding.utdypende.paavirkning.arbeidsevne.tittel",
          ledetekster
        )
      )}
      {getSykmeldingOpplysning(
        sykmelding.utdypendeOpplysninger,
        "resultatAvBehandling",
        getLedetekst(
          "din-sykmelding.utdypende.behandlingsresultat.tittel",
          ledetekster
        )
      )}
      {getSykmeldingOpplysning(
        sykmelding.utdypendeOpplysninger,
        "henvisningUtredningBehandling",
        getLedetekst("din-sykmelding.utdypende.henvisning.tittel", ledetekster)
      )}
    </div>
  );
};

UtdypendeOpplysninger.propTypes = {
  sykmelding: sykmeldingPt,
  ledetekster: keyValue,
};

export default UtdypendeOpplysninger;
