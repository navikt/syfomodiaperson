import React from "react";
import { expect } from "chai";
import { SykmeldingUtdragContainer } from "@/components/speiling/sykepengsoknader/SykmeldingUtdragContainer";
import {
  mockSykepengeSoknad,
  mockSykmeldinger,
} from "../mockdata/sykmeldinger/mockSykmeldinger";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VIRKSOMHET_PONTYPANDY } from "../../mock/common/mockConstants";
import { QueryClient, QueryClientProvider } from "react-query";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const fnr = "12345000000";
let queryClient;

const sykmelding = mockSykmeldinger.find((s) => {
  return s.id === mockSykepengeSoknad.sykmeldingId;
});

describe("SykmeldingUtdrag", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.setQueryData(
      sykmeldingerQueryKeys.sykmeldinger(fnr),
      () => mockSykmeldinger
    );
  });

  it("Skal vise SykmeldingUtdrag for riktig sykmelding", () => {
    const mockStore = store({
      ...realState,
      valgtbruker: { personident: fnr },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={mockStore}>
          <SykmeldingUtdragContainer soknad={mockSykepengeSoknad} />
        </Provider>
      </QueryClientProvider>
    );
    userEvent.click(screen.getByRole("button"));
    expect(sykmelding?.sykmeldingStatus?.arbeidsgiver?.orgNavn).to.equal(
      VIRKSOMHET_PONTYPANDY.virksomhetsnavn
    );
    expect(screen.getByText(VIRKSOMHET_PONTYPANDY.virksomhetsnavn)).to.exist;
  });
});
