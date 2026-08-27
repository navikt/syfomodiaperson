import { dagerMellomDatoer } from "@/utils/datoUtils";
import dayjs from "dayjs";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";

export interface OppfolgingstilfellePersonDTO {
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[];
  personIdent: string;
  hasGjentakendeSykefravar: boolean | null;
}

export interface OppfolgingstilfelleDTO {
  arbeidstakerAtTilfelleEnd: boolean;
  start: Date;
  end: Date;
  antallSykedager: number;
  varighetUker: number;
  virksomhetsnummerList: string[];
}

export const ARBEIDSGIVERPERIODE_DAYS = 16;
export const THREE_YEARS_AGO_IN_MONTHS = 36;
export const MIN_DAYS_IN_LONG_TILFELLE = 16;

export function isInactive(oppfolgingstilfelle: OppfolgingstilfelleDTO) {
  const today = dayjs(new Date());
  const tilfelleEnd = dayjs(oppfolgingstilfelle.end);

  return today.isAfter(
    tilfelleEnd.add(ARBEIDSGIVERPERIODE_DAYS, "days"),
    "date",
  );
}

export function isDateInOppfolgingstilfelle(
  date: Date,
  oppfolgingstilfelle: OppfolgingstilfelleDTO,
) {
  return (
    new Date(oppfolgingstilfelle.start) <= new Date(date) &&
    new Date(date) <= new Date(oppfolgingstilfelle.end)
  );
}

/**
 * Sjekker om en periode ligger helt innenfor et oppfolgingstilfelle, altså at
 * bade `fom` og `tom` er innenfor tilfellets start og slutt. Sammenligningen
 * gjores pa dagniva, ettersom soknadsperioder er dato-baserte og tilfellets
 * start/slutt kan inneholde et klokkeslett.
 */
export function isPeriodeInnenforOppfolgingstilfelle(
  periode: { fom: Date; tom: Date },
  oppfolgingstilfelle: OppfolgingstilfelleDTO,
): boolean {
  const tilfelleStart = dayjs(oppfolgingstilfelle.start);
  const tilfelleEnd = dayjs(oppfolgingstilfelle.end);

  return (
    !dayjs(periode.fom).isBefore(tilfelleStart, "day") &&
    !dayjs(periode.tom).isAfter(tilfelleEnd, "day")
  );
}

/**
 * Avgjor om en eller flere av `perioder` faller helt eller delvis utenfor det
 * gjeldende oppfolgingstilfellet. Dersom det ikke finnes et oppfolgingstilfelle
 * a sammenligne mot, regnes periodene som utenfor.
 */
export function harPerioderUtenforOppfolgingstilfelle(
  perioder: { fom: Date; tom: Date }[],
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined,
): boolean {
  if (!oppfolgingstilfelle) {
    return true;
  }
  return perioder.some(
    (periode) =>
      !isPeriodeInnenforOppfolgingstilfelle(periode, oppfolgingstilfelle),
  );
}

export function aktiveNarmesteLedereForOppfolgingstilfelle(
  ledere: NarmesteLederRelasjonDTO[],
  oppfolgingsTilfelle: OppfolgingstilfelleDTO,
): NarmesteLederRelasjonDTO[] {
  return ledere.filter(
    (leder) =>
      leder.status === "INNMELDT_AKTIV" &&
      oppfolgingsTilfelle.virksomhetsnummerList.includes(
        leder.virksomhetsnummer,
      ),
  );
}

/**
 * Regner ut om en person har gjentakende sykefravær basert på oppfølgingstilfeller.
 * Beregningen skjer egentlig i backend fra isoppfolgingstilfelle, men vi har foreløpig ikke beregnet bakover i tid.
 * Dersom `oppfolgingstilfellePerson.hasGjentakendeSykefravar` er null, må vi regne det ut her i stedet.
 * Hvis vi innfører `hasGjentakendeSykefravar` for alle personer i backend, kan vi slette en del logikk her.
 */
export function hasGjentakendeSykefravar(
  oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO,
): boolean {
  if (oppfolgingstilfellePerson.hasGjentakendeSykefravar !== null) {
    return oppfolgingstilfellePerson.hasGjentakendeSykefravar;
  } else {
    const relevantTilfeller = oppfolgingstilfellePerson.oppfolgingstilfelleList
      .filter(isLongTilfelle)
      .filter(isRecentTilfelle);

    const tilfelleCount = relevantTilfeller.length;
    const accumulatedSickDays = relevantTilfeller
      .map(daysInTilfelle)
      .reduce((acc: number, currentValue: number) => acc + currentValue, 0);

    return (
      hasManySykefravar(tilfelleCount, accumulatedSickDays) ||
      hasLongSykefravar(tilfelleCount, accumulatedSickDays)
    );
  }
}

function daysInTilfelle(tilfelle: OppfolgingstilfelleDTO): number {
  return (
    tilfelle.antallSykedager ??
    dagerMellomDatoer(tilfelle.start, tilfelle.end) + 1
  );
}

function hasManySykefravar(tilfeller: number, sickdays: number): boolean {
  return tilfeller > 4 && sickdays > 100;
}

function hasLongSykefravar(tilfeller: number, sickdays: number): boolean {
  return tilfeller > 1 && sickdays > 300;
}

function isLongTilfelle(tilfelle: OppfolgingstilfelleDTO): boolean {
  const numberOfDaysInTilfelle = daysInTilfelle(tilfelle);
  return numberOfDaysInTilfelle >= MIN_DAYS_IN_LONG_TILFELLE;
}

function isRecentTilfelle(tilfelle: OppfolgingstilfelleDTO): boolean {
  const threeYearsAgo = dayjs(new Date())
    .subtract(THREE_YEARS_AGO_IN_MONTHS, "month")
    .toDate();
  const tilfelleEnd = dayjs(tilfelle.end);

  return (
    tilfelleEnd.isAfter(threeYearsAgo, "day") ||
    tilfelleEnd.isSame(threeYearsAgo, "day")
  );
}
