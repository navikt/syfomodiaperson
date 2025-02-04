import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysningForFelt } from "./SykmeldingOpplysningForFelt";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";

const texts = {
  title: "Melding til arbeidsgiver",
  content: "Andre innspill til arbeidsgiver",
};

interface MeldingTilArbeidsgiverProps {
  sykmelding: SykmeldingOldFormat;
}

const MeldingTilArbeidsgiver = (
  meldingTilArbeidsgiverProps: MeldingTilArbeidsgiverProps
) => {
  const { sykmelding } = meldingTilArbeidsgiverProps;
  const visSeksjon = sykmelding.innspillTilArbeidsgiver;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <SykmeldingSeksjon tittel={texts.title}>
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding}
        felt={"innspillTilArbeidsgiver"}
        tittel={texts.content}
      />
    </SykmeldingSeksjon>
  );
};

export default MeldingTilArbeidsgiver;
