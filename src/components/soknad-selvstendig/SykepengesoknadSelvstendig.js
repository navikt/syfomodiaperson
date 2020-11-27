import React from "react";
import { sykmelding as sykmeldingPt, Utvidbar } from "@navikt/digisyfo-npm";
import PropTypes from "prop-types";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import { soknad as soknadPt } from "../../propTypes";
import { VAER_KLAR_OVER_AT } from "../../enums/tagtyper";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import { AVBRUTT, FREMTIDIG, NY } from "../../enums/soknadstatuser";
import IkkeInnsendtSoknad from "../soknad-felles/IkkeInnsendtSoknad";
import SendtSoknadSelvstendigStatuspanel from "./SendtSoknadSelvstendigStatuspanel";
import AvbruttSoknadSelvstendigStatuspanel from "./AvbruttSoknadSelvstendigStatuspanel";
import SykmeldingUtdragForSelvstendige from "./SykmeldingutdragForSelvstendige";

const texts = {
  oppsummering: "Oppsummering",
};

const SykepengesoknadSelvstendig = (props) => {
  const { soknad, fnr } = props;
  switch (soknad.status) {
    case NY:
    case FREMTIDIG: {
      return <IkkeInnsendtSoknad fnr={fnr} />;
    }
    case AVBRUTT: {
      return (
        <SoknadSpeiling {...props}>
          <AvbruttSoknadSelvstendigStatuspanel soknad={props.soknad} />
          {props.sykmelding && props.sykmelding.sporsmal && (
            <SykmeldingUtdragForSelvstendige
              sykmelding={props.sykmelding}
              erApen
            />
          )}
        </SoknadSpeiling>
      );
    }
    default: {
      return (
        <SoknadSpeiling {...props}>
          <SendtSoknadSelvstendigStatuspanel soknad={props.soknad} />
          {props.sykmelding && props.sykmelding.sporsmal && (
            <SykmeldingUtdragForSelvstendige
              sykmelding={props.sykmelding}
              erApen
            />
          )}
          <Utvidbar
            tittel={texts.oppsummering}
            className="blokk js-soknad-oppsummering"
            erApen
          >
            <Oppsummeringsvisning
              soknad={Object.assign({}, soknad, {
                sporsmal: soknad.sporsmal.filter((s) => {
                  return s.tag !== VAER_KLAR_OVER_AT;
                }),
              })}
            />
          </Utvidbar>
          <div className="panel">
            <Oppsummeringsvisning
              soknad={Object.assign({}, soknad, {
                sporsmal: soknad.sporsmal.filter((s) => {
                  return s.tag === VAER_KLAR_OVER_AT;
                }),
              })}
            />
          </div>
        </SoknadSpeiling>
      );
    }
  }
};

SykepengesoknadSelvstendig.propTypes = {
  sykmelding: sykmeldingPt,
  soknad: soknadPt,
  fnr: PropTypes.string,
};

export default SykepengesoknadSelvstendig;
