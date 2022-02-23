import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import Referat from "../../src/components/dialogmote/referat/Referat";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { expect } from "chai";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  arbeidstaker,
  behandlendeEnhet,
  dialogmoteMedBehandler,
  dialogmoteMedReferat,
  lederNavn,
  moteTekster,
  referatStandardTekst,
  veileder,
} from "./testData";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { VIRKSOMHET_PONTYPANDY } from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { expectedReferatDocument } from "./testDataDocuments";
import sinon from "sinon";
import userEvent from "@testing-library/user-event";
import { stubMellomlagreApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";

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
  valgtbruker: {
    personident: arbeidstaker.personident,
  },
  ledere: {
    currentLedere: [
      {
        narmesteLederNavn: lederNavn,
        status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        virksomhetsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      },
      {
        narmesteLederNavn: "Annen Leder",
        status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        virksomhetsnummer: "89829812",
      },
    ],
  },
};

let queryClient;

describe("ReferatMellomlagreTest", () => {
  let clock;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.setQueryData(
      veilederinfoQueryKeys.veilederinfo,
      () => veileder
    );
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(arbeidstaker.personident),
      () => behandlendeEnhet
    );

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
      narmesteLederNavn: lederNavn,
      situasjon: moteTekster.situasjonTekst,
      konklusjon: moteTekster.konklusjonTekst,
      arbeidsgiverOppgave: moteTekster.arbeidsgiversOppgave,
      arbeidstakerOppgave: moteTekster.arbeidstakersOppgave,
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

    expect(screen.getByDisplayValue(lederNavn)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.situasjonTekst)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidsgiversOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidstakersOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.konklusjonTekst)).to.exist;
    expect(screen.getByDisplayValue(annenDeltakerNavn)).to.exist;
    expect(screen.getByDisplayValue(annenDeltakerFunksjon)).to.exist;
    const checkedStandardtekst = screen.getByRole("checkbox", {
      checked: true,
      name: referatStandardTekst.label,
    });
    expect(checkedStandardtekst).to.exist;
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
  const annenDeltakerNavnInput = getTextInput("Navn");
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
