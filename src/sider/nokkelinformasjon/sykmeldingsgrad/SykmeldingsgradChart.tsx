import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import React, { ReactElement } from "react";
import dayjs from "dayjs";
import { dagerMellomDatoer, getDatoKomponenter } from "@/utils/datoUtils";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface Props {
  sykmeldingsperioder: SykmeldingPeriodeDTO[];
}

export default function SykmeldingsgradChart({ sykmeldingsperioder }: Props) {
  const varighetOppfolgingstilfelle =
    sykmeldingsperioder.length === 0
      ? 0
      : dagerMellomDatoer(
          sykmeldingsperioder[0].fom,
          sykmeldingsperioder[sykmeldingsperioder.length - 1].tom
        );
  const oneYearInDays = 52 * 7;
  const DAYS_IN_GRAPH =
    varighetOppfolgingstilfelle > oneYearInDays
      ? varighetOppfolgingstilfelle
      : oneYearInDays;
  const sykmeldingsgradPerDay = new Int32Array(DAYS_IN_GRAPH);

  sykmeldingsperioder.forEach((periode) => {
    const dayZero = sykmeldingsperioder[0].fom;
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

  function renderTick(tickProps: any): ReactElement<SVGElement> {
    const { x, y, payload } = tickProps;
    const dayCount = payload.value;
    if (sykmeldingsperioder == null || sykmeldingsperioder.length < 1)
      return <div></div>;
    const dayZero = sykmeldingsperioder[0].fom;
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
  }

  return (
    <ResponsiveContainer width="70%" height={360}>
      <AreaChart
        data={dataBarChart}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <YAxis type="number" domain={[0, 100]} tickCount={11} />
        <XAxis dataKey="x" interval={0} tick={renderTick} tickLine={false} />
        <Area dataKey="grad" stroke="grey" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
