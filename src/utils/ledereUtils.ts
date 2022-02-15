import {
  NarmesteLederRelasjonDTO,
  NarmesteLederRelasjonStatus,
} from "@/data/leder/ledereTypes";
import {
  erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker,
  erOppfolgingstilfelleSluttDatoPassert,
  harArbeidstakerSvartPaaMotebehov,
} from "./motebehovUtils";
import { activeSykmeldingerSentToArbeidsgiver } from "./sykmeldinger/sykmeldingUtils";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export const ledereIVirksomheterMedMotebehovsvarFraArbeidstaker = (
  ledereData: NarmesteLederRelasjonDTO[],
  motebehovData: MotebehovVeilederDTO[]
): NarmesteLederRelasjonDTO[] => {
  return ledereData.filter((leder: NarmesteLederRelasjonDTO) =>
    motebehovData.some(
      (motebehov) =>
        motebehov.opprettetAv === motebehov.aktorId &&
        leder.virksomhetsnummer === motebehov.virksomhetsnummer
    )
  );
};

export const ledereIVirksomheterDerIngenLederHarSvartPaMotebehov = (
  ledereListe: NarmesteLederRelasjonDTO[],
  motebehovData: MotebehovVeilederDTO[]
): NarmesteLederRelasjonDTO[] => {
  return ledereListe.filter(
    (leder) =>
      !motebehovData.some(
        (motebehov) =>
          motebehov.opprettetAv !== motebehov.aktorId &&
          motebehov.virksomhetsnummer === leder.virksomhetsnummer
      )
  );
};

export const ledereMedOppfolgingstilfelleInnenforMotebehovperioden = (
  ledereData: NarmesteLederRelasjonDTO[],
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[]
): NarmesteLederRelasjonDTO[] => {
  return ledereData.filter((leder) => {
    const latestOppfolgingstilfelleForVirksomhet = oppfolgingstilfelleList.find(
      (tilfelle) => {
        return tilfelle.virksomhetsnummerList.some((virksomhetsnummer) => {
          return virksomhetsnummer === leder.virksomhetsnummer;
        });
      }
    );
    const oppfolgingstilfelleStart = latestOppfolgingstilfelleForVirksomhet
      ? latestOppfolgingstilfelleForVirksomhet.start
      : new Date();
    const oppfolgingstilfelleEnd = latestOppfolgingstilfelleForVirksomhet
      ? latestOppfolgingstilfelleForVirksomhet.end
      : new Date();

    return (
      !erOppfolgingstilfelleSluttDatoPassert(oppfolgingstilfelleEnd) &&
      erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker(oppfolgingstilfelleStart)
    );
  });
};

export const ledereUtenMotebehovsvar = (
  ledereData: NarmesteLederRelasjonDTO[],
  motebehovData: MotebehovVeilederDTO[],
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[]
): NarmesteLederRelasjonDTO[] => {
  const arbeidstakerHarSvartPaaMotebehov =
    motebehovData && harArbeidstakerSvartPaaMotebehov(motebehovData);

  const filtrertLederListe = arbeidstakerHarSvartPaaMotebehov
    ? ledereIVirksomheterMedMotebehovsvarFraArbeidstaker(
        ledereData,
        motebehovData
      )
    : ledereMedOppfolgingstilfelleInnenforMotebehovperioden(
        ledereData,
        oppfolgingstilfelleList
      );

  const ledereIVirksomhetUtenMotebehovSvarFraLeder = ledereIVirksomheterDerIngenLederHarSvartPaMotebehov(
    filtrertLederListe,
    motebehovData
  );

  return ledereIVirksomhetUtenMotebehovSvarFraLeder.filter((leder) => {
    return leder.status === NarmesteLederRelasjonStatus.INNMELDT_AKTIV;
  });
};

export const lederHasActiveSykmelding = (
  lederVirksomhetsnummer: string,
  sykmeldinger: SykmeldingOldFormat[]
): boolean => {
  const activeSykmeldingerWithArbeidsgiver = activeSykmeldingerSentToArbeidsgiver(
    sykmeldinger
  );

  return activeSykmeldingerWithArbeidsgiver.some(
    (sykmelding) =>
      sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer ===
      lederVirksomhetsnummer
  );
};

export const ledereWithActiveLedereFirst = (
  ledereData: NarmesteLederRelasjonDTO[],
  sykmeldinger: SykmeldingOldFormat[]
): NarmesteLederRelasjonDTO[] => {
  return ledereData.sort((leder1, leder2) => {
    const leder1Active = lederHasActiveSykmelding(
      leder1.virksomhetsnummer,
      sykmeldinger
    );
    const leder2Active = lederHasActiveSykmelding(
      leder2.virksomhetsnummer,
      sykmeldinger
    );

    if (leder1Active && !leder2Active) {
      return -1;
    }
    if (leder2Active && !leder1Active) {
      return 1;
    }
    return 0;
  });
};

const sykmeldingerWithoutMatchingLeder = (
  ledere: NarmesteLederRelasjonDTO[],
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingOldFormat[] => {
  return sykmeldinger.filter(
    (sykmelding) =>
      !ledere.some(
        (leder) =>
          leder.virksomhetsnummer ===
          sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer
      )
  );
};

export interface SykmeldingLeder {
  arbeidsgiverForskutterer?: boolean;
  virksomhetsnummer: string;
  virksomhetsnavn: string;
}

const sykmelding2Leder = (sykmelding: SykmeldingOldFormat): SykmeldingLeder => {
  return {
    arbeidsgiverForskutterer: undefined,
    virksomhetsnummer:
      sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer || "",
    virksomhetsnavn: sykmelding.mottakendeArbeidsgiver?.navn || "",
  };
};

const removeDuplicatesFromLederList = (
  ledere: SykmeldingLeder[]
): SykmeldingLeder[] => {
  return ledere.filter((leder, index) => {
    return (
      ledere.findIndex((leder2) => {
        return leder2.virksomhetsnummer === leder.virksomhetsnummer;
      }) === index
    );
  });
};

export const virksomheterWithoutLeder = (
  ledere: NarmesteLederRelasjonDTO[],
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingLeder[] => {
  const activeSykmeldinger = activeSykmeldingerSentToArbeidsgiver(sykmeldinger);

  const sykmeldingerWithoutLeder = sykmeldingerWithoutMatchingLeder(
    ledere,
    activeSykmeldinger
  );

  const virksomheterAsLedere = sykmeldingerWithoutLeder.map(sykmelding2Leder);

  return removeDuplicatesFromLederList(virksomheterAsLedere);
};

export const ledereSortertPaaNavnOgOrganisasjonsnavn = (
  ledere: NarmesteLederRelasjonDTO[]
): NarmesteLederRelasjonDTO[] =>
  ledere
    .sort((a, b) => {
      if (a.narmesteLederNavn > b.narmesteLederNavn) {
        return 1;
      } else if (b.narmesteLederNavn > a.narmesteLederNavn) {
        return -1;
      }
      return 0;
    })
    .sort((a, b) => {
      if (a.virksomhetsnavn > b.virksomhetsnavn) {
        return 1;
      } else if (b.virksomhetsnavn > a.virksomhetsnavn) {
        return -1;
      }
      return 0;
    });

export const narmesteLederForVirksomhet = (
  ledere: NarmesteLederRelasjonDTO[],
  virksomhetsnummer: string
): NarmesteLederRelasjonDTO | undefined => {
  return ledere.find((leder) => leder.virksomhetsnummer === virksomhetsnummer);
};
