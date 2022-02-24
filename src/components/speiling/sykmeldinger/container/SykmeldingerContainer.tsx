import React, { ReactElement } from "react";
import Side from "../../../../sider/Side";
import SidetoppSpeilet from "../../../SidetoppSpeilet";
import DineSykmeldinger from "../sykmeldinger/DineSykmeldinger";
import Brodsmuler from "../../Brodsmuler";
import { SYKMELDINGER } from "@/enums/menypunkter";
import Speilingvarsel from "../../Speilingvarsel";
import Pengestopp from "../../../pengestopp/Pengestopp";
import SideLaster from "../../../SideLaster";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";

const texts = {
  introduksjonstekst:
    "NAV mottar alle sykmeldinger. Ser du den ikke her? Det betyr at den som har sykmeldt deg ikke sender den digitalt til NAV. Da bruker du papirsykmeldingen i stedet.",
};

const SykmeldingerSide = (): ReactElement => {
  const { isLoading, isError, sykmeldinger } = useSykmeldingerQuery();
  const { navn: brukernavn } = useNavBrukerData();

  const htmlIntro = {
    __html: `<p>${texts.introduksjonstekst}</p>`,
  };
  const brodsmuler = [
    {
      tittel: "Ditt sykefravær",
    },
    {
      tittel: "Dine sykmeldinger",
    },
  ];

  return (
    <Side tittel="Sykmeldinger" aktivtMenypunkt={SYKMELDINGER}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <div>
          <Pengestopp sykmeldinger={sykmeldinger} />
          <Speilingvarsel brukernavn={brukernavn} />
          <div className="speiling">
            <Brodsmuler brodsmuler={brodsmuler} />
            <SidetoppSpeilet tittel="Dine sykmeldinger" htmlTekst={htmlIntro} />
            <DineSykmeldinger sykmeldinger={sykmeldinger} />
          </div>
        </div>
      </SideLaster>
    </Side>
  );
};

export default SykmeldingerSide;
