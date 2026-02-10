import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingOpplysning from "./SykmeldingOpplysning";
import SykmeldingOpplysningForFelt from "./SykmeldingOpplysningForFelt";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import { Checkbox } from "@navikt/ds-react";

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
  const visSeksjon =
    (sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length) ||
    sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433 ||
    (sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length) ||
    sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434;
  if (!visSeksjon) {
    return <span />;
  }

  return (
    <SykmeldingSeksjon tittel={texts.mulighetForArbeid}>
      {sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
        sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length > 0 && (
          <SykmeldingOpplysning tittel={texts.erIkkeIArbeid}>
            <Checkbox checked readOnly size="small">
              {texts.medisinskAarsak}
            </Checkbox>
            <Aarsaker
              aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig433}
            />
          </SykmeldingOpplysning>
        )}
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.mulighetForArbeid}
        felt={"aarsakAktivitetIkkeMulig433"}
        tittel={texts.medisinskAarsakBeskriv}
      />
      {sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
        sykmelding.mulighetForArbeid.aktivitetIkkeMulig434?.length > 0 && (
          <SykmeldingOpplysning tittel={texts.erIkkeIArbeid}>
            <Checkbox checked readOnly size="small">
              {texts.arbeidsplassForhold}
            </Checkbox>
            <Aarsaker
              aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig434}
            />
          </SykmeldingOpplysning>
        )}
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.mulighetForArbeid}
        felt="aarsakAktivitetIkkeMulig434"
        tittel={texts.arsak}
      />
    </SykmeldingSeksjon>
  );
}
