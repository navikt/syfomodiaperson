import { KJOENN } from "@/konstanter";

export interface KontaktinfoDTO {
  epost?: string;
  tlf?: string;
  skalHaVarsel: boolean;
}

export interface BrukerinfoDTO {
  navn: string;
  aktivPersonident: string;
  arbeidssituasjon: string;
  kjonn: string | null;
  fodselsdato: string | null;
  alder: number | null;
  dodsdato: string | null;
  tilrettelagtKommunikasjon: TilrettelagtKommunikasjon | null;
  sikkerhetstiltak: Sikkerhetstiltak[];
}

interface TilrettelagtKommunikasjon {
  talesprakTolk: Sprak | null;
  tegnsprakTolk: Sprak | null;
}

interface Sprak {
  value: string;
}

/* https://pdl-docs.dev.intern.nav.no/ekstern/index.html#_sikkerhetstiltak */
enum Tiltakstype {
  FYUS = "FYUS",
  TFUS = "TFUS",
  FTUS = "FTUS",
  DIUS = "DIUS",
  TOAN = "TOAN",
}

interface Sikkerhetstiltak {
  type: Tiltakstype;
  beskrivelse: string;
  gyldigFom: Date;
  gyldigTom: Date;
}

export function mapKjoennFromDto(kjonn: string | null): KJOENN {
  switch (kjonn) {
    case KJOENN.MANN:
      return KJOENN.MANN;
    case KJOENN.KVINNE:
      return KJOENN.KVINNE;
    default:
      return KJOENN.UKJENT;
  }
}
