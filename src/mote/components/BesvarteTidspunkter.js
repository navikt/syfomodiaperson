import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { keyValue } from "@navikt/digisyfo-npm";
import {
  BRUKER,
  ARBEIDSGIVER,
  NAV_VEILEDER,
  MULIGE_SVAR,
} from "../../konstanter";
import { motePt, motealternativPt, motedeltakertypePt } from "../../propTypes";
import { getSvar } from "../../utils/moteplanleggerUtils";
import SvarMedIkon, { NavKan } from "./SvarMedIkon";
import DatoOgTid from "./DatoOgTid";

const texts = {
  bekreft: "Bekreft tidspunkt",
};

const BesvarteTidspunkter = ({
  mote,
  alternativer,
  deltakertype = BRUKER,
  ledetekster,
  fnr,
}) => {
  const arbeidsgiver = mote.deltakere.filter((d) => {
    return d.type === ARBEIDSGIVER;
  })[0];
  const bruker = mote.deltakere.filter((d) => {
    return d.type === BRUKER;
  })[0];

  let forsteDeltaker = bruker;
  let andreDeltaker = arbeidsgiver;

  if (deltakertype === ARBEIDSGIVER) {
    forsteDeltaker = arbeidsgiver;
    andreDeltaker = bruker;
  }

  return (
    <ol className="motetidspunkter motetidspunkter--besvarteTidspunkter">
      {alternativer
        .sort((a, b) => {
          if (a.tid > b.tid) {
            return 1;
          }
          if (a.tid < b.tid) {
            return -1;
          }
          return 0;
        })
        .map((field, index) => {
          const forsteDeltakersSvar =
            forsteDeltaker &&
            forsteDeltaker.svar.filter((s) => {
              return s.id === field.id;
            })[0];
          const andreDeltakersSvar =
            andreDeltaker &&
            andreDeltaker.svar.filter((s) => {
              return s.id === field.id;
            })[0];
          const _forsteDeltaker =
            forsteDeltaker &&
            Object.assign({}, forsteDeltaker, {
              navn: deltakertype === NAV_VEILEDER ? forsteDeltaker.navn : "Du",
            });

          let className = "motetidspunkt--besvart";
          if (
            (!_forsteDeltaker ||
              getSvar(forsteDeltakersSvar, _forsteDeltaker.svartidspunkt) ===
                MULIGE_SVAR.PASSER) &&
            (!andreDeltaker ||
              getSvar(andreDeltakersSvar, andreDeltaker.svartidspunkt) ===
                MULIGE_SVAR.PASSER)
          ) {
            className = "gronnRammeTidspunkt";
          }

          return (
            <li
              className={`js-alternativ motetidspunkt ${className}`}
              key={index}
            >
              <DatoOgTid tid={field.tid} />
              <ul className="alternativsvar">
                {forsteDeltaker && (
                  <SvarMedIkon
                    bruker={_forsteDeltaker}
                    svar={forsteDeltakersSvar}
                    ledetekster={ledetekster}
                  />
                )}
                {andreDeltaker && (
                  <SvarMedIkon
                    bruker={andreDeltaker}
                    svar={andreDeltakersSvar}
                    ledetekster={ledetekster}
                  />
                )}
                {deltakertype !== NAV_VEILEDER && (
                  <NavKan ledetekster={ledetekster} />
                )}
              </ul>
              {deltakertype === NAV_VEILEDER && (
                <div className="alternativsvar__bekreft">
                  <Link
                    to={`/sykefravaer/${fnr}/mote/bekreft/${field.id}`}
                    className="knapp knapp--hoved knapp--mini js-bekreft-tidspunkt"
                  >
                    {texts.bekreft}
                  </Link>
                </div>
              )}
            </li>
          );
        })}
    </ol>
  );
};

BesvarteTidspunkter.propTypes = {
  mote: motePt,
  alternativer: PropTypes.arrayOf(motealternativPt),
  deltakertype: motedeltakertypePt,
  ledetekster: keyValue,
  fnr: PropTypes.string,
};

export default BesvarteTidspunkter;
