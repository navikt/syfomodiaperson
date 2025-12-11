import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export interface OppfolgingsplanV2RequestBody {
  sykmeldtFnr: string;
}

export interface OppfolgingsplanV2DTO {
  uuid: string;
  /** Fødselsnummeret til den sykmeldte som oppfølgingsplanen gjelder.*/
  fnr: string;
  /** Tidspunkt oppfølgingsplanen er delt med Nav. Den opprettes først av arbeidsgiver og sykmeldt. Så er det valgfritt om den skal deles med Nav.*/
  deltMedNavTidspunkt: string;
  /** Virksomhetsnummer til arbeidsgiver.*/
  virksomhetsnummer: string;
  /** Dato oppfolgingsplanen ble opprettet. ISO 8601 format.*/
  opprettet: string;
  /** Dato oppfolgingsplanen sist ble endret. ISO 8601 format.*/
  sistEndret: string;
  /** Datoen oppfølgingsplanen igjen skal evalueres av arbeidsgiver og den sykmeldte. ISO 8601 format.*/
  evalueringsdato: string;
}

function isOppfolgingsplanWithinActiveTilfelle(
  plan: OppfolgingsplanV2DTO,
  oppfolgingstilfelle: OppfolgingstilfelleDTO
): boolean {
  return new Date(plan.opprettet) >= new Date(oppfolgingstilfelle.start);
}

/**
 * Partisjonerer en liste av oppfølgingsplaner i aktive og inaktive basert på om oppfølgingsplanen er opprettet innenfor det siste oppfølgingstilfellet.
 * @param planer Liste over alle historiske oppfølgingsplaner som skal partisjoneres.
 * @param latestOppfolgingstilfelle Det siste oppfølgingstilfellet.
 * @returns En tuple \`[aktivePlaner, inaktivePlaner]\` der første element inneholder planer innenfor perioden,
 *          og andre element inneholder alle andre planer.
 */
export function partitionOppfolgingsplanerByActiveTilfelle(
  planer: OppfolgingsplanV2DTO[],
  latestOppfolgingstilfelle: OppfolgingstilfelleDTO
): [OppfolgingsplanV2DTO[], OppfolgingsplanV2DTO[]] {
  const [aktivePlaner, inaktivePlaner] = planer.reduce(
    (acc, plan) => {
      if (
        isOppfolgingsplanWithinActiveTilfelle(plan, latestOppfolgingstilfelle)
      ) {
        acc[0].push(plan);
      } else {
        acc[1].push(plan);
      }
      return acc;
    },
    [[], []] as [OppfolgingsplanV2DTO[], OppfolgingsplanV2DTO[]]
  );
  return [aktivePlaner, inaktivePlaner];
}
