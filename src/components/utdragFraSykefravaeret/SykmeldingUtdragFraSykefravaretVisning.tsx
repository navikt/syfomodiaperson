import React from "react";
import { MeldingTilArbeidsgiver } from "./MeldingTilArbeidsgiver";
import { MeldingTilNav } from "./MeldingTilNav";
import { BedreArbeidsevnen } from "./BedreArbeidsevnen";
import { UtdypendeOpplysninger } from "./UtdypendeOpplysninger";
import { TilbakeIArbeid } from "@/components/utdragFraSykefravaeret/TilbakeIArbeid";
import GenerellSykmeldingInfo from "./GenerellSykmeldingInfo";
import MulighetForArbeid from "./MulighetForArbeid";
import {
  finnAvventendeSykmeldingTekst,
  SykmeldingOldFormat,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  erBedringAvArbeidsevnenInformasjon,
  erFriskmeldingInformasjon,
  erMeldingTilNavInformasjon,
  erMulighetForArbeidInformasjon,
  erUtdypendeOpplysninger,
} from "@/utils/sykmeldinger/sykmeldingUtils";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function SykmeldingUtdragFraSykefravaretVisning({
  sykmelding,
}: Props) {
  const isMeldingTilNavVisible = erMeldingTilNavInformasjon(sykmelding);
  const isUtdypendeOpplysningerVisible =
    sykmelding && erUtdypendeOpplysninger(sykmelding);
  const erMulighetForArbeidInformasjonSynlig =
    erMulighetForArbeidInformasjon(sykmelding) ||
    !!finnAvventendeSykmeldingTekst(sykmelding);

  return (
    <div className="sykmeldingMotebehovVisning">
      <GenerellSykmeldingInfo sykmelding={sykmelding} />
      {erMulighetForArbeidInformasjonSynlig && (
        <MulighetForArbeid sykmelding={sykmelding} />
      )}
      {erFriskmeldingInformasjon(sykmelding) && (
        <TilbakeIArbeid sykmelding={sykmelding} />
      )}
      {isUtdypendeOpplysningerVisible && (
        <UtdypendeOpplysninger
          utdypendeOpplysninger={sykmelding.utdypendeOpplysninger}
        />
      )}
      {erBedringAvArbeidsevnenInformasjon(sykmelding) && (
        <BedreArbeidsevnen sykmelding={sykmelding} />
      )}
      {isMeldingTilNavVisible && (
        <MeldingTilNav meldingTilNav={sykmelding.meldingTilNav} />
      )}
      {!!sykmelding.innspillTilArbeidsgiver && (
        <MeldingTilArbeidsgiver
          innspillTilArbeidsgiver={sykmelding.innspillTilArbeidsgiver}
        />
      )}
    </div>
  );
}
