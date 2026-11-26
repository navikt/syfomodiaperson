import {
  EregNaringDTO,
  EregOrganisasjonResponseDTO,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import { NaringskodeStandard } from "@/data/virksomhet/Naringskode";

export const STANDARD_1994_DATE_FOM = new Date("1994-01-01");
export const STANDARD_2002_DATE_FOM = new Date("2002-01-01");
export const STANDARD_2007_DATE_FOM = new Date("2009-01-01");
export const STANDARD_2025_DATE_FOM = new Date("2025-09-01");

export function isValidNaring(naring: EregNaringDTO): boolean {
  const gyldigFom = naring.bruksperiode?.fom
    ? new Date(naring.bruksperiode.fom)
    : null;
  const gyldigTom = naring.bruksperiode?.tom
    ? new Date(naring.bruksperiode.tom)
    : null;

  if (gyldigFom && gyldigFom > new Date()) {
    return false;
  } else if (gyldigTom && gyldigTom < new Date()) {
    return false;
  }
  return true;
}

export function getStandardForNaring(
  naring: EregNaringDTO,
): NaringskodeStandard | null {
  const gyldigFom = naring.bruksperiode?.fom
    ? new Date(naring.bruksperiode.fom)
    : null;

  if (gyldigFom && gyldigFom >= STANDARD_2025_DATE_FOM) {
    return 2025;
  }
  if (gyldigFom && gyldigFom >= STANDARD_2007_DATE_FOM) {
    return 2007;
  }
  if (gyldigFom && gyldigFom >= STANDARD_2002_DATE_FOM) {
    return 2002;
  }
  if (gyldigFom && gyldigFom >= STANDARD_1994_DATE_FOM) {
    return 1994;
  }
  return null;
}

export function toNaringskodeRequest(
  virksomhet: EregOrganisasjonResponseDTO,
): { naringskode: string; standard: NaringskodeStandard }[] {
  const seen = new Set<string>();

  return (
    virksomhet.organisasjonDetaljer?.naeringer?.flatMap((naring) => {
      if (!isValidNaring(naring)) {
        return [];
      }

      const standard = getStandardForNaring(naring);
      if (standard === null) {
        return [];
      }

      const key = `${standard}:${naring.naeringskode}`;
      if (seen.has(key)) return [];

      seen.add(key);

      return [{ naringskode: naring.naeringskode, standard }];
    }) ?? []
  );
}
