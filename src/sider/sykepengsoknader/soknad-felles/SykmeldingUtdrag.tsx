import React, { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingPerioder from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingPerioder";
import { SykmeldingNokkelOpplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingNokkelOpplysning";
import { BodyShort, Box, Heading } from "@navikt/ds-react";

const texts = {
  tittel: "Opplysninger fra sykmeldingen",
  arbeidsgiver: "Arbeidsgiver",
  utdrag: "Dato sykmeldingen ble skrevet",
};

interface Props {
  erApen?: boolean;
  sykmelding: SykmeldingOldFormat;
}

export default function SykmeldingUtdrag({ sykmelding }: Props): ReactElement {
  return (
    <Box background="default" padding="space-24" className="mb-4">
      <Heading size={"small"} className="mb-4">
        {texts.tittel}
      </Heading>
      <div>
        <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
        <SykmeldingNokkelOpplysning tittel={texts.arbeidsgiver}>
          <BodyShort size="small">
            {sykmelding.mottakendeArbeidsgiver?.navn}
          </BodyShort>
        </SykmeldingNokkelOpplysning>
        <SykmeldingNokkelOpplysning tittel={texts.utdrag}>
          <BodyShort size="small">
            {tilLesbarDatoMedArstall(sykmelding.bekreftelse.utstedelsesdato)}
          </BodyShort>
        </SykmeldingNokkelOpplysning>
      </div>
    </Box>
  );
}
