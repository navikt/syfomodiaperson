import { Area, AreaChart, XAxis, YAxis } from "recharts";
import React, { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { Normaltekst, Systemtittel } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import {
  sykmeldingerInnenforSisteOppfolgingstilfelle,
  sykmeldingerMedStatusSendt,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import {
  dagerMellomDatoer,
  getDatoKomponenter,
  leggTilDagerPaDato,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { OppfolgingstilfellePersonDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

const texts = {
  title: "Sykmeldingsgrad",
  subtitle: "Endringer i sykmeldingsgrad",
  tilfelleVarighet: "Siste tilfellet sin varighet: ",
  xAxis: "X-akse: måned i tilfellet",
  yAxis: "Y-akse: sykmeldingsgrad",
};

interface SykmeldingsgradProps {
  oppfolgingstilfellePerson?: OppfolgingstilfellePersonDTO;
  sykmeldinger: SykmeldingOldFormat[];
}

export const Sykmeldingsgrad = ({
  sykmeldinger,
  oppfolgingstilfellePerson,
}: SykmeldingsgradProps) => {
  const innsendteSykmeldinger = sykmeldingerMedStatusSendt(sykmeldinger);
  const sisteOppfolgingstilfelle =
    oppfolgingstilfellePerson?.oppfolgingstilfelleList[0];
  const sykmeldingerIOppfolgingstilfellet = sykmeldingerInnenforSisteOppfolgingstilfelle(
    innsendteSykmeldinger,
    sisteOppfolgingstilfelle
  );

  console.log("sisteOppfolgingstilfelle", sisteOppfolgingstilfelle);

  const DAYS_IN_GRAPH = 55 * 7;
  const sykmeldingsgradPerDay = new Int32Array(DAYS_IN_GRAPH);

  const perioderListSortert = sykmeldingerIOppfolgingstilfellet
    .flatMap((sykmelding) => sykmelding.mulighetForArbeid.perioder)
    .sort((a, b) => a.fom.getTime() - b.fom.getTime());

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
      return <></>;
    const dayZero = perioderListSortert[0].fom;
    const currentDate = leggTilDagerPaDato(dayZero, dayCount);
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
    return <></>;
  };

  return (
    <Panel className="blokk">
      <Systemtittel>{texts.title}</Systemtittel>
      <Normaltekst>{texts.subtitle}</Normaltekst>
      {sisteOppfolgingstilfelle && perioderListSortert.length > 0 && (
        <Normaltekst>
          {texts.tilfelleVarighet}
          {tilLesbarPeriodeMedArstall(
            sisteOppfolgingstilfelle.start,
            sisteOppfolgingstilfelle.end
          )}
        </Normaltekst>
      )}
      <AreaChart
        width={750}
        height={360}
        data={dataBarChart}
        margin={{ top: 40, right: 30, left: 0, bottom: 30 }}
      >
        <YAxis type="number" domain={[0, 100]} tickCount={11} />
        <XAxis dataKey="x" interval={0} tick={renderTick} tickLine={false} />
        <Area dataKey="grad" stroke="grey" fill="#8884d8" />
      </AreaChart>
      <Normaltekst>{texts.yAxis}</Normaltekst>
      <Normaltekst>{texts.xAxis}</Normaltekst>
    </Panel>
  );
};
