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
  MeldingType,
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
          conversationRef: "conversationRef000",
          parentRef: withPaminnelse
            ? paminnelseMelding.uuid
            : defaultMelding.uuid,
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
        conversationRef: "conversationRef000",
        parentRef: defaultMelding.uuid,
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
          conversationRef: "conversationRef123",
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
        conversationRef: "conversationRef123",
        parentRef: defaultMelding.uuid,
      },
      {
        ...defaultMelding,
        innkommende: true,
        antallVedlegg: 5,
        conversationRef: "conversationRef123",
        parentRef: defaultMelding.uuid,
      },
    ],
    ["conversationRef000"]: [
      defaultMelding,
      {
        ...defaultMelding,
        innkommende: true,
        antallVedlegg: 1,
        conversationRef: "conversationRef000",
        parentRef: defaultMelding.uuid,
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
  conversationRef: foresporselPasientToBehandler.conversationRef,
  parentRef: foresporselPasientToBehandler.uuid,
  tidspunkt: new Date(),
};

export const foresporselLegeerklaringTilBehandler: MeldingDTO = {
  ...defaultMeldingLegeerklaring,
  tidspunkt: new Date(),
};

export const foresporselLegeerklaringFraBehandler: MeldingDTO = {
  ...defaultMeldingInnkommendeLegeerklaring,
  conversationRef: foresporselLegeerklaringTilBehandler.conversationRef,
  parentRef: foresporselLegeerklaringTilBehandler.uuid,
  tidspunkt: new Date(),
};

export const returLegeerklaring: MeldingDTO = {
  ...defaultMeldingLegeerklaring,
  tidspunkt: new Date(),
  type: MeldingType.HENVENDELSE_RETUR_LEGEERKLARING,
  conversationRef: foresporselLegeerklaringFraBehandler.conversationRef,
  parentRef: foresporselLegeerklaringFraBehandler.uuid,
};
