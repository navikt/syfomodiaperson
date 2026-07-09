// DTOs
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes.ts";

export interface SoknaderQueryDTO {
  personident: string;
}

export interface SoknaderResponseDTO {
  soknader: SoknadDTO[];
}

export interface SoknadVedtakPostDTO {
  utfall: "INNVILGET";
  innvilgetePerioder: PeriodeDTO[];
  document: DocumentComponentDto[];
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
  utfall: string;
  innvilgetePerioder: PeriodeDTO[];
  fattetAv: string;
  fattetTidspunkt: string;
}

export enum SoknadStatusDTO {
  MOTTATT = "MOTTATT",
  INNVILGET = "INNVILGET",
}

// Types
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
  "innvilgetePerioder" | "fattetTidspunkt"
> {
  innvilgetePerioder: Periode[];
  fattetTidspunkt: Date;
}

// Parsers
export const parsePeriode = (periode: PeriodeDTO): Periode => ({
  ...periode,
  fom: new Date(periode.fom),
  tom: new Date(periode.tom),
});

export const parseVedtak = (vedtak: VedtakDTO): Vedtak => ({
  ...vedtak,
  innvilgetePerioder: vedtak.innvilgetePerioder.map(parsePeriode),
  fattetTidspunkt: new Date(vedtak.fattetTidspunkt),
});

export const parseSoknad = (soknad: SoknadDTO): Soknad => ({
  ...soknad,
  innsendtTidspunkt: new Date(soknad.innsendtTidspunkt),
  soktePerioder: soknad.soktePerioder.map(parsePeriode),
  vedtak: soknad.vedtak ? parseVedtak(soknad.vedtak) : null,
});
