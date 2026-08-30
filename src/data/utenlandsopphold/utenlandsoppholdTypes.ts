import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes.ts";
import { addDays } from "@/utils/datoUtils.ts";
import dayjs from "dayjs";

export interface SoknaderQueryDTO {
  personident: string;
}

export interface SoknaderResponseDTO {
  soknader: SoknadDTO[];
}

export interface SoknadVedtakPostDTO {
  utfall: Utfall;
  innvilgedePerioder: PeriodeDTO[];
  document: DocumentComponentDto[];
  begrunnelse: string | null;
}

export interface SoknadVedtakResponseDTO {
  soknad: SoknadDTO;
}

export interface SoknadDTO {
  soknadId: string;
  eksternId: string;
  status: SoknadStatusDTO;
  innsendtTidspunkt: string;
  soktePerioder: PeriodeDTO[];
  vedtak: VedtakDTO | null;
}

export interface PeriodeDTO {
  fom: string;
  tom: string;
}

export interface VedtakDTO {
  utfall: Utfall;
  innvilgedePerioder: PeriodeDTO[];
  fattetAv: string;
  fattetTidspunkt: string;
  begrunnelse: string | null;
}

export enum SoknadStatusDTO {
  MOTTATT = "MOTTATT",
  INNVILGET = "INNVILGET",
  DELVIS_INNVILGET = "DELVIS_INNVILGET",
  AVSLAG = "AVSLAG",
}

// Types
export type Utfall = "INNVILGET" | "DELVIS_INNVILGET" | "AVSLAG";

export interface Soknad extends Omit<
  SoknadDTO,
  "innsendtTidspunkt" | "soktePerioder" | "vedtak"
> {
  innsendtTidspunkt: Date;
  soktePerioder: Periode[];
  vedtak: Vedtak | null;
}

export interface Periode extends Omit<PeriodeDTO, "fom" | "tom"> {
  fom: Date;
  tom: Date;
}

export interface Vedtak extends Omit<
  VedtakDTO,
  "innvilgedePerioder" | "fattetTidspunkt"
> {
  innvilgedePerioder: Periode[];
  fattetTidspunkt: Date;
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

export const parseVedtak = (vedtak: VedtakDTO): Vedtak => ({
  ...vedtak,
  innvilgedePerioder: vedtak.innvilgedePerioder.map(parsePeriode),
  fattetTidspunkt: new Date(vedtak.fattetTidspunkt),
});

export const parseSoknad = (soknad: SoknadDTO): Soknad => ({
  ...soknad,
  innsendtTidspunkt: new Date(soknad.innsendtTidspunkt),
  soktePerioder: soknad.soktePerioder.map(parsePeriode),
  vedtak: soknad.vedtak ? parseVedtak(soknad.vedtak) : null,
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
