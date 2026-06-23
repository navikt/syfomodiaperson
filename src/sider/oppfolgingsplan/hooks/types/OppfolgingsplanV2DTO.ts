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
  oppfolgingstilfelle: OppfolgingstilfelleDTO,
  isLatestTilfelle = false,
): boolean {
  const tilfelleStart = new Date(oppfolgingstilfelle.start);
  const planOpprettet = new Date(plan.opprettet);
  if (isLatestTilfelle) {
    return planOpprettet >= tilfelleStart;
  }
  const tilfelleEnd = new Date(oppfolgingstilfelle.end);
  return tilfelleStart <= planOpprettet && planOpprettet <= tilfelleEnd;
}

/**
 * Partisjonerer en liste av oppfølgingsplaner i aktive og inaktive basert på om oppfølgingsplanen er opprettet innenfor det siste oppfølgingstilfellet.
 * Kun den siste planen (nyeste `opprettet`) per virksomhet innenfor det aktive tilfellet regnes som aktiv.
 * @param planer Liste over alle historiske oppfølgingsplaner som skal partisjoneres.
 * @param latestOppfolgingstilfelle Det siste oppfølgingstilfellet.
 * @param isLatestTilfelle Om det valgte tilfellet er det siste registrerte. Når true sammenlignes kun mot start-dato (ikke slutt-dato).
 * @returns En tuple \`[aktivePlaner, inaktivePlaner]\` der første element inneholder den siste planen per virksomhet innenfor perioden,
 *          og andre element inneholder alle andre planer.
 */
export function partitionOppfolgingsplanerByActiveTilfelle(
  planer: OppfolgingsplanV2DTO[],
  latestOppfolgingstilfelle: OppfolgingstilfelleDTO,
  isLatestTilfelle = false,
): [OppfolgingsplanV2DTO[], OppfolgingsplanV2DTO[]] {
  const planerInnenforTilfelle: OppfolgingsplanV2DTO[] = [];
  const planerUtenforTilfelle: OppfolgingsplanV2DTO[] = [];

  for (const plan of planer) {
    if (
      isOppfolgingsplanWithinActiveTilfelle(
        plan,
        latestOppfolgingstilfelle,
        isLatestTilfelle,
      )
    ) {
      planerInnenforTilfelle.push(plan);
    } else {
      planerUtenforTilfelle.push(plan);
    }
  }

  const sistePerVirksomhet = new Map<string, OppfolgingsplanV2DTO>();
  for (const plan of planerInnenforTilfelle) {
    const existing = sistePerVirksomhet.get(plan.virksomhetsnummer);
    if (!existing || new Date(plan.opprettet) > new Date(existing.opprettet)) {
      sistePerVirksomhet.set(plan.virksomhetsnummer, plan);
    }
  }

  const aktivePlaner = [...sistePerVirksomhet.values()];
  const aktiveUuids = new Set(aktivePlaner.map((p) => p.uuid));
  const inaktivePlaner = [
    ...planerInnenforTilfelle.filter((p) => !aktiveUuids.has(p.uuid)),
    ...planerUtenforTilfelle,
  ];

  return [aktivePlaner, inaktivePlaner];
}
