import React from "react";
import { TilbakeIArbeidMedArbeidsgiver } from "./TilbakeIArbeidMedArbeidsgiver";
import { TilbakeIArbeidUtenArbeidsgiver } from "./TilbakeIArbeidUtenArbeidsgiver";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function TilbakeIArbeid({ sykmelding }: Props) {
  const friskmelding = sykmelding.friskmelding;
  const medArbeidsgiver =
    friskmelding.antarReturSammeArbeidsgiver ||
    friskmelding.antarReturAnnenArbeidsgiver ||
    friskmelding.tilbakemeldingReturArbeid;
  const utenArbeidsgiver =
    friskmelding.utenArbeidsgiverAntarTilbakeIArbeid ||
    friskmelding.utenArbeidsgiverTilbakemelding;

  return (
    <div className="pt-4">
      {medArbeidsgiver && (
        <TilbakeIArbeidMedArbeidsgiver friskmelding={friskmelding} />
      )}
      {utenArbeidsgiver && (
        <TilbakeIArbeidUtenArbeidsgiver friskmelding={friskmelding} />
      )}
    </div>
  );
}
