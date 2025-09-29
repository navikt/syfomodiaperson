import React from "react";
import {
  newAndActivatedSykmeldinger,
  sykmeldingerInnenforOppfolgingstilfelle,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import SyketilfelleList from "@/sider/nokkelinformasjon/sykmeldingsgrad/SyketilfelleList";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { Alert, BodyShort, Box, Heading } from "@navikt/ds-react";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  harJobbet,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SykmeldingsgradChart from "@/sider/nokkelinformasjon/sykmeldingsgrad/SykmeldingsgradChart";

const texts = {
  title: "Sykmeldingsgrad",
  subtitle: "Endringer i sykmeldingsgrad",
  xAxis: "X-akse: måned i tilfellet",
  yAxis: "Y-akse: sykmeldingsgrad",
  harJobbetUtoverSykmeldingsgrad:
    "Har jobbet utover sykmeldingsgrad. Se sykepengesøknader for mer informasjon.",
};

function tilfelleVarighetText(start: Date, end: Date, varighet: number) {
  return `Valgt tilfelle sin varighet: ${tilLesbarPeriodeMedArstall(start, end)}
           (${varighet} uker)`;
}

interface Props {
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
  setSelectedOppfolgingstilfelle: (
    oppfolgingstilfelle: OppfolgingstilfelleDTO
  ) => void;
}

export default function Sykmeldingsgrad({
  selectedOppfolgingstilfelle,
  setSelectedOppfolgingstilfelle,
}: Props) {
  const { sykmeldinger } = useGetSykmeldingerQuery();
  const getSykepengesoknader = useSykepengesoknaderQuery();

  const newAndUsedSykmeldinger = newAndActivatedSykmeldinger(sykmeldinger);
  const sykmeldingerIOppfolgingstilfelle =
    sykmeldingerInnenforOppfolgingstilfelle(
      newAndUsedSykmeldinger,
      selectedOppfolgingstilfelle
    );

  function harOpplystOmJobbetIOppfolgingstilfelle(
    sykmeldingerIOppfolgingstilfelle: SykmeldingOldFormat[]
  ): boolean {
    const sykmeldingIds = new Set(
      sykmeldingerIOppfolgingstilfelle.map((s) => s.id)
    );
    return getSykepengesoknader.data
      .filter(
        (soknad) =>
          soknad.sykmeldingId && sykmeldingIds.has(soknad.sykmeldingId)
      )
      .some((soknad: SykepengesoknadDTO) => harJobbet(soknad));
  }

  const sortedSykmeldingsperioder = sykmeldingerIOppfolgingstilfelle
    .flatMap((sykmelding) => sykmelding.mulighetForArbeid.perioder)
    .sort((a, b) => a.fom.getTime() - b.fom.getTime());

  return (
    <Box background="surface-default" padding="4" className="mb-4">
      <Heading size="medium" level="2">
        {texts.title}
      </Heading>
      <BodyShort size="small">{texts.subtitle}</BodyShort>
      {selectedOppfolgingstilfelle && sortedSykmeldingsperioder.length > 0 && (
        <BodyShort size="small">
          {tilfelleVarighetText(
            selectedOppfolgingstilfelle.start,
            selectedOppfolgingstilfelle.end,
            selectedOppfolgingstilfelle.varighetUker
          )}
        </BodyShort>
      )}
      {harOpplystOmJobbetIOppfolgingstilfelle(
        sykmeldingerIOppfolgingstilfelle
      ) && (
        <Alert variant="info" size="small" className="mt-2 w-fit">
          {texts.harJobbetUtoverSykmeldingsgrad}
        </Alert>
      )}

      <div className="flex flex-row">
        <SykmeldingsgradChart sykmeldingsperioder={sortedSykmeldingsperioder} />

        <SyketilfelleList
          setSelectedTilfelle={setSelectedOppfolgingstilfelle}
        />
      </div>

      <BodyShort size="small">{texts.yAxis}</BodyShort>
      <BodyShort size="small">{texts.xAxis}</BodyShort>
    </Box>
  );
}
