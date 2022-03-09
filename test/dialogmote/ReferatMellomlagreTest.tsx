import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import Referat from "../../src/components/dialogmote/referat/Referat";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { expect } from "chai";
import {
  changeTextInput,
  clickButton,
  getCheckbox,
  getTextInput,
} from "../testUtils";
import { QueryClientProvider } from "react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  arbeidstaker,
  behandlerDeltakerTekst,
  dialogmoteMedBehandler,
  dialogmoteMedReferat,
  dialogmoteMedReferatBehandlerIkkeDeltatt,
  moteTekster,
  narmesteLederNavn,
  referatStandardTekst,
} from "./testData";
import { render, screen } from "@testing-library/react";
import { expectedReferatDocument } from "./testDataDocuments";
import sinon from "sinon";
import userEvent from "@testing-library/user-event";
import { stubMellomlagreApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import { queryClientWithMockData } from "../testQueryClient";
import { texts as deltakereSkjemaTexts } from "@/components/dialogmote/referat/Deltakere";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);

const mockState = {
  navbruker: {
    data: {
      navn: arbeidstaker.navn,
      kontaktinfo: {
        fnr: arbeidstaker.personident,
      },
    },
  },
};

let queryClient;

describe("ReferatMellomlagreTest", () => {
  let clock;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("lagrer referat med verdier fra skjema", () => {
    stubMellomlagreApi(apiMock(), dialogmoteMedBehandler.uuid);
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();
    clickButton("Lagre");

    const mellomlagreMutation = queryClient.getMutationCache().getAll()[0];
    const expectedReferat = {
      narmesteLederNavn: narmesteLederNavn,
      situasjon: moteTekster.situasjonTekst,
      konklusjon: moteTekster.konklusjonTekst,
      arbeidsgiverOppgave: moteTekster.arbeidsgiversOppgave,
      arbeidstakerOppgave: moteTekster.arbeidstakersOppgave,
      behandlerDeltatt: true,
      behandlerMottarReferat: true,
      behandlerOppgave: moteTekster.behandlersOppgave,
      veilederOppgave: moteTekster.veiledersOppgave,
      document: expectedReferatDocument(),
      andreDeltakere: [
        { funksjon: annenDeltakerFunksjon, navn: annenDeltakerNavn },
      ],
    };
    expect(mellomlagreMutation.options.variables).to.deep.equal(
      expectedReferat
    );
  });

  it("preutfyller referat-skjema fra dialogmote med mellomlagret referat", () => {
    renderReferat(dialogmoteMedReferat);

    expect(screen.getByDisplayValue(narmesteLederNavn)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.situasjonTekst)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidsgiversOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidstakersOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.konklusjonTekst)).to.exist;
    expect(screen.getByDisplayValue(annenDeltakerNavn)).to.exist;
    expect(screen.getByDisplayValue(annenDeltakerFunksjon)).to.exist;
    const checkedStandardtekst = getCheckbox(referatStandardTekst.label, true);
    expect(checkedStandardtekst).to.exist;
  });

  it("preutfyller referat-skjema behandler-deltakelse fra dialogmote", () => {
    renderReferat(dialogmoteMedReferatBehandlerIkkeDeltatt);

    clickButton(`${behandlerDeltakerTekst}, deltok ikke`);

    expect(getCheckbox(deltakereSkjemaTexts.behandlerDeltokLabel, false)).to
      .exist;
    expect(getCheckbox(deltakereSkjemaTexts.behandlerMottaReferatLabel, false))
      .to.exist;
  });
});

const renderReferat = (dialogmoteDTO: DialogmoteDTO) => {
  return render(
    <MemoryRouter
      initialEntries={[`${dialogmoteRoutePath}/${dialogmoteDTO.uuid}/referat`]}
    >
      <Route path={`${dialogmoteRoutePath}/:dialogmoteUuid/referat`}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <Referat dialogmote={dialogmoteDTO} pageTitle="Test" />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};

const passSkjemaTekstInput = () => {
  const situasjonInput = getTextInput("Situasjon og muligheter");
  const konklusjonInput = getTextInput("Konklusjon");
  const arbeidstakerInput = getTextInput("Arbeidstakerens oppgave:");
  const arbeidsgiverInput = getTextInput("Arbeidsgiverens oppgave:");
  const behandlerInput = getTextInput("Behandlerens oppgave (valgfri):");
  const veilederInput = getTextInput("Veilederens oppgave (valgfri):");
  const addDeltakerButton = screen.getByRole("button", {
    name: "Pluss ikon Legg til en deltaker",
  });
  userEvent.click(addDeltakerButton);
  const annenDeltakerNavnInput = screen.getAllByRole("textbox", {
    name: "Navn",
  })[1];
  const annenDeltakerFunksjonInput = getTextInput("Funksjon");

  changeTextInput(annenDeltakerNavnInput, annenDeltakerNavn);
  changeTextInput(annenDeltakerFunksjonInput, annenDeltakerFunksjon);
  changeTextInput(situasjonInput, moteTekster.situasjonTekst);
  changeTextInput(konklusjonInput, moteTekster.konklusjonTekst);
  changeTextInput(arbeidstakerInput, moteTekster.arbeidstakersOppgave);
  changeTextInput(arbeidsgiverInput, moteTekster.arbeidsgiversOppgave);
  changeTextInput(behandlerInput, moteTekster.behandlersOppgave);
  changeTextInput(veilederInput, moteTekster.veiledersOppgave);
};
