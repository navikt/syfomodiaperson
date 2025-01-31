import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingOpplysning from "./SykmeldingOpplysning";
import { SykmeldingCheckbox } from "../SykmeldingCheckbox";
import { SykmeldingOpplysningForFelt } from "./SykmeldingOpplysningForFelt";
import { SykmeldingCheckboxForFelt } from "../SykmeldingCheckboxForFelt";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";

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

const fjernAnnet = (array: string[]): string[] => {
  if (array.length === 1 && array.indexOf("Annet") > -1) {
    return [];
  }
  return array;
};

interface AarsakerProps {
  aarsaker: string[];
}

const Aarsaker = ({ aarsaker }: AarsakerProps) => {
  return (
    <>
      {fjernAnnet(aarsaker).map((aarsak: string, key: number) => {
        return (
          <SykmeldingCheckbox
            tekst={aarsak}
            key={key}
            className={"mb-2 last:mb-0"}
            isSubopplysning={true}
          />
        );
      })}
    </>
  );
};

interface MulighetForArbeidProps {
  sykmelding: SykmeldingOldFormat;
}

const MulighetForArbeid = (mulighetForArbeidProps: MulighetForArbeidProps) => {
  const { sykmelding } = mulighetForArbeidProps;
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
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length > 0 ? (
        <SykmeldingOpplysning tittel={texts.erIkkeIArbeid}>
          <SykmeldingCheckboxForFelt
            sykmeldingBolk={sykmelding.mulighetForArbeid}
            felt="aktivitetIkkeMulig433"
            tekst={texts.medisinskAarsak}
            className={"mb-2 last:mb-0"}
          />
          <Aarsaker
            aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig433}
          />
        </SykmeldingOpplysning>
      ) : null}
      {(() => (
        <SykmeldingOpplysningForFelt
          sykmeldingBolk={sykmelding.mulighetForArbeid}
          felt={"aarsakAktivitetIkkeMulig433"}
          tittel={texts.medisinskAarsakBeskriv}
        />
      ))()}
      {sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length > 0 ? (
        <SykmeldingOpplysning tittel={texts.erIkkeIArbeid}>
          <SykmeldingCheckboxForFelt
            sykmeldingBolk={sykmelding.mulighetForArbeid}
            felt="aktivitetIkkeMulig434"
            tekst={texts.arbeidsplassForhold}
            className={"mb-2 last:mb-0"}
          />
          <Aarsaker
            aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig434}
          />
        </SykmeldingOpplysning>
      ) : null}
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.mulighetForArbeid}
        felt="aarsakAktivitetIkkeMulig434"
        tittel={texts.arsak}
      />
    </SykmeldingSeksjon>
  );
};
export default MulighetForArbeid;
