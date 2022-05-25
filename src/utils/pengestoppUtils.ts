import {
  Arbeidsgiver,
  Status,
  StatusEndring,
  SykepengestoppArsak,
} from "@/data/pengestopp/types/FlaggPerson";
import { senesteTom } from "./periodeUtils";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { sykepengestoppArsakTekstListe } from "@/components/pengestopp/PengestoppModal";

export const sykmeldingerToArbeidsgiver = (
  sykmeldinger: SykmeldingOldFormat[]
) => {
  return sykmeldinger.map((sykmelding) => {
    return {
      navn: sykmelding.mottakendeArbeidsgiver?.navn,
      orgnummer: sykmelding.orgnummer,
    };
  }) as Arbeidsgiver[];
};

export const uniqueArbeidsgivere = (
  arbeidsgivere: Arbeidsgiver[]
): Arbeidsgiver[] => {
  return arbeidsgivere.filter((arbeidsgiver, index, self) => {
    return (
      self.findIndex((arbeidsgiver2) => {
        return arbeidsgiver.orgnummer === arbeidsgiver2.orgnummer;
      }) === index
    );
  });
};

export const allStoppAutomatikkStatusEndringer = (
  statusEndringer: StatusEndring[]
) => {
  return statusEndringer.filter((statusEndring) => {
    return statusEndring.status === Status.STOPP_AUTOMATIKK;
  });
};

export const aktiveSykmeldingerFraSiste3Maneder = (
  sykmeldinger: SykmeldingOldFormat[]
) => {
  const threeMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);
  return sykmeldinger.filter((sykmelding) => {
    return (
      senesteTom(sykmelding.mulighetForArbeid.perioder) >= threeMonthsAgo &&
      sykmelding.status === SykmeldingStatus.SENDT
    );
  });
};

export const unikeArbeidsgivereMedSykmeldingSiste3Maneder = (
  sykmeldinger: SykmeldingOldFormat[]
) => {
  const sykmeldingerSiste3Maneder =
    aktiveSykmeldingerFraSiste3Maneder(sykmeldinger);

  const arbeidsgiverFromSykmeldinger = sykmeldingerToArbeidsgiver(
    sykmeldingerSiste3Maneder
  );

  return uniqueArbeidsgivere(arbeidsgiverFromSykmeldinger);
};

export const displayArsakText = (arsakList: SykepengestoppArsak[]) => {
  return `Årsak: ${arsakList
    .map((arsak) => {
      return sykepengestoppArsakTekstListe.find((arsakTekst) => {
        return arsakTekst.type === arsak.type;
      })?.text;
    })
    .join(", ")}.`;
};

export const displayArbeidsgiverNavn = (
  allArbeidsgivere: Arbeidsgiver[],
  statusEndring: StatusEndring
) => {
  return allArbeidsgivere.find(
    (ag: Arbeidsgiver) => ag.orgnummer === statusEndring.virksomhetNr.value
  )?.navn;
};
