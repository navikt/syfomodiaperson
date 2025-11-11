import React, { ReactElement } from "react";
import Side from "../../components/side/Side";
import Feilstripe from "../../components/Feilstripe";
import SideLaster from "../../components/side/SideLaster";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/side/Sidetopp";
import SoknaderList from "@/sider/sykepengsoknader/soknader/SoknaderList";
import {
  erSoknadSendt,
  Soknadstatus,
  Soknadstype,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import {
  sorterEtterOpprettetDato,
  sorterEtterPerioder,
} from "@/utils/sykepengesoknadUtils";
import { Heading } from "@navikt/ds-react";
import PlanlagtTeaser from "@/sider/sykepengsoknader/soknader/PlanlagtSoknad";

const texts = {
  sidetittel: "Søknad om sykepenger",
  nyeSoknader: "Nye søknader",
  ingenSoknader: "Ingen nye søknader om sykepenger",
  tidligereSoknader: "Tidligere søknader",
  planlagteSoknader: "Planlagte søknader",
  errorMessage: (sykmeldtNavn: string) =>
    `Beklager – vi kunne ikke hente alle sykepengesøknadene til ${sykmeldtNavn}`,
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
    .filter(erSoknadSendt)
    .sort(sorterEtterPerioder);

  const kommendeSoknader = sykepengesoknader
    .filter((soknad) => {
      return soknad.status === Soknadstatus.FREMTIDIG;
    })
    .sort(sorterEtterPerioder)
    .reverse();

  const sykmeldtNavn = useNavBrukerData().navn;
  return (
    <Side
      tittel="Sykepengesøknader"
      aktivtMenypunkt={Menypunkter.SYKEPENGESOKNADER}
    >
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <div>
          <Feilstripe
            className="blokk--s"
            tekst={texts.errorMessage(sykmeldtNavn)}
            vis={isError}
          />
          <Sidetopp tittel={texts.sidetittel} />
          <SoknaderList
            sykepengesoknader={nyeSoknader}
            tittel={texts.nyeSoknader}
            tomListeTekst={texts.ingenSoknader}
          />

          {kommendeSoknader.length > 0 && (
            <div className="mb-4">
              <Heading size="small">{texts.planlagteSoknader}</Heading>
              {kommendeSoknader.map((soknad, idx) => (
                <PlanlagtTeaser key={idx} soknad={soknad} />
              ))}
            </div>
          )}

          {sendteSoknader.length > 0 && (
            <SoknaderList
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
