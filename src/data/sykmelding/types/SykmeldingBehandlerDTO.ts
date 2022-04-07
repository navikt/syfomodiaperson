import { AdresseDTO } from "./AdresseDTO";

export interface SykmeldingBehandlerDTO {
  readonly fornavn: string;
  readonly mellomnavn?: string;
  readonly etternavn: string;
  readonly aktoerId?: string;
  readonly fnr?: string;
  readonly hpr?: string;
  readonly her?: string;
  readonly adresse: AdresseDTO;
  readonly tlf?: string;
}
