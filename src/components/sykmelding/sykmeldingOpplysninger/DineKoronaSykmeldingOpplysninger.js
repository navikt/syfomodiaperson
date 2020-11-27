import React from "react";
import PropTypes from "prop-types";
import {
  getLedetekst,
  keyValue,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";
import SykmeldingNokkelOpplysning from "./SykmeldingNokkelOpplysning";
import SykmeldingPerioder from "./SykmeldingPerioder";

const DineKoronaSykmeldingOpplysninger = ({
  sykmelding,
  ledetekster,
  Overskrift = "h2",
}) => {
  return (
    <div className="dine-opplysninger">
      <Overskrift className="js-din-sykmelding-tittel typo-innholdstittel blokk-l">
        Dine opplysninger
      </Overskrift>
      <div className="blokk-l side-innhold fjern-margin-bottom">
        <SykmeldingPerioder
          perioder={sykmelding.mulighetForArbeid.perioder}
          ledetekster={ledetekster}
        />
        {sykmelding.diagnose.hoveddiagnose ? (
          <div className="hoveddiagnose">
            <div className="rad-container">
              <SykmeldingNokkelOpplysning
                className="nokkelopplysning--hoveddiagnose"
                tittel={getLedetekst(
                  "din-sykmelding.diagnose.tittel",
                  ledetekster
                )}
              >
                <div>
                  <p className="js-hoveddiagnose">
                    {sykmelding.diagnose.hoveddiagnose.diagnose}
                  </p>
                </div>
              </SykmeldingNokkelOpplysning>
              <div className="nokkelopplysning nokkelopplysning--hoveddiagnose js-hoveddiagnose-kode-container">
                <div className="medHjelpetekst">
                  <h3 className="nokkelopplysning__tittel">
                    {getLedetekst(
                      "din-sykmelding.diagnosekode.tittel",
                      ledetekster
                    )}
                  </h3>
                </div>
                <p>
                  <span className="js-hoveddiagnose-kode">
                    {sykmelding.diagnose.hoveddiagnose.diagnosekode}
                  </span>
                  &nbsp;
                  <span className="js-hoveddiagnose-system">
                    {sykmelding.diagnose.hoveddiagnose.diagnosesystem}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

DineKoronaSykmeldingOpplysninger.propTypes = {
  sykmelding: sykmeldingPt,
  ledetekster: keyValue,
  Overskrift: PropTypes.string,
};
export default DineKoronaSykmeldingOpplysninger;
