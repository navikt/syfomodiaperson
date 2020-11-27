import React from "react";
import PropTypes from "prop-types";
import {
  Utvidbar,
  SoknadOppsummering,
  BekreftetKorrektInformasjon,
  sykepengesoknadstatuser,
} from "@navikt/digisyfo-npm";
import Statuspanel from "./Soknadstatuspanel";
import { sykepengesoknad as sykepengesoknadPt } from "../../propTypes";
import RelaterteSoknaderContainer from "./RelaterteSoknaderContainer";
import KorrigertAvContainer from "./KorrigertAvContainer";
import AvbruttSoknad from "./AvbruttSoknad";
import UtgaattSoknad from "./UtgaattSoknad";
import SykmeldingUtdrag from "../../connected-components/SykmeldingUtdrag";
import EndreSendKnapperad from "./EndreSendKnapperad";

const {
  KORRIGERT,
  SENDT,
  TIL_SENDING,
  AVBRUTT,
  UTGAATT,
} = sykepengesoknadstatuser;

const BehandletSykepengesoknad = ({ sykepengesoknad, fnr }) => {
  switch (sykepengesoknad.status) {
    case AVBRUTT: {
      return <AvbruttSoknad sykepengesoknad={sykepengesoknad} fnr={fnr} />;
    }
    case UTGAATT: {
      return <UtgaattSoknad sykepengesoknad={sykepengesoknad} fnr={fnr} />;
    }
    default: {
      return (
        <div>
          {sykepengesoknad.status === KORRIGERT && (
            <KorrigertAvContainer sykepengesoknad={sykepengesoknad} fnr={fnr} />
          )}
          <Statuspanel sykepengesoknad={sykepengesoknad}>
            <EndreSendKnapperad sykepengesoknad={sykepengesoknad} />
          </Statuspanel>
          <SykmeldingUtdrag soknad={sykepengesoknad} fnr={fnr} />
          <Utvidbar className="blokk" tittel="Oppsummering" erApen>
            <SoknadOppsummering
              oppsummeringsoknad={sykepengesoknad.oppsummering}
            />
          </Utvidbar>
          <div className="bekreftet-container blokk">
            <BekreftetKorrektInformasjon
              oppsummeringsoknad={sykepengesoknad.oppsummering}
            />
          </div>
          {(sykepengesoknad.status === SENDT ||
            sykepengesoknad.status === TIL_SENDING) && (
            <RelaterteSoknaderContainer
              fnr={fnr}
              sykepengesoknadId={sykepengesoknad.id}
            />
          )}
        </div>
      );
    }
  }
};

BehandletSykepengesoknad.propTypes = {
  sykepengesoknad: sykepengesoknadPt,
  fnr: PropTypes.string,
};

export default BehandletSykepengesoknad;
