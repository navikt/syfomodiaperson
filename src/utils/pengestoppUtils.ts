import {
  Arbeidsgiver,
  Status,
  StatusEndring,
  StoppAutomatikk,
  Sykmelding,
} from "../types/FlaggPerson";
import { senesteTom } from "./periodeUtils";
import { gamleSMStatuser } from "./sykmeldinger/sykmeldingstatuser";

export const sykmeldingerToArbeidsgiver = (sykmeldinger: Sykmelding[]) => {
  return sykmeldinger.map((sykmelding) => {
    return {
      navn: sykmelding.arbeidsgiver,
      orgnummer: sykmelding.orgnummer,
    };
  });
};

export const uniqueArbeidsgivere = (arbeidsgivere: Arbeidsgiver[]) => {
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

export const arbeidsgivereWithStoppAutomatikkStatus = (
  arbeidsgivere: Arbeidsgiver[],
  statusEndringerWithStoppAutomatikk: Array<StatusEndring>
) => {
  return arbeidsgivere.filter((arbeidsgiver) => {
    return statusEndringerWithStoppAutomatikk.find((statusEndring) => {
      return statusEndring.virksomhetNr.value === arbeidsgiver.orgnummer;
    });
  });
};

export const aktiveSykmeldingerFraSiste3Maneder = (
  sykmeldinger: Sykmelding[]
) => {
  const threeMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);
  return sykmeldinger.filter((sykmelding) => {
    return (
      senesteTom(sykmelding.mulighetForArbeid.perioder) >= threeMonthsAgo &&
      sykmelding.status === gamleSMStatuser.SENDT
    );
  });
};

export const unikeArbeidsgivereMedSykmeldingSiste3Maneder = (
  sykmeldinger: Sykmelding[]
) => {
  const sykmeldingerSiste3Maneder = aktiveSykmeldingerFraSiste3Maneder(
    sykmeldinger
  );

  const arbeidsgiverFromSykmeldinger = sykmeldingerToArbeidsgiver(
    sykmeldingerSiste3Maneder
  );

  return uniqueArbeidsgivere(arbeidsgiverFromSykmeldinger);
};

export const stoppAutomatikk2StatusEndring = (
  stoppAutomatikk: StoppAutomatikk
) => {
  return stoppAutomatikk.virksomhetNr.map((virksomhet) => {
    return {
      veilederIdent: { value: "" },
      sykmeldtFnr: stoppAutomatikk.sykmeldtFnr,
      status: Status.STOPP_AUTOMATIKK,
      virksomhetNr: virksomhet,
      opprettet: new Date().toISOString(),
      enhetNr: stoppAutomatikk.enhetNr,
    };
  });
};
