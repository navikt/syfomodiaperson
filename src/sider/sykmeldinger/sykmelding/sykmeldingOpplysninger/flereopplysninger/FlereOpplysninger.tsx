import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import MulighetForArbeid from "./MulighetForArbeid";
import Friskmelding from "./Friskmelding";
import UtdypendeOpplysninger from "./UtdypendeOpplysninger";
import BedreArbeidsevne from "./BedreArbeidsevne";
import MeldingTilNav from "./MeldingTilNav";
import Tilbakedatering from "./Tilbakedatering";
import MeldingTilArbeidsgiver from "./MeldingTilArbeidsgiver";
import AndreSykmeldingOpplysninger from "./AndreSykmeldingOpplysninger";
import SykmeldingOpplysningForFelt from "./SykmeldingOpplysningForFelt";

const texts = {
  utstedelsesdato: "Dato sykmeldingen ble skrevet",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function FlereOpplysninger({ sykmelding }: Props) {
  return (
    <div>
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.bekreftelse}
        felt={"utstedelsesdato"}
        tittel={texts.utstedelsesdato}
        opplysning={tilLesbarDatoMedArstall(
          sykmelding.bekreftelse.utstedelsesdato
        )}
      />
      <MulighetForArbeid sykmelding={sykmelding} />
      <Friskmelding sykmelding={sykmelding} />
      <UtdypendeOpplysninger sykmelding={sykmelding} />
      <BedreArbeidsevne sykmelding={sykmelding} />
      <MeldingTilNav sykmelding={sykmelding} />
      <MeldingTilArbeidsgiver sykmelding={sykmelding} />
      <Tilbakedatering sykmelding={sykmelding} />
      <AndreSykmeldingOpplysninger sykmelding={sykmelding} />
    </div>
  );
}
