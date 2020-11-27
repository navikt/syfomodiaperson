import * as menypunkter from "../enums/menypunkter";
import { harUbehandletMotebehov } from "./motebehovUtils";
import {
  activeLPSOppfolgingsplaner,
  activeOppfolgingsplaner,
} from "./oppfolgingsplanerUtils";
import { PersonOppgaveType } from "../reducers/personoppgaver";

export const isUnfinishedMotebehovTask = (motebehovReducer) => {
  return harUbehandletMotebehov(motebehovReducer.data);
};

export const isUnfinishedMoterTask = (moterReducer) => {
  return (
    moterReducer &&
    moterReducer.data &&
    moterReducer.data[0] &&
    moterReducer.data[0].trengerBehandling
  );
};

const moteplanleggerTasks = (motebehovReducer, moterReducer) => {
  const motebehovPrikker = isUnfinishedMotebehovTask(motebehovReducer) ? 1 : 0;

  const moterPrikker = isUnfinishedMoterTask(moterReducer) ? 1 : 0;

  return motebehovPrikker + moterPrikker;
};

const numberOfActiveOppfolgingsplaner = (oppfolgingsplanerReducer) => {
  return (
    oppfolgingsplanerReducer &&
    oppfolgingsplanerReducer.data &&
    activeOppfolgingsplaner(oppfolgingsplanerReducer.data).length
  );
};

const numberOfActiveLPSOppfolgingsplaner = (oppfolgingsplanerLPSReducer) => {
  return (
    oppfolgingsplanerLPSReducer &&
    oppfolgingsplanerLPSReducer.data &&
    activeLPSOppfolgingsplaner(oppfolgingsplanerLPSReducer.data).length
  );
};

const numberOfUnprocessedPersonOppgaver = (personOppgaverReducer, type) => {
  return (
    personOppgaverReducer &&
    personOppgaverReducer.data &&
    personOppgaverReducer.data.filter((personoppgave) => {
      return personoppgave.type === type && !personoppgave.behandletTidspunkt;
    }).length
  );
};

export const numberOfTasks = (
  menypunkt,
  motebehovReducer,
  moterReducer,
  oppfolgingsplanerReducer,
  personOppgaverReducer,
  oppfolgingsplanerLPSReducer
) => {
  switch (menypunkt) {
    case menypunkter.MOETEPLANLEGGER:
      return moteplanleggerTasks(motebehovReducer, moterReducer);
    case menypunkter.OPPFOELGINGSPLANER:
      return (
        numberOfActiveOppfolgingsplaner(oppfolgingsplanerReducer) +
        numberOfActiveLPSOppfolgingsplaner(oppfolgingsplanerLPSReducer) +
        numberOfUnprocessedPersonOppgaver(
          personOppgaverReducer,
          PersonOppgaveType.OPPFOLGINGSPLANLPS
        )
      );
    default:
      return 0;
  }
};
