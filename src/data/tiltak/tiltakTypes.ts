/**
 * Request for å hente aktive tiltak for en person.
 */
export interface TiltakRequestDTO {
  personident: string;
}

/**
 * Et aktivt arbeidsmarkedstiltak fra tiltakshistorikken til Team Valp.
 *
 * `tiltakskode` er en string fordi nye tiltakskoder kan publiseres uten ny versjon av API-et.
 */
export interface TiltakDTO {
  id: string;
  tittel: string;
  tiltakskode: string;
  tiltakstypeNavn: string;
  startDato: string | null;
  sluttDato: string | null;
}

/**
 * Respons med personens aktive tiltak. Backend filtrerer bort tiltak som ikke er aktive.
 */
export interface TiltakResponseDTO {
  tiltak: TiltakDTO[];
}
