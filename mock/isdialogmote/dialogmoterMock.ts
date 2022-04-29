import {
  DialogmotedeltakerBehandlerDTO,
  DialogmoteStatus,
  DocumentComponentType,
  MotedeltakerVarselType,
} from "../../src/data/dialogmote/types/dialogmoteTypes";
import { BehandlerType } from "../../src/data/behandler/BehandlerDTO";
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GRUNERLOKKA,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import { ReferatDTO } from "../../src/data/dialogmote/types/dialogmoteReferatTypes";
import { referatTexts } from "../../src/data/dialogmote/dialogmoteTexts";

const createDialogmote = (
  uuid: string,
  moteStatus: DialogmoteStatus,
  varselType: MotedeltakerVarselType,
  moteTid: string,
  behandler?: DialogmotedeltakerBehandlerDTO
) => {
  const dialogMote = {
    uuid: uuid,
    createdAt: "2021-05-26T12:56:26.238385",
    updatedAt: "2021-05-26T12:56:26.238385",
    status: moteStatus.toString(),
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    tildeltVeilederIdent: VEILEDER_IDENT_DEFAULT,
    tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
    arbeidstaker: {
      uuid: uuid + 1,
      personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
      type: "ARBEIDSTAKER",
      varselList: [
        {
          uuid: uuid + 2,
          createdAt: "2021-05-26T12:56:26.271381",
          varselType: varselType.toString(),
          digitalt: true,
          lestDato: "2021-05-26T12:56:26.271381",
          fritekst: "Ipsum lorum arbeidstaker",
          document: [
            { type: "PARAGRAPH", title: "Tittel innkalling", texts: [] },
            { type: "PARAGRAPH", title: "Møtetid:", texts: ["5. mai 2021"] },
            { type: "PARAGRAPH", title: null, texts: ["Brødtekst"] },
            { type: "LINK", title: null, texts: ["https://nav.no/"] },
            {
              type: "PARAGRAPH",
              title: null,
              texts: ["Vennlig hilsen", "NAV Staden", "Kari Saksbehandler"],
            },
          ],
          svar: {
            svarTidspunkt: "2021-05-26T12:56:26.271381",
            svarType: "KOMMER",
          },
        },
      ],
    },
    arbeidsgiver: {
      uuid: uuid + 3,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      type: "ARBEIDSGIVER",
      varselList: [
        {
          uuid: uuid + 4,
          createdAt: "2021-05-26T12:56:26.282386",
          varselType: varselType,
          lestDato: "2021-05-26T12:56:26.271381",
          fritekst: "Ipsum lorum arbeidsgiver",
          document: [],
          svar: {
            svarTidspunkt: "2021-05-26T12:56:26.271381",
            svarTekst: "Passer ikke denne dagen.",
            svarType: "NYTT_TID_STED",
          },
        },
      ],
    },
    ...(behandler
      ? {
          behandler: {
            ...behandler,
            varselList: [
              {
                uuid: uuid + 5,
                createdAt: "2021-12-01T12:56:26.282386",
                varselType: varselType,
                fritekst: "Ipsum lorum behandler",
                document: [],
                svar: [
                  {
                    uuid: uuid + 6,
                    createdAt: "2021-12-03T12:56:26.282386",
                    svarType: "KOMMER",
                    tekst: "Jeg kommer i møtet.",
                  },
                ],
              },
            ],
          },
        }
      : {}),
    sted:
      "This is a very lang text that has a lot of characters and describes where the meeting will take place.",
    tid: moteTid,
    videoLink: "https://video.nav.no/xyz",
    referatList: [],
  };

  if (moteStatus === DialogmoteStatus.FERDIGSTILT) {
    return {
      ...dialogMote,
      referatList: [createReferat(true, dialogMote.tid)],
    };
  }

  return dialogMote;
};

const createReferat = (ferdigstilt: boolean, tid: string): ReferatDTO => {
  const standardTekst = referatTexts.standardTekster[0];
  return {
    uuid: "520239a6-a973-42f6-a4e7-9fe7d27d2f93",
    createdAt: tid,
    updatedAt: tid,
    ferdigstilt,
    narmesteLederNavn: "Tatten Tattover",
    situasjon: "Dette er en beskrivelse av situasjonen",
    konklusjon: "Dette er en beskrivelse av konklusjon",
    arbeidstakerOppgave: "Dette er en beskrivelse av arbeidstakerOppgave",
    arbeidsgiverOppgave: "Dette er en beskrivelse av arbeidsgiverOppgave",
    veilederOppgave: "Dette er en beskrivelse av veilederOppgave",
    document: [
      {
        type: DocumentComponentType.HEADER_H1,
        title: "Tittel referat",
        texts: [],
      },
      {
        type: DocumentComponentType.PARAGRAPH,
        texts: ["Brødtekst"],
      },
      {
        type: DocumentComponentType.PARAGRAPH,
        key: standardTekst.key,
        title: standardTekst.label,
        texts: [standardTekst.text],
      },
    ],
    andreDeltakere: [
      {
        funksjon: "Verneombud",
        navn: "Tøff Pyjamas",
      },
    ],
  };
};

const behandler = (uuid: string): DialogmotedeltakerBehandlerDTO => {
  return {
    uuid: uuid + 4,
    personIdent: "01038521470",
    behandlerRef: uuid + 5,
    behandlerNavn: "Lego Legesen",
    behandlerKontor: "Fastlegekontoret",
    behandlerType: BehandlerType.FASTLEGE,
    type: "BEHANDLER",
    varselList: [],
    deltatt: true,
    mottarReferat: true,
  };
};

export const innkaltDialogmote = createDialogmote(
  "1",
  DialogmoteStatus.INNKALT,
  MotedeltakerVarselType.INNKALT,
  "2021-11-15T14:22:23.539843"
);
export const avlystDialogmote = createDialogmote(
  "2",
  DialogmoteStatus.AVLYST,
  MotedeltakerVarselType.AVLYST,
  "2021-01-15T11:52:13.539843"
);
export const ferdigstiltDialogmote = createDialogmote(
  "3",
  DialogmoteStatus.FERDIGSTILT,
  MotedeltakerVarselType.REFERAT,
  "2020-03-21T12:34:23.539843"
);

export const innkaltDialogmoteMedBehandler = createDialogmote(
  "4",
  DialogmoteStatus.INNKALT,
  MotedeltakerVarselType.INNKALT,
  "2021-11-10T14:22:23.539843",
  behandler("4")
);

export const dialogmoterMock = [
  innkaltDialogmote,
  avlystDialogmote,
  ferdigstiltDialogmote,
  innkaltDialogmoteMedBehandler,
];
