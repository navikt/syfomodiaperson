import DineKoronaSykmeldingOpplysninger from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/DineKoronaSykmeldingOpplysninger";
import React from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import BekreftetSykmeldingStatuspanel from "@/sider/sykmeldinger/sykmeldingstatuspanel/BekreftetSykmeldingStatuspanel";
import SykmeldingStatuspanel from "@/sider/sykmeldinger/sykmeldingstatuspanel/SykmeldingStatuspanel";
import Feilmelding from "@/components/Feilmelding";
import { Heading } from "@navikt/ds-react";

const texts = {
  pageSubtitle: "For selvstendig næringsdrivende og frilansere",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

/**
 * Dette vil bare gjelde historiske sykmeldinger fra når det var korona.
 */
export default function EgenmeldtKoronaSykmelding({ sykmelding }: Props) {
  const isBekreftet = sykmelding.status === SykmeldingStatus.BEKREFTET;
  const isAvbrutt = sykmelding.status === SykmeldingStatus.AVBRUTT;
  const isNy = sykmelding.status === SykmeldingStatus.NY;
  return isNy || isBekreftet || isAvbrutt ? (
    <>
      <Heading size="small" level="2">
        {texts.pageSubtitle}
      </Heading>
      {isBekreftet && (
        <BekreftetSykmeldingStatuspanel sykmelding={sykmelding} />
      )}
      {isAvbrutt && <SykmeldingStatuspanel sykmelding={sykmelding} />}
      <DineKoronaSykmeldingOpplysninger sykmelding={sykmelding} />
    </>
  ) : (
    <Feilmelding tittel="Egenmeldingen har ukjent status" />
  );
}
