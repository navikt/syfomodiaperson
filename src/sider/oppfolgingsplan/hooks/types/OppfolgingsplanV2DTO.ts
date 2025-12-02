interface OppfolgingsplanV2RequestBody {
  sykmeldtFnr: string;
}

interface OppfolgingsplanV2DTO {
  uuid: string;
  fnr: string;
  deltMedNavTidspunkt: Date; // type Instant i backend
  virksomhetsnummer: string;
  opprettet: Date; // type Instant i backend
  sistEndret: Date; // type Instant i backend
  evalueringsdato: Date; // type LocalDate i backend
}
