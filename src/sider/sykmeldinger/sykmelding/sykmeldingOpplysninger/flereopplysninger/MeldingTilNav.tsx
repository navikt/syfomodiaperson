import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingCheckbox } from "../SykmeldingCheckbox";
import { erMeldingTilNavInformasjon } from "@/utils/sykmeldinger/sykmeldingUtils";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import { SykmeldingOpplysningForFelt } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/SykmeldingOpplysningForFelt";

const texts = {
  begrunnelse: "Begrunn nærmere",
  bistandNav: "Ønskes bistand fra Nav nå?",
  meldingTilNav: "Melding til Nav",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function MeldingTilNav({ sykmelding }: Props) {
  if (!erMeldingTilNavInformasjon(sykmelding)) {
    return <span />;
  }
  return (
    <SykmeldingSeksjon tittel={texts.meldingTilNav}>
      {!sykmelding.meldingTilNav.navBoerTaTakISaken ? null : (
        <SykmeldingCheckbox tekst={texts.bistandNav} />
      )}
      {!sykmelding.meldingTilNav.navBoerTaTakISakenBegrunnelse ? null : (
        <SykmeldingOpplysningForFelt
          sykmeldingBolk={sykmelding.meldingTilNav}
          felt={"navBoerTaTakISakenBegrunnelse"}
          tittel={texts.begrunnelse}
          isSubopplysning={true}
        />
      )}
    </SykmeldingSeksjon>
  );
}
