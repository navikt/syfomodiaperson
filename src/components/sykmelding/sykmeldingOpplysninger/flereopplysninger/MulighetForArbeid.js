import React from "react";
import PropTypes from "prop-types";
import {
  getLedetekst,
  getSykmeldingCheckbox,
  getSykmeldingOpplysning,
  keyValue,
  senesteTom,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";
import SykmeldingOpplysning from "./SykmeldingOpplysning";
import { SykmeldingCheckbox } from "../SykmeldingCheckbox";

const fjernAnnet = (array) => {
  if (array.length === 1 && array.indexOf("Annet") > -1) {
    return [];
  }
  return array;
};

const Aarsaker = ({ aarsaker, containerClassName }) => {
  return (
    <div className={containerClassName}>
      {fjernAnnet(aarsaker).map((aarsak, key) => {
        return (
          <SykmeldingCheckbox
            tekst={aarsak}
            key={key}
            className="subopplysning"
          />
        );
      })}
    </div>
  );
};

Aarsaker.propTypes = {
  aarsaker: PropTypes.arrayOf(PropTypes.string),
  containerClassName: PropTypes.string,
};

const MulighetForArbeid = ({ sykmelding, ledetekster }) => {
  const visSeksjon =
    (sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length) ||
    sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433 ||
    (sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length) ||
    sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">
        {getLedetekst("din-sykmelding.mulighet.for.arbeid.tittel", ledetekster)}
      </h4>
      {(sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
        sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length) > 0 ? (
        <SykmeldingOpplysning
          tittel={getLedetekst(
            "din-sykmelding.mulighet.for.arbeid.pasient.ikke.i.arbeid.tittel",
            ledetekster
          )}
        >
          <div>
            {getSykmeldingCheckbox(
              sykmelding.mulighetForArbeid,
              "aktivitetIkkeMulig433",
              getLedetekst(
                "din-sykmelding.mulighet.for.arbeid.medisinsk.tittel",
                ledetekster
              )
            )}
            <Aarsaker
              aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig433}
              containerClassName="js-aktivitetIkkeMulig433hvisJa"
            />
          </div>
        </SykmeldingOpplysning>
      ) : null}
      {(() => {
        let nokkel =
          "din-sykmelding.mulighet.for.arbeid.medisinsk.beskriv.tittel.standard";
        if (sykmelding.startLegemeldtFravaer) {
          const tom = senesteTom(sykmelding.mulighetForArbeid.perioder);
          const ETT_DOGN = 1000 * 60 * 60 * 24;
          const SJU_UKER = 7 * 7;
          const SYTTEN_UKER = 7 * 17;
          const antallDager =
            (tom.getTime() - sykmelding.startLegemeldtFravaer.getTime()) /
              ETT_DOGN +
            1;
          if (antallDager >= SJU_UKER && antallDager < SYTTEN_UKER) {
            nokkel =
              "din-sykmelding.mulighet.for.arbeid.medisinsk.beskriv.tittel.7-uker";
          }
        }
        return getSykmeldingOpplysning(
          sykmelding.mulighetForArbeid,
          "aarsakAktivitetIkkeMulig433",
          getLedetekst(nokkel, ledetekster)
        );
      })()}
      {sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length > 0 ? (
        <SykmeldingOpplysning
          tittel={getLedetekst(
            "din-sykmelding.mulighet.for.arbeid.pasient.ikke.i.arbeid.tittel",
            ledetekster
          )}
        >
          <div>
            {getSykmeldingCheckbox(
              sykmelding.mulighetForArbeid,
              "aktivitetIkkeMulig434",
              getLedetekst(
                "din-sykmelding.mulighet.for.arbeid.forhold.arbeidsplassen.tittel",
                ledetekster
              )
            )}
            <Aarsaker
              aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig434}
              containerClassName="js-aktivitetIkkeMulig434hvisJa"
            />
          </div>
        </SykmeldingOpplysning>
      ) : null}
      {getSykmeldingOpplysning(
        sykmelding.mulighetForArbeid,
        "aarsakAktivitetIkkeMulig434",
        getLedetekst(
          "din-sykmelding.mulighet.for.arbeid.forhold.arbeidsplassen.beskriv.tittel",
          ledetekster
        )
      )}
    </div>
  );
};

MulighetForArbeid.propTypes = {
  sykmelding: sykmeldingPt,
  ledetekster: keyValue,
};

export default MulighetForArbeid;
