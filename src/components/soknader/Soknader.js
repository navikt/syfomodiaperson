import React from "react";
import PropTypes from "prop-types";
import { sykepengesoknadstatuser } from "@navikt/digisyfo-npm";
import Sidetopp from "../Sidetopp";
import SoknadTeasere from "./SoknaderTeasere";
import PlanlagteTeasere from "./PlanlagteTeasere";
import {
  sorterEtterOpprettetDato,
  sorterEtterPerioder,
} from "../../utils/sykepengesoknadUtils";
import { soknad as soknadPt } from "../../propTypes";
import { OPPHOLD_UTLAND } from "../../enums/soknadtyper";

const texts = {
  sidetittel: "Søknad om sykepenger",
  nyeSoknader: "Nye søknader",
  ingenSoknader:
    "Du har ingen nye søknader om sykepenger. Den neste søknaden du kan fylle ut kommer etter at sykmeldingsperioden er over.",
  tidligereSoknader: "Tidligere søknader",
};

const {
  SENDT,
  TIL_SENDING,
  UTGAATT,
  NY,
  UTKAST_TIL_KORRIGERING,
  FREMTIDIG,
  AVBRUTT,
} = sykepengesoknadstatuser;

const Soknader = ({ fnr, soknader = [] }) => {
  const alleSoknader = [...soknader];

  const nyeSoknader = alleSoknader
    .filter((soknad) => {
      return (
        (soknad.status === NY || soknad.status === UTKAST_TIL_KORRIGERING) &&
        soknad.soknadstype !== OPPHOLD_UTLAND
      );
    })
    .sort(sorterEtterOpprettetDato);

  const sendteSoknader = alleSoknader
    .filter((soknad) => {
      return (
        soknad.status === SENDT ||
        soknad.status === TIL_SENDING ||
        soknad.status === UTGAATT ||
        soknad.status === AVBRUTT
      );
    })
    .sort(sorterEtterPerioder);

  const kommendeSoknader = alleSoknader
    .filter((soknad) => {
      return soknad.status === FREMTIDIG;
    })
    .sort(sorterEtterPerioder)
    .reverse();

  return (
    <React.Fragment>
      <Sidetopp tittel={texts.sidetittel} />
      <SoknadTeasere
        sykepengesoknader={nyeSoknader}
        fnr={fnr}
        tittel={texts.nyeSoknader}
        tomListeTekst={texts.ingenSoknader}
        className="js-til-behandling"
        id="soknader-list-til-behandling"
      />

      {kommendeSoknader.length > 0 && (
        <PlanlagteTeasere
          sykepengesoknader={kommendeSoknader}
          fnr={fnr}
          tittel="Planlagte søknader"
        />
      )}

      {sendteSoknader.length > 0 && (
        <SoknadTeasere
          sykepengesoknader={sendteSoknader}
          fnr={fnr}
          tittel={texts.tidligereSoknader}
          tomListeTekst={texts.tidligereSoknader}
          className="js-sendt"
          id="soknader-sendt"
        />
      )}
    </React.Fragment>
  );
};

Soknader.propTypes = {
  soknader: PropTypes.arrayOf(soknadPt),
  fnr: PropTypes.string,
};

export default Soknader;
