export interface OppfolgingstilfellePersonDTO {
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[];
  personIdent: string;
}

export interface OppfolgingstilfelleDTO {
  arbeidstakerAtTilfelleEnd: boolean;
  start: Date;
  end: Date;
  virksomhetsnummerList: string[];
}
