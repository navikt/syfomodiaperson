import React from "react";
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
import { BodyLong, BodyShort } from "@navikt/ds-react";
import { TilbakedateringUtdragFraSykmeldingen } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/Tilbakedatering.tsx";

const tekster = {
  meldingTilArbeidsgiver: "Melding til arbeidsgiver",
};

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
  const erTilbakedatering =
    sykmelding.tilbakedatering.dokumenterbarPasientkontakt ||
    sykmelding.tilbakedatering.tilbakedatertBegrunnelse;

  return (
    <div className="space-y-4 divide-y divide-ax-neutral-600 whitespace-pre-line">
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
        <div className="pt-4">
          <BodyShort size="small" weight="semibold">
            {tekster.meldingTilArbeidsgiver}
          </BodyShort>
          <BodyLong size="small">{sykmelding.innspillTilArbeidsgiver}</BodyLong>
        </div>
      )}
      {erTilbakedatering && (
        <TilbakedateringUtdragFraSykmeldingen sykmelding={sykmelding} />
      )}
    </div>
  );
}
