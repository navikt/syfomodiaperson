import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import { BodyShort, Checkbox, Heading } from "@navikt/ds-react";

const texts = {
  mulighetForArbeid: "Mulighet for arbeid",
  medisinskAarsak:
    "Det er medisinske årsaker som hindrer arbeidsrelatert aktivitet",
  arsak: "Angi hva som er årsaken",
  arbeidsplassForhold:
    "Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet",
  erIkkeIArbeid: "Pasienten kan ikke være i arbeid (100 % sykmeldt)",
  medisinskAarsakBeskriv: "Beskriv nærmere",
};

interface AarsakerProps {
  aarsaker: string[];
}

function Aarsaker({ aarsaker }: AarsakerProps) {
  const fjernAnnet = (array: string[]): string[] => {
    if (array.length === 1 && array.indexOf("Annet") > -1) {
      return [];
    }
    return array;
  };
  return (
    <>
      {fjernAnnet(aarsaker).map((aarsak: string, key: number) => (
        <Checkbox key={key} checked readOnly size="small" className="ml-6">
          {aarsak}
        </Checkbox>
      ))}
    </>
  );
}

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function MulighetForArbeid({ sykmelding }: Props) {
  return (
    <SykmeldingSeksjon tittel={texts.mulighetForArbeid}>
      {sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
        sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length > 0 && (
          <div className="mb-5">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.erIkkeIArbeid}
            </Heading>
            <Checkbox checked readOnly size="small">
              {texts.medisinskAarsak}
            </Checkbox>
            <Aarsaker
              aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig433}
            />
          </div>
        )}
      {sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433 && (
        <div className="mb-5">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.medisinskAarsakBeskriv}
          </Heading>
          <BodyShort
            size="small"
            className="before:content-['–'] before:mr-1 before:inline-block"
          >
            {sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433}
          </BodyShort>
        </div>
      )}
      {sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
        sykmelding.mulighetForArbeid.aktivitetIkkeMulig434?.length > 0 && (
          <div className="mb-5">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.erIkkeIArbeid}
            </Heading>
            <Checkbox checked readOnly size="small">
              {texts.arbeidsplassForhold}
            </Checkbox>
            <Aarsaker
              aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig434}
            />
          </div>
        )}
      {sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434 && (
        <div className="pb-5">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.arsak}
          </Heading>
          <BodyShort
            size="small"
            className="before:content-['–'] before:mr-1 before:inline-block"
          >
            {sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434}
          </BodyShort>
        </div>
      )}
    </SykmeldingSeksjon>
  );
}
