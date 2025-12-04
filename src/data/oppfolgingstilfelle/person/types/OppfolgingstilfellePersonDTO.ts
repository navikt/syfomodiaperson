export interface OppfolgingstilfellePersonDTO {
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[];
  personIdent: string;
  hasGjentakendeSykefravar: boolean | null;
}

export interface OppfolgingstilfelleDTO {
  arbeidstakerAtTilfelleEnd: boolean;
  start: Date;
  end: Date;
  antallSykedager: number;
  varighetUker: number;
  virksomhetsnummerList: string[];
}

export function isDateInOppfolgingstilfelle(
  date: Date,
  oppfolgingstilfelle: OppfolgingstilfelleDTO
) {
  return (
    new Date(oppfolgingstilfelle.start) <= new Date(date) &&
    new Date(date) <= new Date(oppfolgingstilfelle.end)
  );
}
