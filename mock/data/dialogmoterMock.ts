import {
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "../../src/data/dialogmote/types/dialogmoteTypes";

const createDialogmote = (
  uuid: string,
  moteStatus: DialogmoteStatus,
  varselType: MotedeltakerVarselType,
  moteTid: string
) => {
  const dialogMote = {
    uuid: uuid,
    createdAt: "2021-05-26T12:56:26.238385",
    updatedAt: "2021-05-26T12:56:26.238385",
    status: moteStatus.toString(),
    opprettetAv: "Z999999",
    tildeltVeilederIdent: "Z999999",
    tildeltEnhet: "1000",
    arbeidstaker: {
      uuid: uuid + 1,
      personIdent: "12345678912",
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
        },
      ],
    },
    arbeidsgiver: {
      uuid: uuid + 3,
      virksomhetsnummer: "912345678",
      type: "ARBEIDSGIVER",
      varselList: [
        {
          uuid: uuid + 4,
          createdAt: "2021-05-26T12:56:26.282386",
          varselType: varselType,
          lestDato: "2021-05-26T12:56:26.271381",
          fritekst: "Ipsum lorum arbeidsgiver",
          document: [],
        },
      ],
    },
    sted:
      "This is a very lang text that has a lot of characters and describes where the meeting will take place.",
    tid: moteTid,
    videoLink: "https://meet.google.com/xyz",
  };

  if (moteStatus === DialogmoteStatus.FERDIGSTILT) {
    return {
      ...dialogMote,
      referat: {
        uuid: "520239a6-a973-42f6-a4e7-9fe7d27d2f93",
        createdAt: "2021-06-08T09:23:26.162354",
        updatedAt: "2021-06-08T09:23:26.162354",
        digitalt: true,
        situasjon: "Dette er en beskrivelse av situasjonen",
        konklusjon: "Dette er en beskrivelse av konklusjon",
        arbeidstakerOppgave: "Dette er en beskrivelse av arbeidstakerOppgave",
        arbeidsgiverOppgave: "Dette er en beskrivelse av arbeidsgiverOppgave",
        veilederOppgave: "Dette er en beskrivelse av veilederOppgave",
        document: [
          {
            type: "HEADER",
            title: "Tittel referat",
            texts: [],
          },
          {
            type: "PARAGRAPH",
            title: null,
            texts: ["Brødtekst"],
          },
        ],
        pdf: "Lic=",
        lestDatoArbeidstaker: null,
        lestDatoArbeidsgiver: null,
        andreDeltakere: [
          {
            uuid: "0c72f8ec-452f-4606-b47e-6da5a408a9f7",
            createdAt: "2021-06-08T09:23:26.162354",
            updatedAt: "2021-06-08T09:23:26.162354",
            funksjon: "Verneombud",
            navn: "Tøff Pyjamas",
          },
        ],
      },
    };
  }

  return dialogMote;
};

export const innkaltDialogmote = createDialogmote(
  "1",
  DialogmoteStatus.INNKALT,
  MotedeltakerVarselType.INNKALT,
  "2021-06-25T14:22:23.539843"
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

export const dialogmoterMock = [
  innkaltDialogmote,
  avlystDialogmote,
  ferdigstiltDialogmote,
];
