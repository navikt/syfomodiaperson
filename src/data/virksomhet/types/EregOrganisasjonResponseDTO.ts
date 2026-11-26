/**
 * Partial Ereg v1 organisation response, discriminated by organisation type.
 * Empty fields are omitted by the API; dates are ISO-8601 strings.
 */
export type EregOrganisasjonResponseDTO =
  | EregVirksomhetDTO
  | EregJuridiskEnhetDTO
  | EregOrganisasjonsleddDTO;

/** Ereg organisation data enriched with its nearest current parent when available. */
export type EregOrganisasjonEnrichedDTO = EregOrganisasjonResponseDTO & {
  overordnetEnhet?: EregOrganisasjonsleddDTO | EregJuridiskEnhetDTO;
};

type EregOrganisasjonBaseDTO = {
  organisasjonsnummer?: string;
  navn?: EregOrganisasjonNavnDTO;
};

type EregOrganisasjonFellesDTO = EregOrganisasjonBaseDTO & {
  organisasjonDetaljer?: EregOrganisasjonDetaljerDTO;
};

/** Organisation response for a virksomhet. */
export type EregVirksomhetDTO = EregOrganisasjonFellesDTO & {
  type: "Virksomhet";
  bestaarAvOrganisasjonsledd?: EregBestaarAvOrganisasjonsleddDTO[];
  inngaarIJuridiskEnheter?: EregOrganisasjonReferanseDTO[];
  virksomhetDetaljer?: EregVirksomhetDetaljerDTO;
};

/** Organisation response for a juridisk enhet. */
export type EregJuridiskEnhetDTO = EregOrganisasjonFellesDTO & {
  type: "JuridiskEnhet";
  juridiskEnhetDetaljer?: EregJuridiskEnhetDetaljerDTO;
};

/** Organisation response for an organisasjonsledd. */
export type EregOrganisasjonsleddDTO = EregOrganisasjonFellesDTO & {
  type: "Organisasjonsledd";
  organisasjonsleddOver?: EregBestaarAvOrganisasjonsleddDTO[];
  inngaarIJuridiskEnheter?: EregOrganisasjonReferanseDTO[];
  organisasjonsleddDetaljer?: EregOrganisasjonsleddDetaljerDTO;
};

/** Recorded period, using ISO local date-times without timezone offsets. */
export type EregBruksperiodeDTO = {
  fom?: string;
  tom?: string;
};

/** Validity period, using ISO local dates (yyyy-MM-dd). */
export type EregGyldighetsperiodeDTO = {
  fom?: string;
  tom?: string;
};

type EregPeriodisertDTO = {
  bruksperiode?: EregBruksperiodeDTO;
  gyldighetsperiode?: EregGyldighetsperiodeDTO;
};

/** An organisational section and the recorded and validity periods of its relationship. */
export type EregBestaarAvOrganisasjonsleddDTO = EregPeriodisertDTO & {
  organisasjonsledd?: EregOrganisasjonsleddDTO;
};

/** Organisation number and name, with the relationship's recorded and validity periods. */
export type EregOrganisasjonReferanseDTO = EregOrganisasjonBaseDTO &
  EregPeriodisertDTO;

/** Organisation name, including historical validity information. */
export type EregOrganisasjonNavnDTO = EregPeriodisertDTO & {
  redigertnavn?: string;
  navnelinje1?: string;
  navnelinje2?: string;
  navnelinje3?: string;
  navnelinje4?: string;
  navnelinje5?: string;
};

type EregAdresseDTO = EregPeriodisertDTO & {
  adresselinje1?: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postnummer?: string;
  poststed?: string;
  kommunenummer?: string;
  landkode?: string;
};

/** Postal address with validity information. */
export type EregPostadresseDTO = EregAdresseDTO & {
  type: "Postadresse";
};

/** Business address with validity information. */
export type EregForretningsadresseDTO = EregAdresseDTO & {
  type: "Forretningsadresse";
};

/** Common details and historical records for an organisation. */
export type EregOrganisasjonDetaljerDTO = {
  registreringsdato?: string;
  stiftelsesdato?: string;
  opphoersdato?: string;
  sistEndret?: string;
  naeringer?: EregNaringDTO[];
  forretningsadresser?: EregForretningsadresseDTO[];
  postadresser?: EregPostadresseDTO[];
};

/** Details specific to a virksomhet; date values are ISO local dates. */
export type EregVirksomhetDetaljerDTO = {
  oppstartsdato?: string;
  eierskiftedato?: string;
  nedleggelsesdato?: string;
  enhetstype?: string;
  ubemannetVirksomhet?: boolean;
};

/** Partial details specific to a juridisk enhet. */
export type EregJuridiskEnhetDetaljerDTO = {
  sektorkode?: string;
};

/** Partial details specific to an organisasjonsledd. */
export type EregOrganisasjonsleddDetaljerDTO = {
  sektorkode?: string;
};

/** Naringskode and hjelpeenhet status. */
export type EregNaringDTO = EregPeriodisertDTO & {
  naeringskode: string;
  hjelpeenhet?: boolean;
};

/** Returns the edited name, the first name line, or an empty string if absent. */
export function getVirksomhetsnavn(
  eregOrganisasjonResponseDTO: EregOrganisasjonResponseDTO,
): string {
  const redigertnavn = eregOrganisasjonResponseDTO.navn?.redigertnavn;
  if (redigertnavn && redigertnavn.length > 0) {
    return redigertnavn;
  } else {
    return eregOrganisasjonResponseDTO.navn?.navnelinje1 ?? "";
  }
}
