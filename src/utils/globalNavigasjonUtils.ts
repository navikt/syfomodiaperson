import { harUbehandletMotebehov } from "./motebehovUtils";
import {
  activeLPSOppfolgingsplaner,
  activeOppfolgingsplaner,
} from "./oppfolgingsplanerUtils";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { OppfolgingsplanLPSMedPersonoppgave } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import {
  getAllUbehandledePersonOppgaver,
  hasUbehandletPersonoppgave,
  numberOfUbehandledePersonOppgaver,
} from "@/utils/personOppgaveUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { VurderingResponseDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";

const getNumberOfMoteOppgaver = (
  motebehov: MotebehovVeilederDTO[],
  personOppgaver: PersonOppgave[]
): number => {
  const numberOfUbehandledeMotebehov = harUbehandletMotebehov(motebehov)
    ? 1
    : 0;
  const numberOfUbehandledeDialogmotesvar = hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.DIALOGMOTESVAR
  )
    ? 1
    : 0;
  return numberOfUbehandledeMotebehov + numberOfUbehandledeDialogmotesvar;
};

const numberOfActiveOppfolgingsplaner = (
  oppfolgingsplaner: OppfolgingsplanDTO[]
) => {
  return activeOppfolgingsplaner(oppfolgingsplaner).length;
};

const numberOfActiveLPSOppfolgingsplaner = (
  oppfolgingsplanerLps: OppfolgingsplanLPSMedPersonoppgave[]
) => {
  return activeLPSOppfolgingsplaner(oppfolgingsplanerLps).length;
};

const getNumberOfAktivitetskravOppgaver = (
  aktivitetskrav: AktivitetskravDTO[],
  personOppgaver: PersonOppgave[]
) => {
  const newAktivitetskrav = aktivitetskrav.find((krav) => {
    return krav.status === AktivitetskravStatus.NY;
  });
  const hasUbehandletOppgaveVurderStans = hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.AKTIVITETSKRAV_VURDER_STANS
  );

  return newAktivitetskrav || hasUbehandletOppgaveVurderStans ? 1 : 0;
};

const getNumberOfBehandlerDialogOppgaver = (
  personOppgaver: PersonOppgave[]
) => {
  const numberOfUbehandledeBehandlerDialogSvar = hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_SVAR
  )
    ? 1
    : 0;
  const numberOfUbehandledeBehandlerDialogUbesvart = hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_MELDING_UBESVART
  )
    ? 1
    : 0;

  const numberOfUbehanldedeBehandlerDialogMeldingAvvist =
    hasUbehandletPersonoppgave(
      personOppgaver,
      PersonOppgaveType.BEHANDLERDIALOG_MELDING_AVVIST
    )
      ? 1
      : 0;

  return (
    numberOfUbehandledeBehandlerDialogSvar +
    numberOfUbehandledeBehandlerDialogUbesvart +
    numberOfUbehanldedeBehandlerDialogMeldingAvvist
  );
};

const getNumberOfBehandlerBerOmBistandOppgaver = (
  personoppgaver: PersonOppgave[]
): number => {
  return getAllUbehandledePersonOppgaver(
    personoppgaver,
    PersonOppgaveType.BEHANDLER_BER_OM_BISTAND
  ).length;
};

const getNumberOfArbeidsuforhetOppgaver = (
  arbeidsuforhetVurderinger: VurderingResponseDTO[]
): number => {
  const sisteVurdering = arbeidsuforhetVurderinger[0];
  return sisteVurdering?.varsel?.isExpired ? 1 : 0;
};

function getNumberOfActiveSenOppfolgingOppgaver(
  senOppfolgingKandidat: SenOppfolgingKandidatResponseDTO[]
) {
  return senOppfolgingKandidat[0]?.status === SenOppfolgingStatus.KANDIDAT
    ? 1
    : 0;
}

function getNumberOfFriskmeldingTilArbeidsformidlingOppgaver(
  friskmeldingTilArbeidsformidlingVedtak: VedtakResponseDTO[]
): number {
  const sisteVedtak = friskmeldingTilArbeidsformidlingVedtak[0];
  return !!sisteVedtak &&
    !sisteVedtak.ferdigbehandletAt &&
    !sisteVedtak.ferdigbehandletBy
    ? 1
    : 0;
}

export const numberOfTasks = (
  menypunkt: Menypunkter,
  motebehov: MotebehovVeilederDTO[],
  oppfolgingsplaner: OppfolgingsplanDTO[],
  personOppgaver: PersonOppgave[],
  oppfolgingsplanerlps: OppfolgingsplanLPSMedPersonoppgave[],
  aktivitetskrav: AktivitetskravDTO[],
  arbeidsuforhetVurderinger: VurderingResponseDTO[],
  senOppfolgingKandidatOppgaver: SenOppfolgingKandidatResponseDTO[],
  friskmeldingTilArbeidsformidlingVedtak: VedtakResponseDTO[]
): number => {
  switch (menypunkt) {
    case Menypunkter.DIALOGMOTE:
      return getNumberOfMoteOppgaver(motebehov, personOppgaver);
    case Menypunkter.OPPFOELGINGSPLANER:
      return (
        numberOfActiveOppfolgingsplaner(oppfolgingsplaner) +
        numberOfActiveLPSOppfolgingsplaner(oppfolgingsplanerlps) +
        numberOfUbehandledePersonOppgaver(
          personOppgaver,
          PersonOppgaveType.OPPFOLGINGSPLANLPS
        )
      );
    case Menypunkter.AKTIVITETSKRAV:
      return getNumberOfAktivitetskravOppgaver(aktivitetskrav, personOppgaver);
    case Menypunkter.BEHANDLERDIALOG:
      return getNumberOfBehandlerDialogOppgaver(personOppgaver);
    case Menypunkter.SYKMELDINGER:
      return getNumberOfBehandlerBerOmBistandOppgaver(personOppgaver);
    case Menypunkter.ARBEIDSUFORHET:
      return getNumberOfArbeidsuforhetOppgaver(arbeidsuforhetVurderinger);
    case Menypunkter.SENOPPFOLGING:
      return getNumberOfActiveSenOppfolgingOppgaver(
        senOppfolgingKandidatOppgaver
      );
    case Menypunkter.FRISKTILARBEID:
      return getNumberOfFriskmeldingTilArbeidsformidlingOppgaver(
        friskmeldingTilArbeidsformidlingVedtak
      );
    case Menypunkter.NOKKELINFORMASJON:
    case Menypunkter.SYKEPENGESOKNADER:
    case Menypunkter.VEDTAK:
    case Menypunkter.HISTORIKK: {
      return 0;
    }
  }
};
