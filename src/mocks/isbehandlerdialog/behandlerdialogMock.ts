import {
  behandlerDoktorLegesen,
  behandlerLegoLasLegesen,
  behandlerRefDoktorLegesen,
  behandlerRefLegoLasLegesen,
} from "../isdialogmelding/behandlereDialogmeldingMock";
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";
import {
  paminnelseTexts,
  returLegeerklaringTexts,
  tilleggsOpplysningerPasientTexts,
} from "@/data/behandlerdialog/behandlerMeldingTexts";
import {
  MeldingStatusType,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";

const defaultMeldingTekst = "Dette er en melding";
const returLegeerklaringBegrunnelse = "Begrunnelse for retur";
const meldingtilBehandlerDocument = [
  {
    texts: [tilleggsOpplysningerPasientTexts.header],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder pasient: ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [tilleggsOpplysningerPasientTexts.intro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [defaultMeldingTekst],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [tilleggsOpplysningerPasientTexts.takst],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    title: tilleggsOpplysningerPasientTexts.lovhjemmel.title,
    texts: [tilleggsOpplysningerPasientTexts.lovhjemmel.text],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilleggsOpplysningerPasientTexts.klage1,
      tilleggsOpplysningerPasientTexts.klage2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];
const paminnelseDocument = [
  {
    texts: [paminnelseTexts.header],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${paminnelseTexts.intro.part1} 01.01.2023 ${paminnelseTexts.intro.part2}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [paminnelseTexts.text1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [paminnelseTexts.text2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];
const returLegeerklaringDocument = [
  {
    texts: [returLegeerklaringTexts.header],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [returLegeerklaringTexts.intro.part1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [returLegeerklaringTexts.intro.part2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [returLegeerklaringBegrunnelse],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [returLegeerklaringTexts.outro.part1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [returLegeerklaringTexts.outro.part2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const defaultStatus = {
  type: MeldingStatusType.OK,
  tekst: null,
};

export const meldingUuids = {
  tilleggsopplysningerUtgaaende: "5f1e2629-062b-443d-ac1f-3b08e9574cd5",
  tilleggopplysningerInnkommende: "5f1e2629-062b-442d-ae1f-3b08e9574cd5",
  legeerklaringInnkommende: "1f1e2639-061b-245e-ac1f-3b08e9574cd5",
  legeerklaringInnkommendeNy: "daae501e-417c-11ee-be56-0242ac120002",
  ubesvartMelding: "5f1e2639-032c-443d-ac1f-3b08e9574cd5",
  avvistMelding: "9f1e2639-061b-243d-ac1f-3b08e9574cd5",
  avvistMelding2: "2f1e2639-061b-243d-ac1f-3b08e9574cd5",
};

export const defaultMelding = {
  uuid: meldingUuids.tilleggsopplysningerUtgaaende,
  conversationRef: "59da3774-40bd-11ee-be56-0242ac120002 ",
  parentRef: null,
  behandlerRef: behandlerRefDoktorLegesen,
  behandlerNavn: null,
  tekst: defaultMeldingTekst,
  tidspunkt: "2023-01-01T12:00:00.000+01:00",
  innkommende: false,
  type: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER,
  document: meldingtilBehandlerDocument,
  antallVedlegg: 0,
  status: defaultStatus,
  veilederIdent: VEILEDER_IDENT_DEFAULT,
  isFirstVedleggLegeerklaring: false,
};

export const defaultMeldingLegeerklaring = {
  uuid: "5f1e2629-062b-443d-ad2f-3b08e9574cd5",
  conversationRef: "64eb32f8-40bd-11ee-be56-0242ac120002",
  parentRef: null,
  behandlerRef: behandlerRefDoktorLegesen,
  behandlerNavn: null,
  tekst: defaultMeldingTekst,
  tidspunkt: "2023-01-01T12:00:00.000+01:00",
  innkommende: false,
  type: MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING,
  document: meldingtilBehandlerDocument,
  antallVedlegg: 0,
  status: defaultStatus,
  veilederIdent: VEILEDER_IDENT_DEFAULT,
  isFirstVedleggLegeerklaring: false,
};

export const paminnelseMelding = {
  ...defaultMelding,
  conversationRef: defaultMelding.conversationRef,
  parentRef: defaultMelding.uuid,
  type: MeldingType.FORESPORSEL_PASIENT_PAMINNELSE,
  tekst: "",
  document: paminnelseDocument,
  tidspunkt: "2023-01-06T12:00:00.000+01:00",
  uuid: "5f1e2639-032c-443d-ac1f-3b18e1534cd5",
};

export const defaultMeldingInnkommende = {
  ...defaultMelding,
  conversationRef: defaultMelding.conversationRef,
  parentRef: defaultMelding.uuid,
  uuid: "1f1e2639-061b-243d-ac1f-3b08e9574cd5",
  behandlerNavn: `${behandlerDoktorLegesen.fornavn} ${behandlerDoktorLegesen.etternavn}`,
  innkommende: true,
  tidspunkt: "2023-01-03T12:00:00.000+01:00",
  antallVedlegg: 1,
  document: [],
  veilederIdent: null,
};

export const defaultMeldingInnkommendeLegeerklaring = {
  ...defaultMeldingLegeerklaring,
  conversationRef: defaultMeldingLegeerklaring.conversationRef,
  parentRef: defaultMeldingLegeerklaring.uuid,
  uuid: meldingUuids.legeerklaringInnkommende,
  behandlerNavn: `${behandlerDoktorLegesen.fornavn} ${behandlerDoktorLegesen.etternavn}`,
  innkommende: true,
  tidspunkt: "2023-01-03T12:00:00.000+01:00",
  antallVedlegg: 1,
  document: [],
  veilederIdent: null,
  isFirstVedleggLegeerklaring: true,
};

export const defaultReturLegeerklaring = {
  ...defaultMeldingLegeerklaring,
  type: MeldingType.HENVENDELSE_RETUR_LEGEERKLARING,
  tekst: returLegeerklaringBegrunnelse,
  tidspunkt: "2023-01-04T12:00:00.000+01:00",
  document: returLegeerklaringDocument,
  conversationRef: defaultMeldingLegeerklaring.conversationRef,
  parentRef: defaultMeldingInnkommendeLegeerklaring.uuid,
};

export const meldingFraNav = {
  ...defaultMelding,
  type: MeldingType.HENVENDELSE_MELDING_FRA_NAV,
  tekst: "Dette er en melding fra NAV til behandler der veileder lurer på noe.",
  tidspunkt: "2023-01-07T12:00:00.000+01:00",
};

export const meldingTilNav = {
  ...defaultMeldingInnkommende,
  parentRef: null,
  behandlerRef: null,
  type: MeldingType.HENVENDELSE_MELDING_TIL_NAV,
  tekst: "Melding fra behandler til NAV der behandler lurer på noe.",
  tidspunkt: "2023-01-17T12:00:00.000+01:00",
};

export const responsPaMeldingFraNAV = {
  ...defaultMelding,
  innkommende: true,
  type: MeldingType.HENVENDELSE_MELDING_FRA_NAV,
  tekst: "Melding fra behandler som svarer på melding fra NAV",
  tidspunkt: "2023-01-07T12:00:00.000+01:00",
};

export const defaultMeldingInnkommendeLegeerklaringNy = {
  ...defaultMeldingInnkommendeLegeerklaring,
  uuid: meldingUuids.legeerklaringInnkommendeNy,
};

export const defaultMeldingInnkommendeLegeerklaringMedTreVedlegg = {
  ...defaultMeldingInnkommendeLegeerklaring,
  antallVedlegg: 3,
};

const ubesvartMelding = {
  ...defaultMelding,
  uuid: meldingUuids.ubesvartMelding,
};

const longMelding =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec tincidunt sapien.\nAliquam a velit nisl. Integer feugiat est et suscipit cursus. Morbi iaculis quam ut malesuada semper.\nIn hac habitasse platea dictumst. Nam scelerisque neque at augue dictum pulvinar. Sed sed posuere mi.\n\nDuis ac quam at metus luctus hendrerit ac ut nulla.\nUt eu laoreet arcu. Ut eget lacus sed nisi vestibulum volutpat a sit amet tellus.";

const meldinger = [
  defaultMelding,
  {
    uuid: meldingUuids.tilleggopplysningerInnkommende,
    tekst: longMelding,
    behandlerRef: behandlerRefLegoLasLegesen,
    behandlerNavn: `${behandlerLegoLasLegesen.fornavn} ${behandlerLegoLasLegesen.mellomnavn} ${behandlerLegoLasLegesen.etternavn}`,
    innkommende: true,
    type: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER,
    tidspunkt: "2023-01-02T12:00:00.000+01:00",
    antallVedlegg: 5,
    document: [],
    veilederIdent: null,
  },
  defaultMeldingInnkommende,
  {
    ...defaultMelding,
    uuid: meldingUuids.avvistMelding,
    tidspunkt: "2023-01-04T12:00:00.000+01:00",
    status: {
      type: MeldingStatusType.AVVIST,
      tekst: "Mottaker ikke funnet",
    },
  },
  {
    ...defaultMelding,
    uuid: meldingUuids.avvistMelding2,
    tidspunkt: "2023-01-05T12:00:00.000+01:00",
    status: {
      ...defaultStatus,
      type: MeldingStatusType.AVVIST,
    },
  },
];

export const behandlerdialogMock = {
  conversations: {
    "conversationRef-123": [ubesvartMelding],
    "conversationRef-456": meldinger.slice(0, 2),
    "conversationRef-789": meldinger,
    "conversationRef-981": [defaultMelding, paminnelseMelding],
    "conversationRef-999": [meldingFraNav, responsPaMeldingFraNAV],
    "conversationRef-819": [
      defaultMeldingLegeerklaring,
      defaultMeldingInnkommendeLegeerklaring,
    ],
    "conversationRef-929": [
      defaultMeldingLegeerklaring,
      defaultMeldingInnkommendeLegeerklaring,
      defaultReturLegeerklaring,
    ],
    "conversationRef-939": [meldingTilNav],
  },
};

export const behandlerdialogMockEmpty = {
  conversations: {},
};
