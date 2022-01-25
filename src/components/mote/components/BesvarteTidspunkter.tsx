import React from "react";
import { Link } from "react-router-dom";
import { MULIGE_SVAR } from "@/konstanter";
import {
  MoteAlternativDTO,
  MoteDeltakerDTO,
  MotedeltakerType,
  MoteDTO,
} from "@/data/mote/types/moteTypes";
import { getSvar } from "@/utils/moteplanleggerUtils";
import SvarMedIkon, { NavKan } from "./SvarMedIkon";
import DatoOgTid from "./DatoOgTid";

const texts = {
  bekreft: "Bekreft tidspunkt",
};

interface BesvarteTidspunkterProps {
  alternativer: MoteAlternativDTO[];
  deltakertype: MotedeltakerType;
  mote: MoteDTO;
}

const BesvarteTidspunkter = (
  besvarteTidspunkterProps: BesvarteTidspunkterProps
) => {
  const {
    alternativer,
    deltakertype = MotedeltakerType.BRUKER,
    mote,
  } = besvarteTidspunkterProps;
  const arbeidsgiver: MoteDeltakerDTO | undefined = mote.deltakere.filter(
    (d) => {
      return d.type === MotedeltakerType.ARBEIDSGIVER;
    }
  )[0];
  const bruker: MoteDeltakerDTO | undefined = mote.deltakere.filter((d) => {
    return d.type === MotedeltakerType.BRUKER;
  })[0];

  let forsteDeltaker = bruker;
  let andreDeltaker = arbeidsgiver;

  if (deltakertype === MotedeltakerType.ARBEIDSGIVER) {
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
              navn:
                deltakertype === MotedeltakerType.NAV_VEILEDER
                  ? forsteDeltaker.navn
                  : "Du",
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
                  />
                )}
                {andreDeltaker && (
                  <SvarMedIkon
                    bruker={andreDeltaker}
                    svar={andreDeltakersSvar}
                  />
                )}
                {deltakertype !== MotedeltakerType.NAV_VEILEDER && <NavKan />}
              </ul>
              {deltakertype === MotedeltakerType.NAV_VEILEDER && (
                <div className="alternativsvar__bekreft">
                  <Link
                    to={`/sykefravaer/mote/bekreft/${field.id}`}
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

export default BesvarteTidspunkter;
