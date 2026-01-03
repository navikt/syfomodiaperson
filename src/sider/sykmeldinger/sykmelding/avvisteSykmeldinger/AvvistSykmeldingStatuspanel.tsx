import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function AvvistSykmeldingStatuspanel({
  sykmelding,
}: Props): ReactElement {
  return (
    <div className="mb-4 flex justify-between">
      <Nokkelopplysning
        label="Status"
        className="nokkelopplysning--statusopplysning"
      >
        <p>Avvist av Nav</p>
      </Nokkelopplysning>
      <Nokkelopplysning
        label="Dato avvist"
        className="nokkelopplysning--statusopplysning"
      >
        <p>{tilLesbarDatoMedArstall(sykmelding.mottattTidspunkt)}</p>
      </Nokkelopplysning>
      <Nokkelopplysning
        label="Bekreftet av den sykmeldte"
        className="nokkelopplysning--statusopplysning"
      >
        <p>{tilLesbarDatoMedArstall(sykmelding.sendtdato)}</p>
      </Nokkelopplysning>
    </div>
  );
}
