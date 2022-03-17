import React from "react";
import { expect } from "chai";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { MotehistorikkPanel } from "@/components/dialogmote/motehistorikk/MotehistorikkPanel";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ENHET_GRUNERLOKKA,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";

let queryClient;
const dialogmoter: DialogmoteDTO[] = [
  {
    uuid: "1",
    createdAt: "2021-05-26T12:56:26.238385",
    updatedAt: "2021-05-26T12:56:26.238385",
    status: DialogmoteStatus.FERDIGSTILT,
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    tildeltVeilederIdent: VEILEDER_IDENT_DEFAULT,
    tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
    arbeidstaker: {
      personIdent: "12345678912",
      type: "ARBEIDSTAKER",
      varselList: [
        {
          uuid: "123",
          createdAt: "2021-05-26T12:56:26.271381",
          varselType: MotedeltakerVarselType.INNKALT,
          digitalt: true,
          lestDato: "2021-05-26T12:56:26.271381",
          fritekst: "Ipsum lorum arbeidstaker",
          document: [],
        },
      ],
    },
    arbeidsgiver: {
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      type: "ARBEIDSGIVER",
      varselList: [
        {
          uuid: "456",
          createdAt: "2021-05-26T12:56:26.282386",
          varselType: MotedeltakerVarselType.INNKALT,
          lestDato: "2021-05-26T12:56:26.271381",
          fritekst: "Ipsum lorum arbeidsgiver",
          document: [],
          status: "Status",
        },
      ],
    },
    sted: "Sted",
    tid: "2021-01-15T11:52:13.539843",
    referatList: [],
  },
  {
    uuid: "10",
    createdAt: "2020-05-26T12:56:26.238385",
    updatedAt: "2020-05-26T12:56:26.238385",
    status: DialogmoteStatus.AVLYST,
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    tildeltVeilederIdent: VEILEDER_IDENT_DEFAULT,
    tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
    arbeidstaker: {
      personIdent: "12345678912",
      type: "ARBEIDSTAKER",
      varselList: [
        {
          uuid: "abc",
          createdAt: "2021-05-26T12:56:26.271381",
          varselType: MotedeltakerVarselType.AVLYST,
          digitalt: true,
          lestDato: "2021-05-26T12:56:26.271381",
          fritekst: "Ipsum lorum arbeidstaker",
          document: [],
        },
      ],
    },
    arbeidsgiver: {
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      type: "ARBEIDSGIVER",
      varselList: [
        {
          uuid: "def",
          createdAt: "2021-05-26T12:56:26.282386",
          varselType: MotedeltakerVarselType.AVLYST,
          lestDato: "2021-05-26T12:56:26.271381",
          fritekst: "Ipsum lorum arbeidsgiver",
          document: [],
          status: "Status",
        },
      ],
    },
    sted: "Sted",
    tid: "2020-03-22T11:52:13.539843",
    referatList: [],
  },
];

describe("Historiske dialogmøter", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });
  it("Fremviser avholdte og avlyste dialogmøter", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MotehistorikkPanel historiskeMoter={dialogmoter} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Avholdt møte Fredag 15. januar 2021")).to.exist;
    expect(screen.getByText("Avlyst møte Søndag 22. mars 2020")).to.exist;
  });
});
