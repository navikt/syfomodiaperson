import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { render, screen } from "@testing-library/react";
import React from "react";
import { DialogmoteMoteStatusPanel } from "@/components/mote/components/innkalling/DialogmoteMoteStatusPanel";
import { dialogmote, dialogmoteMedMellomlagretReferat } from "./testData";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { expect } from "chai";
import { daysFromToday } from "../testUtils";

const queryClient = new QueryClient();
const realState = createStore(rootReducer).getState();
const store = configureStore([]);

const renderDialogmoteMoteStatusPanel = (dialogmote: DialogmoteDTO) =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState })}>
          <DialogmoteMoteStatusPanel dialogmote={dialogmote} />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );

describe("DialogmoteMoteStatusPanel", () => {
  it("Viser knapp 'Skriv referat' når dialogmøte uten påbegynt referat", () => {
    renderDialogmoteMoteStatusPanel(dialogmote);

    expect(screen.getByRole("button", { name: "Skriv referat" })).to.exist;
    expect(screen.queryByRole("button", { name: "Fortsett på referatet" })).to
      .not.exist;
  });
  it("Viser knapp 'Fortsett på referat' når dialogmøte med påbegynt referat", () => {
    renderDialogmoteMoteStatusPanel(dialogmoteMedMellomlagretReferat);

    expect(screen.getByRole("button", { name: "Fortsett på referatet" })).to
      .exist;
    expect(screen.queryByRole("button", { name: "Skriv referat" })).to.not
      .exist;
  });
  it("Viser overskrift 'Innkallingen er sendt' for innkalt dialogmøte i morgen", () => {
    const innkaltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      tid: daysFromToday(1).toISOString(),
    };
    renderDialogmoteMoteStatusPanel(innkaltDialogmote);

    expect(screen.getByRole("heading", { name: "Innkallingen er sendt" })).to
      .exist;
  });
  it("Viser overskrift 'Endringen er sendt' for endret dialogmøte i morgen", () => {
    const endretDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.NYTT_TID_STED,
      tid: daysFromToday(1).toISOString(),
    };
    renderDialogmoteMoteStatusPanel(endretDialogmote);

    expect(screen.getByRole("heading", { name: "Endringen er sendt" })).to
      .exist;
  });
  it("Viser overskrift 'Møtedato er passert' for innkalt dialogmøte i går", () => {
    const innkaltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      tid: daysFromToday(-1).toISOString(),
    };
    renderDialogmoteMoteStatusPanel(innkaltDialogmote);

    expect(screen.getByRole("heading", { name: "Møtedato er passert" })).to
      .exist;
  });
  it("Viser overskrift 'Møtedato er passert' for endret dialogmøte i går", () => {
    const endretDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.NYTT_TID_STED,
      tid: daysFromToday(-1).toISOString(),
    };
    renderDialogmoteMoteStatusPanel(endretDialogmote);

    expect(screen.getByRole("heading", { name: "Møtedato er passert" })).to
      .exist;
  });
  it("Viser overskrift 'Innkallingen er sendt' for innkalt dialogmøte i dag", () => {
    const innkaltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      tid: new Date().toISOString(),
    };
    renderDialogmoteMoteStatusPanel(innkaltDialogmote);

    expect(screen.getByRole("heading", { name: "Innkallingen er sendt" })).to
      .exist;
  });
  it("Viser overskrift 'Endringen er sendt' for endret dialogmøte i dag", () => {
    const endretDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.NYTT_TID_STED,
      tid: new Date().toISOString(),
    };
    renderDialogmoteMoteStatusPanel(endretDialogmote);

    expect(screen.getByRole("heading", { name: "Endringen er sendt" })).to
      .exist;
  });
});
