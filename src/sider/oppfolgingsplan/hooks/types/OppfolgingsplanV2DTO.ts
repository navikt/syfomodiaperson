import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export interface OppfolgingsplanV2RequestBody {
  sykmeldtFnr: string;
}

export interface OppfolgingsplanV2DTO {
  uuid: string;
  /** Fødselsnummeret til den sykmeldte som oppfølgingsplanen gjelder */
  fnr: string;
  /** Tidspunkt oppfølgingsplanen er delt med Nav. Den opprettes først av arbeidsgiver og sykmeldt. Så er det valgfritt om den skal deles med Nav.*/
  deltMedNavTidspunkt: string;
  /** Virksomhetsnummer til arbeidsgiver.*/
  virksomhetsnummer: string;
  opprettet: string;
  sistEndret: string;
  /** Datoen oppfølgingsplanen igjen skal evalueres av arbeidsgiver og den sykmeldte. */
  evalueringsdato: string;
}

export function isOppfolgingsplanWithinActiveTilfelle(
  plan: OppfolgingsplanV2DTO,
  oppfolgingstilfelle: OppfolgingstilfelleDTO
): boolean {
  return (
    new Date(plan.opprettet) >= new Date(oppfolgingstilfelle.start) &&
    new Date(plan.opprettet) <= new Date(oppfolgingstilfelle.end)
  );
}
