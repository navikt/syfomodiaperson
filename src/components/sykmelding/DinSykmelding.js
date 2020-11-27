import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { keyValue, Bjorn } from "@navikt/digisyfo-npm";
import Alertstripe from "nav-frontend-alertstriper";
import DineSykmeldingOpplysninger from "./sykmeldingOpplysninger/DineSykmeldingOpplysninger";

const texts = {
  eldreSykmeldinger: "Du har eldre sykmeldinger som du bør behandle før denne.",
  eldreSykmeldingerLenke: "Gå til den eldste sykmeldingen.",
  bjorn:
    "Hei, her sjekker du opplysningene fra den som sykmeldte deg. Stemmer det med det dere ble enige om? Du velger selv om du vil bruke sykmeldingen.",
};

const DinSykmelding = ({
  sykmelding,
  ledetekster,
  visEldreSykmeldingVarsel,
  eldsteSykmeldingId,
}) => {
  return (
    <div>
      <Bjorn className="blokk" hvit stor rootUrl="/sykefravaer">
        <div>
          <p>{texts.bjorn}</p>
          <p className="introtekst__knapperad">
            <button disabled className="knapp knapp--mini">
              Gå til utfylling
            </button>
          </p>
        </div>
      </Bjorn>
      {visEldreSykmeldingVarsel && (
        <Alertstripe type="info">
          <p className="sist side-innhold">
            <span>{texts.eldreSykmeldinger} </span>
            <Link to={`/sykefravaer/sykmeldinger/${eldsteSykmeldingId}`}>
              {texts.eldreSykmeldingerLenke}
            </Link>
          </p>
        </Alertstripe>
      )}
      <header className="panelHeader panelHeader--lysebla">
        <img
          className="panelHeader__ikon"
          src="/sykefravaer/img/svg/person.svg"
          alt="Du"
        />
        <img
          className="panelHeader__ikon panelHeader__ikon--hoykontrast"
          src="/sykefravaer/img/svg/person-highcontrast.svg"
          alt="Du"
        />
      </header>
      <div className="panel blokk">
        <DineSykmeldingOpplysninger
          sykmelding={sykmelding}
          ledetekster={ledetekster}
        />
      </div>
    </div>
  );
};

DinSykmelding.propTypes = {
  sykmelding: PropTypes.object,
  ledetekster: keyValue,
  visEldreSykmeldingVarsel: PropTypes.bool,
  eldsteSykmeldingId: PropTypes.string,
};

export default DinSykmelding;
