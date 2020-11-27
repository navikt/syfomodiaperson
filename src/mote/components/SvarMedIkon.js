import React from "react";
import PropTypes from "prop-types";
import { keyValue } from "@navikt/digisyfo-npm";
import { motedeltakerPt, motesvarPt } from "../../propTypes";
import { getSvar } from "../../utils/moteplanleggerUtils";
import { ARBEIDSGIVER, MULIGE_SVAR } from "../../konstanter";

const texts = {
  kanMote: "kan møte på dette tidspunktet",
  kanIkkeMote: "kan ikke møte på dette tidspunktet",
  ikkeSvart: "har ikke svart ennå",
};

const textWithName = (text, name) => {
  return `${name} ${text}`;
};

const getIkonsti = (filnavn) => {
  return `/sykefravaer/img/svg/${filnavn}`;
};

const Ikon = ({ ikon }) => {
  return (
    <div className="alternativsvar__ikon">
      <img src={getIkonsti(ikon)} className="js-ikon-passer" alt="" />
    </div>
  );
};

Ikon.propTypes = {
  ikon: PropTypes.string.isRequired,
};

const getSvartekst = (bruker, svar) => {
  const svarstr = getSvar(svar, bruker.svartidspunkt);
  switch (svarstr) {
    case MULIGE_SVAR.PASSER: {
      return textWithName(texts.kanMote, bruker.navn);
    }
    case MULIGE_SVAR.PASSER_IKKE: {
      return textWithName(texts.kanIkkeMote, bruker.navn);
    }
    default: {
      return textWithName(texts.ikkeSvart, bruker.navn);
    }
  }
};

const getIkonFilnavn = (bruker, svar) => {
  const svarstr = getSvar(svar, bruker.svartidspunkt);
  switch (svarstr) {
    case MULIGE_SVAR.PASSER: {
      return "status--kan.svg";
    }
    case MULIGE_SVAR.PASSER_IKKE: {
      return "status--kanikke.svg";
    }
    default: {
      return "status--ikkesvar.svg";
    }
  }
};

const Svartekst = ({ tekst, deltakertype }) => {
  return (
    <div className="alternativsvar__tekst">
      <p>
        <span className="alternativsvar__deltakertype">{deltakertype}:</span>{" "}
        {tekst}
      </p>
    </div>
  );
};

Svartekst.propTypes = {
  tekst: PropTypes.string.isRequired,
  deltakertype: PropTypes.string.isRequired,
};

export const NavKan = () => {
  return (
    <li className="alternativsvar__svar js-navssvar">
      <Ikon ikon="status--kan.svg" />
      <Svartekst
        deltakertype="NAV"
        tekst={textWithName(texts.kanMote, "Veilederen")}
      />
    </li>
  );
};

NavKan.propTypes = {
  ledetekster: keyValue,
};

const SvarMedIkon = ({ bruker, svar }) => {
  const deltakertype =
    bruker.type === ARBEIDSGIVER ? "Arbeidsgiver" : "Arbeidstaker";
  return (
    <li className="alternativsvar__svar js-annenssvar">
      <Ikon ikon={getIkonFilnavn(bruker, svar)} />
      <Svartekst
        deltakertype={`${deltakertype}en`}
        navn={bruker.navn}
        tekst={getSvartekst(bruker, svar)}
      />
    </li>
  );
};

SvarMedIkon.propTypes = {
  bruker: motedeltakerPt,
  svar: motesvarPt,
  ledetekster: keyValue,
};

export default SvarMedIkon;
