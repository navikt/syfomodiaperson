import {
  AktivitetskravDTO,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import dayjs from "dayjs";

export const oppfolgingstilfelleForAktivitetskrav = (
  aktivitetskrav: AktivitetskravDTO,
  oppfolgingstilfeller: OppfolgingstilfelleDTO[]
): OppfolgingstilfelleDTO | undefined => {
  return oppfolgingstilfeller.find((tilfelle) =>
    gjelderOppfolgingstilfelle(aktivitetskrav, tilfelle)
  );
};

export const gjelderOppfolgingstilfelle = (
  aktivitetskrav: AktivitetskravDTO,
  oppfolgingstilfelle: OppfolgingstilfelleDTO
): boolean => {
  return (
    aktivitetskrav.stoppunktAt > oppfolgingstilfelle.start &&
    aktivitetskrav.stoppunktAt <= oppfolgingstilfelle.end
  );
};

export const isExpiredForhandsvarsel = (
  vurdering: AktivitetskravVurderingDTO
): boolean => {
  if (vurdering.varsel?.svarfrist) {
    const svarfrist = dayjs(vurdering.varsel.svarfrist);
    const today = dayjs(new Date());
    return svarfrist.isBefore(today, "date");
  }

  return false;
};
