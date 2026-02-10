import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { erMeldingTilNavInformasjon } from "@/utils/sykmeldinger/sykmeldingUtils";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import SykmeldingOpplysningForFelt from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/SykmeldingOpplysningForFelt";
import { Checkbox } from "@navikt/ds-react";

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
      {sykmelding.meldingTilNav.navBoerTaTakISaken && (
        <Checkbox checked readOnly size="small">
          {texts.bistandNav}
        </Checkbox>
      )}
      {sykmelding.meldingTilNav.navBoerTaTakISakenBegrunnelse && (
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
