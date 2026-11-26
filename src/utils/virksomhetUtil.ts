import dayjs from "dayjs";
import {
  EregOrganisasjonEnrichedDTO,
  EregOrganisasjonReferanseDTO,
  EregOrganisasjonResponseDTO,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";

/**
 * Returns the nearest current parent number, preferring an organisational section over a legal entity.
 * Overlapping relationships are resolved by the latest valid start date.
 * Returns null when no current parent reference exists.
 */
export function getOverordnetEnhetOrganisasjonsnummer(
  virksomhet: EregOrganisasjonResponseDTO,
): string | null {
  if (virksomhet.type === "JuridiskEnhet") {
    return null;
  }

  const organisasjonsledd =
    virksomhet.type === "Virksomhet"
      ? virksomhet.bestaarAvOrganisasjonsledd
      : virksomhet.organisasjonsleddOver;
  const organisasjonsleddReferanser = organisasjonsledd?.map(
    ({ organisasjonsledd, gyldighetsperiode }) => ({
      organisasjonsnummer: organisasjonsledd?.organisasjonsnummer,
      gyldighetsperiode,
    }),
  );

  return (
    getGjeldendeOrganisasjonsnummer(organisasjonsleddReferanser) ??
    getGjeldendeOrganisasjonsnummer(virksomhet.inngaarIJuridiskEnheter) ??
    null
  );
}

function getGjeldendeOrganisasjonsnummer(
  referanser: EregOrganisasjonReferanseDTO[] | undefined,
): string | undefined {
  const today = dayjs();
  return referanser
    ?.filter(({ organisasjonsnummer, gyldighetsperiode }) => {
      const { fom, tom } = gyldighetsperiode ?? {};
      return (
        !!organisasjonsnummer &&
        (!fom || !today.isBefore(dayjs(fom), "day")) &&
        (!tom || !today.isAfter(dayjs(tom), "day"))
      );
    })
    .sort((a, b) => {
      const fomA = a.gyldighetsperiode?.fom ?? "";
      const fomB = b.gyldighetsperiode?.fom ?? "";
      return (
        fomB.localeCompare(fomA) ||
        (a.organisasjonsnummer ?? "").localeCompare(b.organisasjonsnummer ?? "")
      );
    })[0]?.organisasjonsnummer;
}

/** Joins fetched organisations with their nearest current parent without mutating either input. */
export function enrichWithOverordnedeEnheter(
  virksomheter: EregOrganisasjonResponseDTO[],
  overordnedeEnheter: EregOrganisasjonResponseDTO[],
): EregOrganisasjonEnrichedDTO[] {
  const overordnedeEnheterByNummer = new Map(
    overordnedeEnheter
      .filter(
        (enhet) =>
          enhet.type === "JuridiskEnhet" || enhet.type === "Organisasjonsledd",
      )
      .map((enhet) => [enhet.organisasjonsnummer, enhet] as const),
  );

  return virksomheter.map((virksomhet) => {
    if (virksomhet.type === "JuridiskEnhet") {
      return { ...virksomhet, overordnetEnhet: virksomhet };
    }

    const nummer = getOverordnetEnhetOrganisasjonsnummer(virksomhet);
    return {
      ...virksomhet,
      overordnetEnhet: nummer
        ? overordnedeEnheterByNummer.get(nummer)
        : undefined,
    };
  });
}
