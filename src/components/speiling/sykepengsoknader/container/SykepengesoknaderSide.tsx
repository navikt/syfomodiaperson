import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import Side from "../../../../sider/Side";
import Soknader from "../soknader/Soknader";
import Brodsmuler from "../../Brodsmuler";
import { SYKEPENGESOKNADER } from "@/enums/menypunkter";
import Speilingvarsel from "../../Speilingvarsel";
import Feilstripe from "../../../Feilstripe";
import SideLaster from "../../../SideLaster";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { hentSoknader } from "@/data/sykepengesoknad/soknader_actions";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useSykepengeSoknader } from "@/data/sykepengesoknad/soknader_hooks";

const errorMessageText = (name: string) => {
  return `Beklager – vi kunne ikke hente alle sykepengesøknadene til ${name}`;
};

const SykepengesoknaderSide = (): ReactElement => {
  const dispatch = useDispatch();

  const fnr = useValgtPersonident();

  const {
    sykepengesoknader,
    harForsoktHentetSoknader,
    hentingFeiletSoknader,
  } = useSykepengeSoknader();

  const brukernavn = useNavBrukerData().navn;

  useEffect(() => {
    dispatch(hentSoknader(fnr));
  }, [dispatch, fnr]);

  const brodsmuler = [
    {
      tittel: "Ditt sykefravær",
    },
    {
      tittel: "Søknader om sykepenger",
    },
  ];
  return (
    <Side tittel="Sykepengesøknader" aktivtMenypunkt={SYKEPENGESOKNADER}>
      <SideLaster
        henter={!harForsoktHentetSoknader}
        hentingFeilet={hentingFeiletSoknader}
      >
        <div>
          <Feilstripe
            className="blokk--s"
            tekst={errorMessageText(brukernavn)}
            vis={hentingFeiletSoknader}
          />
          <Speilingvarsel brukernavn={brukernavn} />
          <div className="speiling">
            <Brodsmuler brodsmuler={brodsmuler} />
            <Soknader fnr={fnr} soknader={sykepengesoknader} />
          </div>
        </div>
      </SideLaster>
    </Side>
  );
};

export default SykepengesoknaderSide;
