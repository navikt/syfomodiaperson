import React, { ReactElement } from "react";
import Side from "../../components/side/Side";
import Feilstripe from "../../components/Feilstripe";
import SideLaster from "../../components/side/SideLaster";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/side/Sidetopp";
import SoknadTeasere from "@/sider/sykepengsoknader/soknader/SoknaderTeasere";
import PlanlagteTeasere from "@/sider/sykepengsoknader/soknader/PlanlagteTeasere";
import {
  isSoknadSendt,
  Soknadstatus,
  Soknadstype,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import {
  sorterEtterOpprettetDato,
  sorterEtterPerioder,
} from "@/utils/sykepengesoknadUtils";

const texts = {
  sidetittel: "Søknad om sykepenger",
  nyeSoknader: "Nye søknader",
  ingenSoknader:
    "Du har ingen nye søknader om sykepenger. Den neste søknaden du kan fylle ut kommer etter at sykmeldingsperioden er over.",
  tidligereSoknader: "Tidligere søknader",
};

const errorMessageText = (name: string) => {
  return `Beklager – vi kunne ikke hente alle sykepengesøknadene til ${name}`;
};

export default function SykepengesoknaderSide(): ReactElement {
  const {
    data: sykepengesoknader,
    isError,
    isLoading,
  } = useSykepengesoknaderQuery();

  const nyeSoknader = sykepengesoknader
    .filter((soknad) => {
      return (
        (soknad.status === Soknadstatus.NY ||
          soknad.status === Soknadstatus.UTKAST_TIL_KORRIGERING) &&
        soknad.soknadstype !== Soknadstype.OPPHOLD_UTLAND
      );
    })
    .sort(sorterEtterOpprettetDato);

  const sendteSoknader = sykepengesoknader
    .filter(isSoknadSendt)
    .sort(sorterEtterPerioder);

  const kommendeSoknader = sykepengesoknader
    .filter((soknad) => {
      return soknad.status === Soknadstatus.FREMTIDIG;
    })
    .sort(sorterEtterPerioder)
    .reverse();

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
          <Sidetopp tittel={texts.sidetittel} />
          <SoknadTeasere
            sykepengesoknader={nyeSoknader}
            tittel={texts.nyeSoknader}
            tomListeTekst={texts.ingenSoknader}
          />

          {kommendeSoknader.length > 0 && (
            <PlanlagteTeasere
              sykepengesoknader={kommendeSoknader}
              tittel="Planlagte søknader"
            />
          )}

          {sendteSoknader.length > 0 && (
            <SoknadTeasere
              sykepengesoknader={sendteSoknader}
              tittel={texts.tidligereSoknader}
              tomListeTekst={texts.tidligereSoknader}
            />
          )}
        </div>
      </SideLaster>
    </Side>
  );
}
