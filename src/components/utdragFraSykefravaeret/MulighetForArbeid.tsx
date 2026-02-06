import React from "react";
import {
  finnAvventendeSykmeldingTekst,
  SykmeldingOldFormat,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, Checkbox, Heading } from "@navikt/ds-react";
import { BriefcaseIcon, FirstAidKitIcon } from "@navikt/aksel-icons";

const tekster = {
  avventende: "Innspill til arbeidsgiveren ved avventende sykmelding",
  beskrivelse: "Nærmere beskrivelse",
  medisinskAarsak:
    "Det er medisinske årsaker som hindrer arbeidsrelatert aktivitet",
  forholdPaaArbeidsplass:
    "Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet",
};

interface MulighetForArbeidProps {
  sykmelding: SykmeldingOldFormat;
}

export default function MulighetForArbeid({
  sykmelding,
}: MulighetForArbeidProps) {
  const mulighetForArbeid = sykmelding.mulighetForArbeid;
  const avventendeTekst = finnAvventendeSykmeldingTekst(sykmelding);
  const aktivitetIkkeMulig433 = mulighetForArbeid.aktivitetIkkeMulig433;
  const aarsakAktivitetIkkeMulig433 =
    mulighetForArbeid.aarsakAktivitetIkkeMulig433;
  const aktivitetIkkeMulig434 = mulighetForArbeid.aktivitetIkkeMulig434;
  const aarsakAktivitetIkkeMulig434 =
    mulighetForArbeid.aarsakAktivitetIkkeMulig434;
  return (
    <div>
      {!!avventendeTekst && (
        <div>
          <BodyShort size="small" weight="semibold" className="mt-4">
            {tekster.avventende}
          </BodyShort>
          <BodyShort size="small">{avventendeTekst}</BodyShort>
        </div>
      )}
      {aktivitetIkkeMulig433 && (
        <div className="mt-4">
          <Heading size="xsmall" level="4" className="flex items-center">
            <FirstAidKitIcon
              title="førstehjelpsskrin-ikon"
              fontSize="1.5rem"
              className="mr-2"
            />
            {tekster.medisinskAarsak}
          </Heading>

          {aktivitetIkkeMulig433.map(
            (ikkeMuligTekst: string, index: number) => (
              <Checkbox
                key={index}
                size="small"
                checked
                readOnly
                className="ml-8"
              >
                {ikkeMuligTekst}
              </Checkbox>
            )
          )}
          {aarsakAktivitetIkkeMulig433 && (
            <div className="ml-8">
              <BodyShort size="small" weight="semibold">
                {tekster.beskrivelse}
              </BodyShort>
              <BodyShort size="small">{aarsakAktivitetIkkeMulig433}</BodyShort>
            </div>
          )}
        </div>
      )}
      {aktivitetIkkeMulig434 && (
        <div className="mt-4">
          <Heading size="xsmall" level="4" className="flex items-center">
            <BriefcaseIcon
              title="stresskoffert-ikon"
              fontSize="1.5rem"
              className="mr-2"
            />
            {tekster.forholdPaaArbeidsplass}
          </Heading>

          {aktivitetIkkeMulig434.map(
            (ikkeMuligTekst: string, index: number) => (
              <Checkbox
                key={index}
                size="small"
                checked
                readOnly
                className="ml-8"
              >
                {ikkeMuligTekst}
              </Checkbox>
            )
          )}
          {aarsakAktivitetIkkeMulig434 && (
            <div className="ml-8">
              <BodyShort size="small" weight="semibold">
                {tekster.beskrivelse}
              </BodyShort>
              <BodyShort>{aarsakAktivitetIkkeMulig434}</BodyShort>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
