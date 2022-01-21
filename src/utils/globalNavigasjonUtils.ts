import * as menypunkter from "../enums/menypunkter";
import { harUbehandletMotebehov } from "./motebehovUtils";
import {
  activeLPSOppfolgingsplaner,
  activeOppfolgingsplaner,
} from "./oppfolgingsplanerUtils";
import {
  PersonOppgaverState,
  PersonOppgaveType,
} from "@/data/personoppgave/personoppgaver";
import { MotebehovState } from "@/data/motebehov/motebehov";
import { MoterState } from "@/data/mote/moter";
import { OppfolgingsplanerState } from "@/data/oppfolgingsplan/oppfoelgingsdialoger";
import { OppfolgingsplanerlpsState } from "@/data/oppfolgingsplan/oppfolgingsplanerlps";

export const isUnfinishedMotebehovTask = (motebehovState: MotebehovState) => {
  return harUbehandletMotebehov(motebehovState.data);
};

export const isUnfinishedMoterTask = (moterState: MoterState) => {
  return moterState?.data?.[0]?.trengerBehandling;
};

const moteplanleggerTasks = (
  motebehovState: MotebehovState,
  moterState: MoterState
) => {
  const motebehovPrikker = isUnfinishedMotebehovTask(motebehovState) ? 1 : 0;
  const moterPrikker = isUnfinishedMoterTask(moterState) ? 1 : 0;

  return motebehovPrikker + moterPrikker;
};

const numberOfActiveOppfolgingsplaner = (
  oppfolgingsplanerState: OppfolgingsplanerState
) => {
  return (
    oppfolgingsplanerState?.data &&
    activeOppfolgingsplaner(oppfolgingsplanerState.data).length
  );
};

const numberOfActiveLPSOppfolgingsplaner = (
  oppfolgingsplanerLpsState: OppfolgingsplanerlpsState
) => {
  return (
    oppfolgingsplanerLpsState?.data &&
    activeLPSOppfolgingsplaner(oppfolgingsplanerLpsState.data).length
  );
};

const numberOfUnprocessedPersonOppgaver = (
  personOppgaverState: PersonOppgaverState,
  type: string
) => {
  return (
    personOppgaverState?.data &&
    personOppgaverState.data.filter((personoppgave) => {
      return personoppgave.type === type && !personoppgave.behandletTidspunkt;
    }).length
  );
};

export const numberOfTasks = (
  menypunkt: string,
  motebehovState: MotebehovState,
  moterState: MoterState,
  oppfolgingsplanerState: OppfolgingsplanerState,
  personOppgaverState: PersonOppgaverState,
  oppfolgingsplanerlpsState: OppfolgingsplanerlpsState
) => {
  switch (menypunkt) {
    case menypunkter.MOETEPLANLEGGER:
      return moteplanleggerTasks(motebehovState, moterState);
    case menypunkter.OPPFOELGINGSPLANER:
      return (
        numberOfActiveOppfolgingsplaner(oppfolgingsplanerState) +
        numberOfActiveLPSOppfolgingsplaner(oppfolgingsplanerlpsState) +
        numberOfUnprocessedPersonOppgaver(
          personOppgaverState,
          PersonOppgaveType.OPPFOLGINGSPLANLPS
        )
      );
    default:
      return 0;
  }
};
