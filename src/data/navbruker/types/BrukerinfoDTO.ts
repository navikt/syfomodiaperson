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
  vergemal: Vergemal[];
}

interface TilrettelagtKommunikasjon {
  talesprakTolk: Sprak | null;
  tegnsprakTolk: Sprak | null;
}

interface Sprak {
  value: string;
}

// https://pdl-docs.ansatt.nav.no/ekstern/index.html#_sikkerhetstiltak
export enum Tiltakstype {
  FYUS = "FYUS",
  TFUS = "TFUS",
  FTUS = "FTUS",
  DIUS = "DIUS",
  TOAN = "TOAN",
}

interface Sikkerhetstiltak {
  type: Tiltakstype;
  beskrivelse: string;
  gyldigFom: string;
  gyldigTom: string;
}

// https://pdl-docs.ansatt.nav.no/ekstern/index.html#_vergem%C3%A5l_eller_fremtidsfullmakt
interface Vergemal {
  type: VergemalType;
}

type VergemalType =
  | "ENSLIG_MINDREARIG_ASYLSOEKER"
  | "ENSLIG_MINDREARIG_FLYKTNING"
  | "VOKSEN"
  | "MIDLERTIDIG_FOR_VOKSEN"
  | "MINDREARIG"
  | "MIDLERTIDIG_FOR_MINDREARIG";
