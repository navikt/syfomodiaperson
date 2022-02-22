import * as menypunkter from "../enums/menypunkter";
import { harUbehandletMotebehov } from "./motebehovUtils";
import {
  activeLPSOppfolgingsplaner,
  activeOppfolgingsplaner,
} from "./oppfolgingsplanerUtils";
import { MoterState } from "@/data/mote/moter";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";

export const isUnfinishedMoterTask = (moterState: MoterState) => {
  return moterState?.data?.[0]?.trengerBehandling;
};

const moteplanleggerTasks = (
  motebehov: MotebehovVeilederDTO[],
  moterState: MoterState
) => {
  const motebehovPrikker = harUbehandletMotebehov(motebehov) ? 1 : 0;
  const moterPrikker = isUnfinishedMoterTask(moterState) ? 1 : 0;

  return motebehovPrikker + moterPrikker;
};

const numberOfActiveOppfolgingsplaner = (
  oppfolgingsplaner: OppfolgingsplanDTO[]
) => {
  return activeOppfolgingsplaner(oppfolgingsplaner).length;
};

const numberOfActiveLPSOppfolgingsplaner = (
  oppfolgingsplanerLps: OppfolgingsplanLPS[]
) => {
  return activeLPSOppfolgingsplaner(oppfolgingsplanerLps).length;
};

const numberOfUnprocessedPersonOppgaver = (
  personOppgaver: PersonOppgave[],
  type: string
) => {
  return personOppgaver.filter((personoppgave) => {
    return personoppgave.type === type && !personoppgave.behandletTidspunkt;
  }).length;
};

export const numberOfTasks = (
  menypunkt: string,
  motebehov: MotebehovVeilederDTO[],
  moterState: MoterState,
  oppfolgingsplaner: OppfolgingsplanDTO[],
  personOppgaver: PersonOppgave[],
  oppfolgingsplanerlps: OppfolgingsplanLPS[]
) => {
  switch (menypunkt) {
    case menypunkter.MOETEPLANLEGGER:
      return moteplanleggerTasks(motebehov, moterState);
    case menypunkter.OPPFOELGINGSPLANER:
      return (
        numberOfActiveOppfolgingsplaner(oppfolgingsplaner) +
        numberOfActiveLPSOppfolgingsplaner(oppfolgingsplanerlps) +
        numberOfUnprocessedPersonOppgaver(
          personOppgaver,
          PersonOppgaveType.OPPFOLGINGSPLANLPS
        )
      );
    default:
      return 0;
  }
};
