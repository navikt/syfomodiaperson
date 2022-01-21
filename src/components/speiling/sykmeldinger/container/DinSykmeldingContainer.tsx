import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { hentSykmeldinger } from "@/data/sykmelding/sykmeldinger_actions";
import {
  ArbeidssituasjonType,
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import Side from "../../../../sider/Side";
import SidetoppSpeilet from "../../../SidetoppSpeilet";
import SykmeldingSide from "../sykmelding/SykmeldingSide";
import Brodsmuler from "../../Brodsmuler";
import Speilingvarsel from "../../Speilingvarsel";
import { SYKMELDINGER } from "@/enums/menypunkter";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import SideLaster from "../../../SideLaster";
import { useSykmeldinger } from "@/data/sykmelding/sykmeldinger_hooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";

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
): SykmeldingOldFormat | undefined {
  return sykmeldinger.find((sykmld) => {
    return `${sykmld.id}` === `${sykmeldingId}`;
  });
}

const DinSykmeldingSide = (): ReactElement => {
  const fnr = useValgtPersonident();
  const sykmeldingId = window.location.pathname.split("/")[3];

  const { navn: brukernavn } = useNavBrukerData();
  const {
    harForsoktHentetSykmeldinger,
    hentingSykmeldingerFeilet,
    sykmeldinger,
    arbeidsgiverssykmeldinger,
  } = useSykmeldinger();

  const henter = !harForsoktHentetSykmeldinger;
  const dinSykmelding = getSykmelding(sykmeldinger, sykmeldingId);
  let arbeidsgiversSykmelding = {} as SykmeldingOldFormat | undefined;

  if (
    dinSykmelding &&
    (dinSykmelding.status === SykmeldingStatus.SENDT ||
      (dinSykmelding.status === SykmeldingStatus.BEKREFTET &&
        dinSykmelding.valgtArbeidssituasjon ===
          ArbeidssituasjonType.ARBEIDSTAKER))
  ) {
    arbeidsgiversSykmelding = getSykmelding(
      arbeidsgiverssykmeldinger,
      sykmeldingId
    );
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hentSykmeldinger(fnr));
  }, [dispatch, fnr]);

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
    <Side tittel={texts.pageTitleSykmelding} aktivtMenypunkt={SYKMELDINGER}>
      <SideLaster henter={henter} hentingFeilet={hentingSykmeldingerFeilet}>
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
