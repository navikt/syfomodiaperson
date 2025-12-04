import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import dayjs from "dayjs";
import {
  MIN_DAYS_IN_LONG_TILFELLE,
  THREE_YEARS_AGO_IN_MONTHS,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { dagerMellomDatoer } from "@/utils/datoUtils";

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

function accumulateSickdays(acc: number, dayCount: number): number {
  return acc + dayCount;
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

/**
 * Regner ut om en person har gjentakende sykefravær basert på oppfølgingstilfeller.
 * Beregningen skjer egentlig i backend fra isoppfolgingstilfelle, men vi har foreløpig ikke beregnet bakover i tid.
 * Dersom `oppfolgingstilfellePerson.hasGjentakendeSykefravar` er null, må vi regne det ut her i stedet.
 * Hvis vi innfører `hasGjentakendeSykefravar` for alle personer i backend, kan vi slette en del logikk her.
 */
export function hasGjentakendeSykefravar(
  oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO
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
      .reduce(accumulateSickdays, 0);

    return (
      hasManySykefravar(tilfelleCount, accumulatedSickDays) ||
      hasLongSykefravar(tilfelleCount, accumulatedSickDays)
    );
  }
}

function latestTilfelleDifference(
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
): number {
  return new Date(b.start).getTime() - new Date(a.start).getTime();
}

function longestTilfelleDifference(
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
): number {
  return new Date(b.end).getTime() - new Date(a.end).getTime();
}

function byLatestAndLongestTilfelle(
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
): number {
  const startDateDifference = latestTilfelleDifference(a, b);
  if (startDateDifference === 0) {
    return longestTilfelleDifference(a, b);
  }
  return startDateDifference;
}

export function sortByDescendingStart(
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[]
): OppfolgingstilfelleDTO[] {
  return oppfolgingstilfelleList.sort(byLatestAndLongestTilfelle);
}
