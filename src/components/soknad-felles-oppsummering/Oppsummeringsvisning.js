import React from "react";
import OppsummeringSporsmal from "./OppsummeringSporsmal";
import { soknad as soknadPt } from "../../propTypes";
import { IKKE_RELEVANT } from "../../enums/svartyper";

export const getKey = (tag, id) => {
  return `${tag}_${id}`;
};

const Oppsummeringsvisning = ({ soknad }) => {
  return (
    <React.Fragment>
      {soknad.sporsmal
        .filter((sporsmal) => {
          return (
            sporsmal.svar.length > 0 ||
            sporsmal.undersporsmal.length > 0 ||
            sporsmal.svartype === IKKE_RELEVANT
          );
        })
        .map((sporsmal) => {
          return (
            <div
              className="oppsummering__seksjon"
              key={getKey(sporsmal.tag, sporsmal.id)}
            >
              <OppsummeringSporsmal {...sporsmal} />
            </div>
          );
        })}
    </React.Fragment>
  );
};

Oppsummeringsvisning.propTypes = {
  soknad: soknadPt,
};

export default Oppsummeringsvisning;
