import React from "react";
import PropTypes from "prop-types";
import { keyValue, sykmeldingstatuser } from "@navikt/digisyfo-npm";
import DinSykmelding from "./DinSykmelding";
import DinSendteSykmelding from "./DinSendteSykmelding";
import DinBekreftedeSykmelding from "./DinBekreftedeSykmelding";
import DinAvbrutteSykmelding from "./DinAvbrutteSykmelding";
import DinUtgaatteSykmelding from "./DinUtgaatteSykmelding";
import LenkeTilDineSykmeldinger from "./LenkeTilDineSykmeldinger";
import Feilmelding from "../Feilmelding";
import { behandlingsutfallStatuser } from "../../utils/sykmeldinger/sykmeldingstatuser";
import AvvistSykmelding from "./avvisteSykmeldinger/AvvistSykmelding";
import KoronaSykmeldingBekreftet from "./koronasykmeldinger/KoronaSykmelding-Bekreftet";
import KoronaSykmeldingNy from "./koronasykmeldinger/KoronaSykmelding-Ny";
import KoronaSykmeldingAvbrutt from "./koronasykmeldinger/KoronaSykmelding-Avbrutt";

const SykmeldingSide = ({
  dinSykmelding,
  arbeidsgiversSykmelding,
  ledetekster,
  fnr,
}) => {
  return (() => {
    if (
      dinSykmelding.behandlingsutfall.status ===
      behandlingsutfallStatuser.INVALID
    ) {
      return (
        <div>
          <AvvistSykmelding
            sykmelding={dinSykmelding}
            ledetekster={ledetekster}
          />
          <LenkeTilDineSykmeldinger ledetekster={ledetekster} fnr={fnr} />
        </div>
      );
    }
    if (dinSykmelding.egenmeldt) {
      switch (dinSykmelding.status) {
        case sykmeldingstatuser.BEKREFTET: {
          return (
            <div>
              <KoronaSykmeldingBekreftet dinSykmelding={dinSykmelding} />
              <LenkeTilDineSykmeldinger />
            </div>
          );
        }
        case sykmeldingstatuser.NY: {
          return <KoronaSykmeldingNy sykmelding={dinSykmelding} />;
        }
        case sykmeldingstatuser.AVBRUTT: {
          return (
            <div>
              <KoronaSykmeldingAvbrutt sykmelding={dinSykmelding} />
              <LenkeTilDineSykmeldinger />
            </div>
          );
        }
        default: {
          return <Feilmelding tittel="Egenmeldingen har ukjent status" />;
        }
      }
    } else if (
      dinSykmelding.status === sykmeldingstatuser.SENDT &&
      arbeidsgiversSykmelding
    ) {
      return (
        <div>
          <DinSendteSykmelding
            dinSykmelding={dinSykmelding}
            arbeidsgiversSykmelding={arbeidsgiversSykmelding}
            ledetekster={ledetekster}
          />
          <LenkeTilDineSykmeldinger ledetekster={ledetekster} fnr={fnr} />
        </div>
      );
    } else if (dinSykmelding.status === sykmeldingstatuser.BEKREFTET) {
      return (
        <div>
          <DinBekreftedeSykmelding
            dinSykmelding={dinSykmelding}
            arbeidsgiversSykmelding={arbeidsgiversSykmelding}
            ledetekster={ledetekster}
          />
          <LenkeTilDineSykmeldinger ledetekster={ledetekster} fnr={fnr} />
        </div>
      );
    } else if (dinSykmelding.status === sykmeldingstatuser.UTGAATT) {
      return (
        <div>
          <DinUtgaatteSykmelding
            sykmelding={dinSykmelding}
            ledetekster={ledetekster}
          />
          <LenkeTilDineSykmeldinger ledetekster={ledetekster} fnr={fnr} />
        </div>
      );
    } else if (dinSykmelding.status === sykmeldingstatuser.NY) {
      return (
        <div>
          <DinSykmelding sykmelding={dinSykmelding} ledetekster={ledetekster} />
          <LenkeTilDineSykmeldinger ledetekster={ledetekster} fnr={fnr} />
        </div>
      );
    } else if (dinSykmelding.status === sykmeldingstatuser.AVBRUTT) {
      return (
        <div>
          <DinAvbrutteSykmelding
            sykmelding={dinSykmelding}
            ledetekster={ledetekster}
          />
          <LenkeTilDineSykmeldinger ledetekster={ledetekster} fnr={fnr} />
        </div>
      );
    }
    return <Feilmelding tittel="Sykmeldingen har ukjent status" />;
  })();
};

SykmeldingSide.propTypes = {
  ledetekster: keyValue,
  dinSykmelding: PropTypes.object,
  arbeidsgiversSykmelding: PropTypes.object,
  fnr: PropTypes.string,
};

export default SykmeldingSide;
