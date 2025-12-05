import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

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
