import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { toDate } from "./datoUtils";
import {
  getSykmeldingStartdato,
  sykmeldingperioderSortertEldstTilNyest,
} from "./sykmeldinger/sykmeldingUtils";

export const hentArbeidsgivernavn = (
  sykmelding: SykmeldingOldFormat
): string => {
  return sykmelding.mottakendeArbeidsgiver
    ? sykmelding.mottakendeArbeidsgiver.navn
    : sykmelding.arbeidsgiver
    ? sykmelding.arbeidsgiver
    : sykmelding.innsendtArbeidsgivernavn
    ? sykmelding.innsendtArbeidsgivernavn
    : "";
};

const sykmeldingerMedPerioderSortertEldstTilNyest = (
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingOldFormat[] => {
  return sykmeldinger.map((sykmelding) => ({
    ...sykmelding,
    mulighetForArbeid: {
      ...sykmelding.mulighetForArbeid,
      perioder: sykmeldingperioderSortertEldstTilNyest(
        sykmelding.mulighetForArbeid.perioder
      ),
    },
  }));
};

const harUlikStartdato = (
  sykmeldingA: SykmeldingOldFormat,
  sykmeldingB: SykmeldingOldFormat
): boolean => {
  return (
    toDate(getSykmeldingStartdato(sykmeldingA))?.getTime() !==
    toDate(getSykmeldingStartdato(sykmeldingB))?.getTime()
  );
};

export type SorteringKriterium = {
  tekst: string;
  verdi: SorteringsKriteriumVerdi;
};
export type SorteringsKriteriumVerdi = "dato" | "arbeidsgiver";

const compareByDate = (
  sykmeldingA: SykmeldingOldFormat,
  sykmeldingB: SykmeldingOldFormat
): number => {
  if (harUlikStartdato(sykmeldingA, sykmeldingB)) {
    return (
      (toDate(getSykmeldingStartdato(sykmeldingB))?.getTime() ?? 0) -
      (toDate(getSykmeldingStartdato(sykmeldingA))?.getTime() ?? 0)
    );
  } else {
    const perioderA = sykmeldingA.mulighetForArbeid.perioder;
    const perioderB = sykmeldingB.mulighetForArbeid.perioder;
    const sistePeriodeB = perioderB[perioderB.length - 1];
    const sistePeriodeA = perioderA[perioderA.length - 1];
    return (
      (toDate(sistePeriodeB.tom)?.getTime() ?? 0) -
      (toDate(sistePeriodeA.tom)?.getTime() ?? 0)
    );
  }
};

export const sorterSykmeldinger = (
  sykmeldinger: SykmeldingOldFormat[] = [],
  kriterium: SorteringsKriteriumVerdi = "dato"
): SykmeldingOldFormat[] => {
  return sykmeldingerMedPerioderSortertEldstTilNyest(sykmeldinger).sort(
    (sykmeldingA, sykmeldingB) => {
      const arbeidsgiverSykmeldingA = hentArbeidsgivernavn(sykmeldingA);
      const arbeidsgiverSykmeldingB = hentArbeidsgivernavn(sykmeldingB);
      switch (kriterium) {
        case "dato": {
          return compareByDate(sykmeldingA, sykmeldingB);
        }
        case "arbeidsgiver": {
          if (
            arbeidsgiverSykmeldingA.trim().toUpperCase() !==
            arbeidsgiverSykmeldingB.toUpperCase()
          ) {
            return arbeidsgiverSykmeldingA < arbeidsgiverSykmeldingB ? -1 : 1;
          } else {
            return compareByDate(sykmeldingA, sykmeldingB);
          }
        }
        default: {
          return 0;
        }
      }
    }
  );
};
