import dayjs from "dayjs";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import React, { ReactElement } from "react";
import {
  newAndActivatedSykmeldinger,
  sykmeldingerInnenforOppfolgingstilfelle,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import {
  dagerMellomDatoer,
  getDatoKomponenter,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { SyketilfelleList } from "@/sider/nokkelinformasjon/sykmeldingsgrad/SyketilfelleList";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { BodyShort, Box, Heading } from "@navikt/ds-react";

const texts = {
  title: "Sykmeldingsgrad",
  subtitle: "Endringer i sykmeldingsgrad",
  xAxis: "X-akse: måned i tilfellet",
  yAxis: "Y-akse: sykmeldingsgrad",
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

export const Sykmeldingsgrad = ({
  selectedOppfolgingstilfelle,
  setSelectedOppfolgingstilfelle,
}: Props) => {
  const { sykmeldinger } = useSykmeldingerQuery();

  const newAndUsedSykmeldinger = newAndActivatedSykmeldinger(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      newAndUsedSykmeldinger,
      selectedOppfolgingstilfelle
    );

  const perioderListSortert = sykmeldingerIOppfolgingstilfellet
    .flatMap((sykmelding) => sykmelding.mulighetForArbeid.perioder)
    .sort((a, b) => a.fom.getTime() - b.fom.getTime());

  const varighetOppfolgingstilfelle =
    perioderListSortert.length === 0
      ? 0
      : dagerMellomDatoer(
          perioderListSortert[0].fom,
          perioderListSortert[perioderListSortert.length - 1].tom
        );
  const oneYearInDays = 52 * 7;
  const DAYS_IN_GRAPH =
    varighetOppfolgingstilfelle > oneYearInDays
      ? varighetOppfolgingstilfelle
      : oneYearInDays;
  const sykmeldingsgradPerDay = new Int32Array(DAYS_IN_GRAPH);

  perioderListSortert.forEach((periode) => {
    const dayZero = perioderListSortert[0].fom;
    const daysInPeriode = dagerMellomDatoer(periode.fom, periode.tom);

    for (let i = 0; i < daysInPeriode; i++) {
      const dayCount = dagerMellomDatoer(dayZero, periode.fom) + i;
      sykmeldingsgradPerDay[dayCount] = periode.grad || 100;
    }
  });

  const dataBarChart = [...sykmeldingsgradPerDay].map(
    (grad: number, index: number) => {
      return {
        grad,
        x: index,
      };
    }
  );

  const renderTick = (tickProps: any): ReactElement<SVGElement> => {
    const { x, y, payload } = tickProps;
    const dayCount = payload.value;
    if (perioderListSortert == null || perioderListSortert.length < 1)
      return <div></div>;
    const dayZero = perioderListSortert[0].fom;
    const currentDate = dayjs(dayZero).add(dayCount, "days").toDate();
    if (currentDate.getDate() === 1) {
      const pathX = Math.floor(x - payload.offset) + 0.5;
      return <path d={`M${pathX},${y + 8}v${-15}`} stroke="grey" />;
    } else if (currentDate.getDate() === 15) {
      return (
        <text x={x} y={y + 8} textAnchor="middle" fill="#666">
          {getDatoKomponenter(currentDate).maaned.substring(0, 3)}
        </text>
      );
    }
    return <div></div>;
  };

  return (
    <Box background="surface-default" padding={"4"} className={"mb-4"}>
      <Heading size="medium" level="2">
        {texts.title}
      </Heading>
      <BodyShort size="small">{texts.subtitle}</BodyShort>
      {selectedOppfolgingstilfelle && perioderListSortert.length > 0 && (
        <BodyShort size="small">
          {tilfelleVarighetText(
            selectedOppfolgingstilfelle.start,
            selectedOppfolgingstilfelle.end,
            selectedOppfolgingstilfelle.varighetUker
          )}
        </BodyShort>
      )}

      <div className={"flex flex-row"}>
        <ResponsiveContainer width="70%" height={360}>
          <AreaChart
            data={dataBarChart}
            margin={{ top: 40, right: 30, left: 0, bottom: 30 }}
          >
            <YAxis type="number" domain={[0, 100]} tickCount={11} />
            <XAxis
              dataKey="x"
              interval={0}
              tick={renderTick}
              tickLine={false}
            />
            <Area dataKey="grad" stroke="grey" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>

        {
          <SyketilfelleList
            changeSelectedTilfelle={setSelectedOppfolgingstilfelle}
          />
        }
      </div>

      <BodyShort size="small">{texts.yAxis}</BodyShort>
      <BodyShort size="small">{texts.xAxis}</BodyShort>
    </Box>
  );
};
