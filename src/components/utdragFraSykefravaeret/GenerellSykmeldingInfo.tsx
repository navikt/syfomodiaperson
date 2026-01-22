import React from "react";
import { Checkbox } from "nav-frontend-skjema";
import {
  erArbeidsforEtterPerioden,
  erHensynPaaArbeidsplassenInformasjon,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { Diagnose } from "./Diagnose";
import { Perioder } from "@/components/utdragFraSykefravaeret/Perioder";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, VStack } from "@navikt/ds-react";
import { AnnenLovfestetFravaersgrunn } from "@/components/utdragFraSykefravaeret/AnnenLovfestetFravaersgrunn";
import { Yrkesskade } from "@/components/utdragFraSykefravaeret/Yrkesskade";

const tekster = {
  arbeidsforEtterPerioden: "Pasienten er 100 % arbeidsfør etter perioden",
  hensynPaaArbeidsplassen:
    "Beskriv eventuelle hensyn som må tas på arbeidsplassen",
  svangerskapsrelatert: "Sykdommen er svangerskapsrelatert",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function GenerellSykmeldingInfo({ sykmelding }: Props) {
  const diagnose = sykmelding.diagnose;
  const hovedDiagnose = diagnose.hoveddiagnose;
  const biDiagnoser = diagnose.bidiagnoser;
  const sykmeldingPerioderSortertEtterDato =
    sykmeldingperioderSortertEldstTilNyest(
      sykmelding.mulighetForArbeid.perioder
    );

  return (
    <VStack gap="4">
      <Perioder perioder={sykmeldingPerioderSortertEtterDato} />
      {hovedDiagnose && <Diagnose diagnose={hovedDiagnose} erHovedDiagnose />}
      {biDiagnoser &&
        biDiagnoser.map((diagnose, index) => (
          <Diagnose key={index} diagnose={diagnose} erHovedDiagnose={false} />
        ))}
      {diagnose.fravaersgrunnLovfestet && (
        <AnnenLovfestetFravaersgrunn
          fravaersgrunn={diagnose.fravaersgrunnLovfestet}
          fravaersBeskrivelse={diagnose.fravaerBeskrivelse}
        />
      )}
      {diagnose.svangerskap && (
        <Checkbox label={tekster.svangerskapsrelatert} checked disabled />
      )}
      {diagnose.yrkesskade && <Yrkesskade dato={diagnose.yrkesskadeDato} />}
      {erArbeidsforEtterPerioden(sykmelding) && (
        <Checkbox
          label={tekster.arbeidsforEtterPerioden}
          checked={sykmelding.friskmelding.arbeidsfoerEtterPerioden}
          disabled
        />
      )}
      {erHensynPaaArbeidsplassenInformasjon(sykmelding) && (
        <div>
          <BodyShort size="small" weight="semibold">
            {tekster.hensynPaaArbeidsplassen}
          </BodyShort>
          <BodyShort size="small">
            {sykmelding.friskmelding.hensynPaaArbeidsplassen}
          </BodyShort>
        </div>
      )}
    </VStack>
  );
}
