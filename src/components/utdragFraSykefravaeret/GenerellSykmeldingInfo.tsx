import React from "react";
import { Checkbox } from "nav-frontend-skjema";
import {
  erArbeidsforEtterPerioden,
  erEkstraDiagnoseInformasjon,
  erHensynPaaArbeidsplassenInformasjon,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { Diagnose } from "./Diagnose";
import { Perioder } from "@/components/utdragFraSykefravaeret/Perioder";
import EkstraDiagnoseInformasjon from "../motebehov/EkstraDiagnoseInformasjon";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, VStack } from "@navikt/ds-react";

const tekster = {
  generellSykmeldingInfo: {
    arbeidsforEtterPerioden: {
      tittel: "Pasienten er 100 % arbeidsfør etter perioden",
    },
    hensynPaaArbeidsplassen: {
      tittel: "Beskriv eventuelle hensyn som må tas på arbeidsplassen",
    },
  },
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function GenerellSykmeldingInfo({ sykmelding }: Props) {
  const hovedDiagnose = sykmelding.diagnose.hoveddiagnose;
  const biDiagnoser = sykmelding.diagnose.bidiagnoser
    ? sykmelding.diagnose.bidiagnoser
    : [];
  const sykmeldingPerioderSortertEtterDato =
    sykmeldingperioderSortertEldstTilNyest(
      sykmelding.mulighetForArbeid.perioder
    );
  const isEkstraDiagnoseInformasjonVisible =
    erEkstraDiagnoseInformasjon(sykmelding);
  return (
    <VStack gap="4">
      <Perioder perioder={sykmeldingPerioderSortertEtterDato} />
      {hovedDiagnose && <Diagnose diagnose={hovedDiagnose} erHovedDiagnose />}
      {biDiagnoser.map((diagnose, index) => (
        <Diagnose key={index} diagnose={diagnose} erHovedDiagnose={false} />
      ))}
      {isEkstraDiagnoseInformasjonVisible && (
        <EkstraDiagnoseInformasjon diagnose={sykmelding.diagnose} />
      )}
      {erArbeidsforEtterPerioden(sykmelding) && (
        <Checkbox
          label={tekster.generellSykmeldingInfo.arbeidsforEtterPerioden.tittel}
          checked={sykmelding.friskmelding.arbeidsfoerEtterPerioden}
          disabled
        />
      )}
      {erHensynPaaArbeidsplassenInformasjon(sykmelding) && (
        <div>
          <BodyShort size="small" weight="semibold">
            {tekster.generellSykmeldingInfo.hensynPaaArbeidsplassen.tittel}
          </BodyShort>
          <BodyShort size="small">
            {sykmelding.friskmelding.hensynPaaArbeidsplassen}
          </BodyShort>
        </div>
      )}
    </VStack>
  );
}
