export type TilfellePeriode = { fom: string | Date; tom: string | Date };

export const tidligsteFom = (perioder: TilfellePeriode[]): string | Date => {
  return perioder
    .map((p) => p.fom)
    .sort((p1, p2) => (p1 > p2 ? 1 : p1 < p2 ? -1 : 0))[0];
};

export const senesteTom = (perioder: TilfellePeriode[]): string | Date => {
  return perioder
    .map((p) => p.tom)
    .sort((p1, p2) => (p1 < p2 ? 1 : p1 > p2 ? -1 : 0))[0];
};
