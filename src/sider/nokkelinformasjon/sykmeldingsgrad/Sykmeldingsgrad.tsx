import {
  newAndActivatedSykmeldinger,
  sykmeldingerInnenforOppfolgingstilfelle,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import SyketilfelleList from "@/sider/nokkelinformasjon/sykmeldingsgrad/SyketilfelleList";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { Alert, BodyShort, Box, Tabs } from "@navikt/ds-react";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import {
  SykmeldingOldFormat,
  SykmeldingPeriodeDTO,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  harJobbet,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SykmeldingsgradChart from "@/sider/nokkelinformasjon/sykmeldingsgrad/SykmeldingsgradChart";
import SykmeldingshendelserTimelineMock from "@/sider/nokkelinformasjon/sykmeldingsgrad/SykmeldingshendelserTimelineMock";
import { useState } from "react";

const texts = {
  xAxis: "X-akse: måned i tilfellet",
  yAxis: "Y-akse: sykmeldingsgrad",
  tabs: {
    sykmeldingsgrad: "Sykmeldingsgrad",
    hendelser: "Hendelser i tilfelle",
  },
  harJobbetUtoverSykmeldingsgrad:
    "Har jobbet utover sykmeldingsgrad. Se sykepengesøknader for mer informasjon.",
};

const SykmeldingsvisningTab = {
  sykmeldingsgrad: "sykmeldingsgrad",
  hendelser: "hendelser",
} as const;

function tilfelleVarighetText(start: Date, end: Date, varighet: number) {
  return `Valgt tilfelle sin varighet: ${tilLesbarPeriodeMedArstall(start, end)}
           (${varighet} uker)`;
}

interface Props {
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
  setSelectedOppfolgingstilfelle: (
    oppfolgingstilfelle: OppfolgingstilfelleDTO,
  ) => void;
}

export default function Sykmeldingsgrad({
  selectedOppfolgingstilfelle,
  setSelectedOppfolgingstilfelle,
}: Props) {
  const [visning, setVisning] = useState<string>(
    SykmeldingsvisningTab.sykmeldingsgrad,
  );
  const { sykmeldinger } = useGetSykmeldingerQuery();
  const getSykepengesoknader = useSykepengesoknaderQuery();

  const newAndUsedSykmeldinger = newAndActivatedSykmeldinger(sykmeldinger);
  const sykmeldingerIOppfolgingstilfelle =
    sykmeldingerInnenforOppfolgingstilfelle(
      newAndUsedSykmeldinger,
      selectedOppfolgingstilfelle,
    );

  function harOpplystOmJobbetIOppfolgingstilfelle(
    sykmeldingerIOppfolgingstilfelle: SykmeldingOldFormat[],
  ): boolean {
    const sykmeldingIds = new Set(
      sykmeldingerIOppfolgingstilfelle.map((s) => s.id),
    );
    return getSykepengesoknader.data
      .filter(
        (soknad) =>
          soknad.sykmeldingId && sykmeldingIds.has(soknad.sykmeldingId),
      )
      .some((soknad: SykepengesoknadDTO) => harJobbet(soknad));
  }

  const sortedSykmeldingsperioder = sykmeldingerIOppfolgingstilfelle
    .flatMap((sykmelding) => sykmelding.mulighetForArbeid.perioder)
    .sort((a: SykmeldingPeriodeDTO, b: SykmeldingPeriodeDTO) => {
      return a.fom.getTime() - b.fom.getTime();
    });

  return (
    <Box background="default" padding="space-16" className="mb-4">
      {selectedOppfolgingstilfelle && sortedSykmeldingsperioder.length > 0 && (
        <BodyShort size="small">
          {tilfelleVarighetText(
            selectedOppfolgingstilfelle.start,
            selectedOppfolgingstilfelle.end,
            selectedOppfolgingstilfelle.varighetUker,
          )}
        </BodyShort>
      )}
      {harOpplystOmJobbetIOppfolgingstilfelle(
        sykmeldingerIOppfolgingstilfelle,
      ) && (
        <Alert variant="info" size="small" className="mt-2 w-fit">
          {texts.harJobbetUtoverSykmeldingsgrad}
        </Alert>
      )}
      <div className="flex flex-row gap-8">
        <div className="w-full min-w-0">
          <Tabs
            value={visning}
            size="small"
            onChange={(value) => setVisning(value)}
          >
            <Tabs.List>
              <Tabs.Tab
                value={SykmeldingsvisningTab.sykmeldingsgrad}
                label={texts.tabs.sykmeldingsgrad}
              />
              <Tabs.Tab
                value={SykmeldingsvisningTab.hendelser}
                label={texts.tabs.hendelser}
              />
            </Tabs.List>
            <Tabs.Panel
              value={SykmeldingsvisningTab.sykmeldingsgrad}
              className="mt-4"
            >
              <SykmeldingsgradChart
                sykmeldingsperioder={sortedSykmeldingsperioder}
              />
            </Tabs.Panel>
            <Tabs.Panel
              value={SykmeldingsvisningTab.hendelser}
              className="mt-4"
            >
              <SykmeldingshendelserTimelineMock
                selectedOppfolgingstilfelle={selectedOppfolgingstilfelle}
                sykmeldingsperioder={sortedSykmeldingsperioder}
              />
            </Tabs.Panel>
          </Tabs>
          {visning === SykmeldingsvisningTab.sykmeldingsgrad && (
            <>
              <BodyShort size="small">{texts.yAxis}</BodyShort>
              <BodyShort size="small">{texts.xAxis}</BodyShort>
            </>
          )}
        </div>
        <div className="shrink-0 min-w-max">
          <SyketilfelleList
            setSelectedTilfelle={setSelectedOppfolgingstilfelle}
          />
        </div>
      </div>
    </Box>
  );
}
