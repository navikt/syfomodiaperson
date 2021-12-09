import dayjs from "dayjs";
import { Utbetalingslinje, VedtakDTO } from "@/data/vedtak/vedtakTypes";

interface Dag {
  dato: string;
  beløp: number;
}

export const erHelg = (dato: Date): boolean =>
  dato.getDay() === 6 || dato.getDay() === 0;

export const estimertMaksdato = (vedtak: VedtakDTO): string => {
  let slutt = dayjs(vedtak.vedtak.tom);
  let x = 0;
  while (x < vedtak.vedtak.utbetaling.gjenståendeSykedager) {
    slutt = slutt.add(1, "day");
    while (erHelg(slutt.toDate())) {
      slutt = slutt.add(1, "day");
    }
    x++;
  }
  return slutt.format("DD.MM.YYYY");
};

const utbetalingslinjerTilDager = (
  utbetalingslinjer: Utbetalingslinje[]
): Dag[] => {
  const dager: Dag[] = [];

  utbetalingslinjer.forEach((linje) => {
    let start = dayjs(linje.fom);
    const slutt = dayjs(linje.tom);

    while (start <= slutt) {
      if (!erHelg(start.toDate())) {
        dager.push({
          dato: start.toString(),
          beløp: linje.totalBeløp,
        });
      }
      start = start.add(1, "day");
    }
  });

  return dager;
};

const dagerInnenforPeriode = (dager: Dag[], vedtak: VedtakDTO): Dag[] => {
  const min = dayjs(vedtak.vedtak.fom).toDate();
  const max = dayjs(vedtak.vedtak.tom).toDate();
  return dager.filter((dag) => {
    const dato = dayjs(dag.dato).toDate();
    return dato >= min && dato <= max;
  });
};

export const refusjonsdagerInnenforVedtakPeriode = (
  vedtak: VedtakDTO
): Dag[] => {
  if (vedtak.vedtak.utbetaling.arbeidsgiverOppdrag === undefined) {
    return [];
  }
  const refusjoner =
    vedtak.vedtak.utbetaling.arbeidsgiverOppdrag.utbetalingslinjer;
  const refusjonsdager = utbetalingslinjerTilDager(refusjoner);
  return dagerInnenforPeriode(refusjonsdager, vedtak);
};

export const refusjonTilUtbetalingsdager = (vedtak?: VedtakDTO): number =>
  vedtak ? refusjonsdagerInnenforVedtakPeriode(vedtak).length : 0;

export const groupVedtakByOrgnr = (vedtak: VedtakDTO[]): VedtakDTO[][] => {
  const orgMap = vedtak.reduce(
    (acc: Map<string, VedtakDTO[]>, currentValue: VedtakDTO) => {
      const orgnr = currentValue.vedtak.organisasjonsnummer || "";

      if (!acc.has(orgnr)) {
        acc.set(orgnr, [currentValue]);
        return acc;
      }

      const listOfVedtak = acc.get(orgnr);

      if (listOfVedtak !== undefined) {
        acc.set(orgnr, [...listOfVedtak, currentValue]);
      }

      return acc;
    },
    new Map<string, VedtakDTO[]>()
  );

  return [...orgMap.values()];
};
