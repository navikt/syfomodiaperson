import { Arbeidsgiver } from "@/data/pengestopp/types/FlaggPerson";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

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
