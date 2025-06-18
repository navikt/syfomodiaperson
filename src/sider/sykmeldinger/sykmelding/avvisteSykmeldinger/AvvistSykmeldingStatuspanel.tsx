import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { StatusNokkelopplysning } from "@/components/speiling/Statuspanel";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function AvvistSykmeldingStatuspanel({
  sykmelding,
}: Props): ReactElement {
  return (
    <div className="mb-4 flex justify-between">
      <StatusNokkelopplysning tittel="Status">
        <p>Avvist av Nav</p>
      </StatusNokkelopplysning>
      <StatusNokkelopplysning tittel="Dato avvist">
        <p>{tilLesbarDatoMedArstall(sykmelding.mottattTidspunkt)}</p>
      </StatusNokkelopplysning>
      <StatusNokkelopplysning tittel="Bekreftet av deg">
        <p>{tilLesbarDatoMedArstall(sykmelding.sendtdato)}</p>
      </StatusNokkelopplysning>
    </div>
  );
}
