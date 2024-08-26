import {
  AktivitetskravDTO,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

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
    return new Date(vurdering.varsel.svarfrist) <= new Date();
  }

  return false;
};
