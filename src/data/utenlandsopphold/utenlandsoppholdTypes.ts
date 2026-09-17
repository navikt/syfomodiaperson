import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes.ts";
import { addDays } from "@/utils/datoUtils.ts";
import dayjs from "dayjs";

export interface SoknaderQueryDTO {
  personident: string;
}

export interface SoknaderResponseDTO {
  soknader: SoknadDTO[];
}

/**
 * Felles responstype for handlingene som behandler én søknad (vedtak,
 * henleggelse og ikke-aktuell). Alle returnerer den ferdigbehandlede
 * søknaden slik den nå ser ut i backend.
 */
export interface SoknadResponseDTO {
  soknad: SoknadDTO;
}

export interface SoknadVedtakPostDTO {
  utfall: VedtakUtfall;
  innvilgedePerioder: PeriodeDTO[];
  document: DocumentComponentDto[];
  begrunnelse: string | null;
}

/**
 * Henleggelse er et eget endepunkt i v2, atskilt fra `/vedtak`. En
 * henleggelse genererer et brev, men er ikke et vedtaksutfall, og krever
 * derfor alltid en begrunnelse.
 */
export interface SoknadHenleggelsePostDTO {
  document: DocumentComponentDto[];
  begrunnelse: string;
}

/**
 * Grunner en veileder kan velge når en søknad settes til «Ikke aktuell».
 * I motsetning til vedtaksutfallene genererer denne handlingen ikke noe
 * brev til sykmeldte.
 */
export enum IkkeAktuellGrunnDTO {
  BEHANDLET_I_INFOTRYGD = "BEHANDLET_I_INFOTRYGD",
  DUPLIKAT = "DUPLIKAT",
  ANNET = "ANNET",
}

export interface SoknadIkkeAktuellPostDTO {
  grunn: IkkeAktuellGrunnDTO;
}

export interface SoknadDTO {
  soknadId: string;
  eksternId: string;
  status: SoknadStatusDTO;
  innsendtTidspunkt: string;
  soktePerioder: PeriodeDTO[];
  behandling: BehandlingDTO | null;
}

export interface PeriodeDTO {
  fom: string;
  tom: string;
}

interface BehandlingBaseDTO {
  behandletAv: string;
  behandletTidspunkt: string;
}

export interface InnvilgetBehandlingDTO extends BehandlingBaseDTO {
  utfall: "INNVILGET";
  innvilgedePerioder: PeriodeDTO[];
}

export interface DelvisInnvilgetBehandlingDTO extends BehandlingBaseDTO {
  utfall: "DELVIS_INNVILGET";
  innvilgedePerioder: PeriodeDTO[];
  begrunnelse: string;
}

export interface AvslagBehandlingDTO extends BehandlingBaseDTO {
  utfall: "AVSLAG";
  begrunnelse: string;
}

export interface HenlagtBehandlingDTO extends BehandlingBaseDTO {
  utfall: "HENLAGT";
  begrunnelse: string;
}

export interface IkkeAktuellBehandlingDTO extends BehandlingBaseDTO {
  utfall: "IKKE_AKTUELL";
  ikkeAktuellGrunn: IkkeAktuellGrunnDTO;
}

/**
 * Behandlingen slik den kommer fra v2-backend. Ett polymorft felt der `utfall`
 * skiller variantene, slik at hver variant kun bærer feltene som gjelder for
 * sitt utfall.
 */
export type BehandlingDTO =
  | InnvilgetBehandlingDTO
  | DelvisInnvilgetBehandlingDTO
  | AvslagBehandlingDTO
  | HenlagtBehandlingDTO
  | IkkeAktuellBehandlingDTO;

export enum SoknadStatusDTO {
  MOTTATT = "MOTTATT",
  INNVILGET = "INNVILGET",
  DELVIS_INNVILGET = "DELVIS_INNVILGET",
  AVSLAG = "AVSLAG",
  HENLAGT = "HENLAGT",
  IKKE_AKTUELL = "IKKE_AKTUELL",
}

// Types
export type Utfall = "INNVILGET" | "DELVIS_INNVILGET" | "AVSLAG" | "HENLAGT";

/**
 * Utfallene `/vedtak`-endepunktet i v2 tar imot. Henleggelse har fått eget
 * endepunkt, så `HENLAGT` er ikke lenger et gyldig vedtaksutfall.
 */
export type VedtakUtfall = Exclude<Utfall, "HENLAGT">;

export type BehandlingUtfall = Utfall | "IKKE_AKTUELL";

export interface Soknad extends Omit<
  SoknadDTO,
  "innsendtTidspunkt" | "soktePerioder" | "behandling"
> {
  innsendtTidspunkt: Date;
  soktePerioder: Periode[];
  behandling: Behandling | null;
}

interface BehandlingBase {
  behandletAv: string;
  behandletTidspunkt: Date;
}

export interface InnvilgetBehandling extends BehandlingBase {
  utfall: "INNVILGET";
  innvilgedePerioder: Periode[];
}

