import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysningForFelt } from "./SykmeldingOpplysningForFelt";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";

const texts = {
  arbeidsevne: "Hva skal til for å bedre arbeidsevnen?",
  tilrettelegging: "Tilrettelegging/hensyn som bør tas på arbeidsplassen",
  tiltakNAV: "Tiltak i regi av Nav",
  tiltakAndre: "Eventuelle andre innspill til Nav",
};

interface BedreArbeidsevneProps {
  sykmelding: SykmeldingOldFormat;
}

const BedreArbeidsevne = (bedreArbeidsevneProps: BedreArbeidsevneProps) => {
  const { sykmelding } = bedreArbeidsevneProps;
  const visSeksjon =
    sykmelding.arbeidsevne.tilretteleggingArbeidsplass ||
    sykmelding.arbeidsevne.tiltakNAV ||
    sykmelding.arbeidsevne.tiltakAndre;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <SykmeldingSeksjon tittel={texts.arbeidsevne}>
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.arbeidsevne}
        felt={"tilretteleggingArbeidsplass"}
        tittel={texts.tilrettelegging}
      />
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.arbeidsevne}
        felt={"tiltakNAV"}
        tittel={texts.tiltakNAV}
      />
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.arbeidsevne}
        felt={"tiltakAndre"}
        tittel={texts.tiltakAndre}
      />
    </SykmeldingSeksjon>
  );
};

export default BedreArbeidsevne;
