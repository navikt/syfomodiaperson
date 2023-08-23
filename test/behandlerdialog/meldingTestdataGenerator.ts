import {
  behandlerdialogMockEmpty,
  defaultMelding,
  defaultMeldingInnkommende,
  defaultMeldingInnkommendeLegeerklaring,
  defaultMeldingLegeerklaring,
  paminnelseMelding,
} from "../../mock/isbehandlerdialog/behandlerdialogMock";
import {
  MeldingDTO,
  MeldingStatusType,
} from "@/data/behandlerdialog/behandlerdialogTypes";

export const meldingTilOgFraBehandler = (
  meldingFraBehandlerUuid: string,
  withPaminnelse = false
) => {
  return {
    conversations: {
      ["conversationRef000"]: [
        defaultMelding,
        ...(withPaminnelse ? [paminnelseMelding] : []),
        {
          ...defaultMelding,
          uuid: meldingFraBehandlerUuid,
          innkommende: true,
          antallVedlegg: 1,
        },
      ],
    },
  };
};

export const defaultMeldingResponse = {
  conversations: {
    ["conversationRef123"]: [defaultMelding],
  },
};

export const meldingFraBehandlerUtenBehandlernavn = {
  conversations: {
    ...behandlerdialogMockEmpty.conversations,
    ["conversationRef000"]: [
      {
        ...defaultMelding,
        innkommende: true,
        tidspunkt: new Date(),
      },
    ],
  },
};

export const meldingTilBehandlerMedMeldingStatus = (
  status: MeldingStatusType,
  tekst: string | null = null
) => {
  return {
    conversations: {
      ["conversationRef123"]: [
        {
          ...defaultMelding,
          status: {
            type: status,
            tekst: tekst,
          },
        },
      ],
    },
  };
};

export const meldingResponseMedVedlegg = {
  conversations: {
    ["conversationRef123"]: [
      defaultMelding,
      {
        ...defaultMelding,
        innkommende: true,
        antallVedlegg: 2,
      },
      {
        ...defaultMelding,
        innkommende: true,
        antallVedlegg: 5,
      },
    ],
    ["conversationRef000"]: [
      defaultMelding,
      {
        ...defaultMelding,
        innkommende: true,
        antallVedlegg: 1,
      },
    ],
  },
};

export const meldingResponseMedPaminnelse = {
  conversations: {
    ["conversationRef123"]: [defaultMelding, paminnelseMelding],
  },
};

export const meldingResponseLegeerklaring = {
  conversations: {
    ["conversationRef567"]: [
      defaultMeldingLegeerklaring,
      defaultMeldingInnkommendeLegeerklaring,
    ],
  },
};

export const foresporselPasientToBehandler: MeldingDTO = {
  ...defaultMelding,
  tidspunkt: new Date(),
};

export const foresporselPasientFraBehandler: MeldingDTO = {
  ...defaultMeldingInnkommende,
  tidspunkt: new Date(),
};

export const foresporselLegeerklaringTilBehandler: MeldingDTO = {
  ...defaultMeldingLegeerklaring,
  tidspunkt: new Date(),
};
export const foresporselLegeerklaringFraBehandler: MeldingDTO = {
  ...defaultMeldingInnkommendeLegeerklaring,
  tidspunkt: new Date(),
};
