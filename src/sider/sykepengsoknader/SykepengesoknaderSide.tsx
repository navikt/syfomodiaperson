import React, { ReactElement } from "react";
import Side from "../../components/side/Side";
import Soknader from "./soknader/Soknader";
import Feilstripe from "../../components/Feilstripe";
import SideLaster from "../../components/side/SideLaster";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

const errorMessageText = (name: string) => {
  return `Beklager – vi kunne ikke hente alle sykepengesøknadene til ${name}`;
};

export default function SykepengesoknaderSide(): ReactElement {
  const fnr = useValgtPersonident();
  const {
    data: sykepengesoknader,
    isError,
    isLoading,
  } = useSykepengesoknaderQuery();

  const brukernavn = useNavBrukerData().navn;
  return (
    <Side
      tittel="Sykepengesøknader"
      aktivtMenypunkt={Menypunkter.SYKEPENGESOKNADER}
    >
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <div>
          <Feilstripe
            className="blokk--s"
            tekst={errorMessageText(brukernavn)}
            vis={isError}
          />
          <Soknader fnr={fnr} soknader={sykepengesoknader} />
        </div>
      </SideLaster>
    </Side>
  );
}