export interface DelvisInnvilgetBehandling extends BehandlingBase {
  utfall: "DELVIS_INNVILGET";
  innvilgedePerioder: Periode[];
  begrunnelse: string;
}

export interface AvslagBehandling extends BehandlingBase {
  utfall: "AVSLAG";
  begrunnelse: string;
}

export interface HenlagtBehandling extends BehandlingBase {
  utfall: "HENLAGT";
  begrunnelse: string;
}

export interface IkkeAktuellBehandling extends BehandlingBase {
  utfall: "IKKE_AKTUELL";
  ikkeAktuellGrunn: IkkeAktuellGrunnDTO;
}

export type Behandling =
  | InnvilgetBehandling
  | DelvisInnvilgetBehandling
  | AvslagBehandling
  | HenlagtBehandling
  | IkkeAktuellBehandling;

export interface Periode extends Omit<PeriodeDTO, "fom" | "tom"> {
  fom: Date;
  tom: Date;
}

// Parsers
export const parsePeriode = (periode: PeriodeDTO): Periode => ({
  ...periode,
  // Bruker dayjs fremfor `new Date(...)` for å parse dato-only strenger
  // ("YYYY-MM-DD") som lokal midnatt, i stedet for UTC-midnatt. Dette må
  // være konsistent med datoene som kommer fra range-datepickeren
  // (useRangeDatepicker/react-day-picker), som også bygger lokal-midnatt
  // Date-objekter. Uten dette vil fom/tom for søkte og innvilgede perioder
  // sammenlignes på ulik tidsbasis, noe som kan gi feil i
  // beregnAvslattePerioder og hull-beregningen i datepickeren.
  fom: dayjs(periode.fom).toDate(),
  tom: dayjs(periode.tom).toDate(),
});

/**
 * Konverterer datofeltene i en behandling fra API-format til Date-objekter.
 */
export function parseBehandling(behandling: BehandlingDTO): Behandling {
  const behandletTidspunkt = new Date(behandling.behandletTidspunkt);

  if ("innvilgedePerioder" in behandling) {
    return {
      ...behandling,
      behandletTidspunkt,
      innvilgedePerioder: behandling.innvilgedePerioder.map(parsePeriode),
    };
  }

  return {
    ...behandling,
    behandletTidspunkt,
  };
}

export const parseSoknad = (soknad: SoknadDTO): Soknad => ({
  ...soknad,
  innsendtTidspunkt: new Date(soknad.innsendtTidspunkt),
  soktePerioder: soknad.soktePerioder.map(parsePeriode),
  behandling: soknad.behandling ? parseBehandling(soknad.behandling) : null,
});

export const antallDagerIPeriode = (periode: Periode): number =>
  dayjs(periode.tom).diff(dayjs(periode.fom), "day") + 1;

/**
 * Trekker en enkelt periode (`fratrekk`) fra en annen periode (`periode`),
 * og returnerer de(n) resterende delen(e). Kan returnere 0, 1 eller 2
 * perioder, avhengig av om `fratrekk` overlapper starten, slutten, midten
 * eller ingen del av `periode`.
 */
function trekkFraPeriode(periode: Periode, fratrekk: Periode): Periode[] {
  const ingenOverlapp =
    fratrekk.tom < periode.fom || fratrekk.fom > periode.tom;
  if (ingenOverlapp) {
    return [periode];
  }

  const gjenvarendePerioder: Periode[] = [];
  if (fratrekk.fom > periode.fom) {
    gjenvarendePerioder.push({
      fom: periode.fom,
      tom: addDays(fratrekk.fom, -1),
    });
  }
  if (fratrekk.tom < periode.tom) {
    gjenvarendePerioder.push({
      fom: addDays(fratrekk.tom, 1),
      tom: periode.tom,
    });
  }
  return gjenvarendePerioder;
}

/**
 * Beregner hvilke deler av `soktePerioder` som ikke er dekket av
 * `innvilgedePerioder`, altså de periodene som blir avslått ved en
 * delvis innvilgelse. Perioder i `innvilgedePerioder` med manglende
 * `fom`/`tom` ignoreres.
 */
export function beregnAvslattePerioder(
  soktePerioder: Periode[],
  innvilgedePerioder: { fom?: Date; tom?: Date }[],
): Periode[] {
  const gyldigeInnvilgedePerioder = innvilgedePerioder.filter(
    (periode): periode is Periode => !!periode.fom && !!periode.tom,
  );

  return soktePerioder.flatMap((soktPeriode) =>
    gyldigeInnvilgedePerioder
      .reduce(
        (gjenvarendePerioder, innvilgetPeriode) =>
          gjenvarendePerioder.flatMap((periode) =>
            trekkFraPeriode(periode, innvilgetPeriode),
          ),
        [soktPeriode],
      )
      .filter((periode) => periode.fom <= periode.tom),
  );
}
