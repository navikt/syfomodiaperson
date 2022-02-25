import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import SykepengesoknadStatuspanel from "./SykepengesoknadStatuspanel";
import Utvidbar from "../../../Utvidbar";
import { Brodsmule } from "../../Brodsmuler";
import {
  SoknadstatusDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { KorrigertAv } from "../soknad-arbeidstaker/KorrigertAv";
import { RelaterteSoknader } from "../soknad-arbeidstaker/RelaterteSoknader";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { erVaerKlarOverAt } from "@/utils/sykepengesoknadUtils";

const texts = {
  tittel: "Søknad om sykepenger",
  oppsummeringTittel: "Oppsummering",
};

interface OppsummeringUtvidbarProps {
  soknad: SykepengesoknadDTO;
}

const OppsummeringUtvidbar = ({ soknad }: OppsummeringUtvidbarProps) => {
  return (
    <Utvidbar className="blokk" tittel={texts.oppsummeringTittel}>
      <Oppsummeringsvisning soknad={soknad} />
    </Utvidbar>
  );
};

interface SendtSoknadArbeidstakerNyProps {
  brukernavn: string;
  brodsmuler: Brodsmule[];
  soknad: SykepengesoknadDTO;
}

const SendtSoknadArbeidstakerNy = ({
  brukernavn,
  brodsmuler,
  soknad,
}: SendtSoknadArbeidstakerNyProps): ReactElement => {
  return (
    <SoknadSpeiling
      tittel={texts.tittel}
      brukernavn={brukernavn}
      brodsmuler={brodsmuler}
    >
      {soknad.status === SoknadstatusDTO.KORRIGERT && (
        <KorrigertAv soknadId={soknad.id} />
      )}
      <SykepengesoknadStatuspanel soknad={soknad} />
      <SykmeldingUtdragContainer soknad={soknad} />
      <OppsummeringUtvidbar
        soknad={{
          ...soknad,
          sporsmal: soknad.sporsmal.filter(
            (sporsmal) => !erVaerKlarOverAt(sporsmal)
          ),
        }}
      />
      <div className="panel blokk">
        <Oppsummeringsvisning
          soknad={{
            ...soknad,
            sporsmal: soknad.sporsmal.filter((sporsmal) =>
              erVaerKlarOverAt(sporsmal)
            ),
          }}
        />
      </div>
      <RelaterteSoknader soknad={soknad} />
    </SoknadSpeiling>
  );
};

export default SendtSoknadArbeidstakerNy;
