import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { tilLesbarDatoMedArstall } from "@navikt/digisyfo-npm";
import { Link } from "react-router";
import {
  getTidligsteSendtDato,
  sorterEtterDato,
} from "../../utils/sykepengesoknadUtils";
import { sykepengesoknad as sykepengesoknadPt } from "../../propTypes";

const texts = {
  tittel: "Tidligere utgaver som du har sendt",
  sendt: "Sendt",
};

const RelaterteSoknader = ({ relaterteSoknader, fnr }) => {
  if (relaterteSoknader.length === 0) {
    return null;
  }
  return (
    <div className="panel tidligereVersjoner">
      <h2 className="tidligereVersjoner__tittel">{texts.tittel}</h2>
      <ul className="tidligereVersjoner__liste">
        {relaterteSoknader.sort(sorterEtterDato).map((s, index) => {
          return (
            <li key={index}>
              <Link to={`/sykefravaer/${fnr}/sykepengesoknader/${s.id}`}>
                {texts.sendt}{" "}
                {tilLesbarDatoMedArstall(getTidligsteSendtDato(s))}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

RelaterteSoknader.propTypes = {
  relaterteSoknader: PropTypes.arrayOf(sykepengesoknadPt),
  fnr: PropTypes.string,
};

export const mapStateToProps = (state, ownProps) => {
  const relaterteSoknader = [];
  const sykepengesoknadId = ownProps.sykepengesoknadId;
  const fnr = ownProps.fnr;
  const sykepengesoknader = [...state.soknader.data];
  let sykepengesoknad = sykepengesoknader.filter((s) => {
    return s.id === sykepengesoknadId;
  })[0];

  sykepengesoknader.forEach(() => {
    sykepengesoknader.forEach((s) => {
      if (sykepengesoknad.korrigerer === s.id) {
        relaterteSoknader.push(s);
        sykepengesoknad = s;
      }
    });
  });

  return {
    relaterteSoknader: relaterteSoknader.reverse(),
    fnr,
  };
};

const RelaterteSoknaderContainer = connect(mapStateToProps)(RelaterteSoknader);

export default RelaterteSoknaderContainer;
