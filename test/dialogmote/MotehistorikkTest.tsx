import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { expect } from "chai";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { MotehistorikkPanel } from "@/components/dialogmote/motehistorikk/MotehistorikkPanel";
import { QueryClient, QueryClientProvider } from "react-query";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
let queryClient;
const dialogmoter: DialogmoteDTO[] = [
  {
    uuid: "1",
    createdAt: "2021-05-26T12:56:26.238385",
    updatedAt: "2021-05-26T12:56:26.238385",
    status: DialogmoteStatus.FERDIGSTILT,
    opprettetAv: "Z999999",
    tildeltVeilederIdent: "Z999999",
    tildeltEnhet: "1000",
    arbeidstaker: {
      personIdent: "12345678912",
      type: "ARBEIDSTAKER",
      varselList: [
        {
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
      virksomhetsnummer: "912345678",
      type: "ARBEIDSGIVER",
      varselList: [
        {
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
  },
  {
    uuid: "10",
    createdAt: "2020-05-26T12:56:26.238385",
    updatedAt: "2020-05-26T12:56:26.238385",
    status: DialogmoteStatus.AVLYST,
    opprettetAv: "Z999999",
    tildeltVeilederIdent: "Z999999",
    tildeltEnhet: "1000",
    arbeidstaker: {
      personIdent: "12345678912",
      type: "ARBEIDSTAKER",
      varselList: [
        {
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
      virksomhetsnummer: "912345678",
      type: "ARBEIDSGIVER",
      varselList: [
        {
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
  },
];

describe("Historiske dialogmøter", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });
  it("Fremviser avholdte og avlyste dialogmøter", () => {
    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(realState)}>
          <MotehistorikkPanel historiskeMoter={dialogmoter} />
        </Provider>
      </QueryClientProvider>
    );

    expect(wrapper.text()).to.contain("Avholdt møte Fredag 15. januar 2021");
    expect(wrapper.text()).to.contain("Avlyst møte Søndag 22. mars 2020");
  });
});
