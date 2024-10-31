import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingCheckboxSelvstendig } from "../SykmeldingCheckbox";
import { erMeldingTilNavInformasjon } from "@/utils/sykmeldinger/sykmeldingUtils";

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
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">{texts.meldingTilNav}</h4>
      {!sykmelding.meldingTilNav.navBoerTaTakISaken ? null : (
        <SykmeldingCheckboxSelvstendig
          tekst={texts.bistandNav}
          jsClassName="navBoerTaTakISaken"
        />
      )}
      {!sykmelding.meldingTilNav.navBoerTaTakISakenBegrunnelse ? null : (
        <div className="opplysning subopplysning">
          <h6 className="opplysning__tittel">{texts.begrunnelse}</h6>
          <p className="opplysning__verdi js-navBoerTaTakISakenBegrunnelse">
            {sykmelding.meldingTilNav.navBoerTaTakISakenBegrunnelse}
          </p>
        </div>
      )}
    </div>
  );
}
