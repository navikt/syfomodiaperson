import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "nav-frontend-skjema";
import {
  erMulighetForArbeidInformasjon,
  finnAvventendeSykmeldingTekst,
} from "../../utils/sykmeldinger/sykmeldingUtils";

const tekster = {
  mulighetForArbeid: {
    avventende: {
      tittel: "Innspill til arbeidsgiveren ved avventende sykmelding",
    },
    beskrivelse: "Nærmere beskrivelse",
    medisinskAarsak: {
      tittel: "Det er medisinske årsaker som hindrer arbeidsrelatert aktivitet",
    },
    forholdPaaArbeidsplass: {
      tittel:
        "Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet",
    },
  },
};

const AvventendeSykmelding = ({ avventendeTekst }) => {
  return (
    <div>
      <h5 className="undertittel">
        {tekster.mulighetForArbeid.avventende.tittel}
      </h5>
      <p>{avventendeTekst}</p>
    </div>
  );
};

AvventendeSykmelding.propTypes = {
  avventendeTekst: PropTypes.string,
};

const AktivitetIkkeMulig = ({ beskrivelse, ikkeMuligListe, tittel }) => {
  return (
    <div className="MulighetForArbeid">
      <h5 className="undertittel">{tittel}</h5>
      {ikkeMuligListe.map((ikkeMuligTekst, index) => {
        return (
          <Checkbox
            key={index}
            className="sykmeldingMotebehovVisning__checkbox"
            label={ikkeMuligTekst}
            checked
            disabled
          />
        );
      })}
      {beskrivelse && [
        <h6 key={0} className="sporsmal">
          {tekster.mulighetForArbeid.beskrivelse}
        </h6>,
        <p key={1}>{beskrivelse}</p>,
      ]}
    </div>
  );
};

AktivitetIkkeMulig.propTypes = {
  beskrivelse: PropTypes.string,
  ikkeMuligListe: PropTypes.arrayOf(PropTypes.string),
  tittel: PropTypes.string,
};

export const MulighetForArbeid = ({ sykmelding }) => {
  const mulighetForArbeid = sykmelding.mulighetForArbeid;
  const avventendeTekst = finnAvventendeSykmeldingTekst(sykmelding);
  const aktivitetIkkeMulig433 = mulighetForArbeid.aktivitetIkkeMulig433;
  const aarsakAktivitetIkkeMulig433 =
    mulighetForArbeid.aarsakAktivitetIkkeMulig433;
  const aktivitetIkkeMulig434 = mulighetForArbeid.aktivitetIkkeMulig434;
  const aarsakAktivitetIkkeMulig434 =
    mulighetForArbeid.aarsakAktivitetIkkeMulig434;
  const skalVise = erMulighetForArbeidInformasjon(sykmelding);
  return (
    (skalVise || !!avventendeTekst) && (
      <div className="sykmeldingMotebehovVisning__avsnitt">
        {!!avventendeTekst && (
          <AvventendeSykmelding avventendeTekst={avventendeTekst} />
        )}
        {aktivitetIkkeMulig433 && aktivitetIkkeMulig433.length > 0 && (
          <AktivitetIkkeMulig
            beskrivelse={aarsakAktivitetIkkeMulig433}
            ikkeMuligListe={aktivitetIkkeMulig433}
            tittel={tekster.mulighetForArbeid.medisinskAarsak.tittel}
          />
        )}
        {aktivitetIkkeMulig434 && aktivitetIkkeMulig434.length > 0 && (
          <AktivitetIkkeMulig
            beskrivelse={aarsakAktivitetIkkeMulig434}
            ikkeMuligListe={aktivitetIkkeMulig434}
            tittel={tekster.mulighetForArbeid.forholdPaaArbeidsplass.tittel}
          />
        )}
      </div>
    )
  );
};

MulighetForArbeid.propTypes = {
  sykmelding: PropTypes.object,
};

export default MulighetForArbeid;
