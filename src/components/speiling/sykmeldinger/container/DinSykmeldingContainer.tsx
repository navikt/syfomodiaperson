import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hentSykmeldinger } from "../../../../data/sykmelding/sykmeldinger_actions";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "../../../../data/sykmelding/types/SykmeldingOldFormat";
import Side from "../../../../sider/Side";
import SidetoppSpeilet from "../../../SidetoppSpeilet";
import SykmeldingSide from "../sykmelding/SykmeldingSide";
import Brodsmuler from "../../Brodsmuler";
import Speilingvarsel from "../../Speilingvarsel";
import { SYKMELDINGER } from "../../../../enums/menypunkter";
import { ARBEIDSTAKER } from "../../../../enums/arbeidssituasjoner";
import { harForsoktHentetSykmeldinger } from "../../../../utils/reducerUtils";
import { useValgtPersonident } from "../../../../hooks/useValgtBruker";
import SideLaster from "../../../SideLaster";

const texts = {
  pageTitleSykmelding: "Sykmelding",
  pageTitleEgenmelding: "Egenmelding",
};

const pageTitle = (dinSykmelding?: SykmeldingOldFormat) => {
  return dinSykmelding?.egenmeldt
    ? texts.pageTitleEgenmelding
    : texts.pageTitleSykmelding;
};

export function getSykmelding(
  sykmeldinger: SykmeldingOldFormat[],
  sykmeldingId: string
) {
  return sykmeldinger.find((sykmld) => {
    return `${sykmld.id}` === `${sykmeldingId}`;
  });
}

const DinSykmeldingSide = () => {
  const fnr = useValgtPersonident();
  const sykmeldingId = window.location.pathname.split("/")[3];

  const navbrukerState = useSelector((state: any) => state.navbruker);
  const sykmeldingerState = useSelector((state: any) => state.sykmeldinger);

  const harForsoktHentetAlt = harForsoktHentetSykmeldinger(sykmeldingerState);
  const henter = !harForsoktHentetAlt;
  const hentingFeilet = sykmeldingerState.hentingFeilet;
  const dinSykmelding = getSykmelding(sykmeldingerState.data, sykmeldingId);
  let arbeidsgiversSykmelding = {} as SykmeldingOldFormat | undefined;

  if (
    dinSykmelding &&
    (dinSykmelding.status === SykmeldingStatus.SENDT ||
      (dinSykmelding.status === SykmeldingStatus.BEKREFTET &&
        dinSykmelding.valgtArbeidssituasjon === ARBEIDSTAKER))
  ) {
    arbeidsgiversSykmelding = getSykmelding(
      sykmeldingerState.arbeidsgiverssykmeldinger,
      sykmeldingId
    );
  }

  const brukernavn = navbrukerState.data.navn;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hentSykmeldinger(fnr));
  }, []);

  const brodsmuler = [
    {
      tittel: "Ditt sykefravær",
    },
    {
      tittel: "Dine sykmeldinger",
    },
    {
      tittel: "Sykmelding",
    },
  ];

  return (
    <Side
      fnr={fnr}
      tittel={texts.pageTitleSykmelding}
      aktivtMenypunkt={SYKMELDINGER}
    >
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <div>
          <Speilingvarsel brukernavn={brukernavn} />
          <div className="speiling">
            <Brodsmuler brodsmuler={brodsmuler} />
            <SidetoppSpeilet tittel={pageTitle(dinSykmelding)} />
            <SykmeldingSide
              dinSykmelding={dinSykmelding}
              arbeidsgiversSykmelding={arbeidsgiversSykmelding}
            />
          </div>
        </div>
      </SideLaster>
    </Side>
  );
};

export default DinSykmeldingSide;
