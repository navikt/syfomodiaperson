import {
  innkaltDialogmote,
  innkaltDialogmoteMedBehandler,
} from "../../mock/data/dialogmoterMock";
import { ISDIALOGMOTE_ROOT, SYFOMOTEADMIN_ROOT } from "../../src/apiConstants";

export enum MoteState {
  INNKALT_DIALOGMOTE,
  INNKALT_DIALOGMOTE_MED_BEHANDLER,
  INGEN_MOTER,
}

interface TestMoter {
  moter: object;
  dialogmoter: object;
}

const getMoter = (state: MoteState): TestMoter => {
  switch (state) {
    case MoteState.INNKALT_DIALOGMOTE: {
      return {
        moter: [],
        dialogmoter: [innkaltDialogmote],
      };
    }
    case MoteState.INNKALT_DIALOGMOTE_MED_BEHANDLER: {
      return {
        moter: [],
        dialogmoter: [innkaltDialogmoteMedBehandler],
      };
    }
    case MoteState.INGEN_MOTER: {
      return {
        moter: [],
        dialogmoter: [],
      };
    }
  }
};

Cypress.Commands.add("stubMoter", (state: MoteState) => {
  const moter = getMoter(state);
  cy.intercept(
    {
      method: "GET",
      url: `${SYFOMOTEADMIN_ROOT}/moter*`,
    },
    moter.moter
  );
  cy.intercept(
    {
      method: "GET",
      url: `${ISDIALOGMOTE_ROOT}/dialogmote/personident`,
    },
    moter.dialogmoter
  );
});
