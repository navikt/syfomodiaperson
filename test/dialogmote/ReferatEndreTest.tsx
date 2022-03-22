import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import Referat, {
  ReferatMode,
  texts as referatSkjemaTexts,
  valideringsTexts as referatSkjemaValideringsTexts,
} from "../../src/components/dialogmote/referat/Referat";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { expect } from "chai";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import {
  changeTextInput,
  clickButton,
  getFeilmeldingLink,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { QueryClientProvider } from "react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import {
  dialogmoteMedFerdigstiltReferat,
  mockState,
  moteTekster,
  narmesteLederNavn,
} from "./testData";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedEndretReferatDocument } from "./testDataDocuments";
import sinon from "sinon";
import { MAX_LENGTH_BEGRUNNELSE_ENDRING } from "@/components/dialogmote/referat/ReferatFritekster";
import { queryClientWithMockData } from "../testQueryClient";
import { referatTexts } from "@/data/dialogmote/dialogmoteTexts";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);

let queryClient;

describe("ReferatEndreTest", () => {
  let clock;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("validerer begrunnelse for endring", () => {
    renderEndreReferat();

    clickButton("Lagre og send");

    expect(
      screen.getAllByText(
        referatSkjemaValideringsTexts.begrunnelseEndringMissing
      )
    ).to.not.be.empty;
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(
      getFeilmeldingLink(
        referatSkjemaValideringsTexts.begrunnelseEndringMissing
      )
    ).to.exist;

    const begrunnelseInput = getTextInput("Årsaken til at referatet må endres");
    changeTextInput(
      begrunnelseInput,
      getTooLongText(MAX_LENGTH_BEGRUNNELSE_ENDRING)
    );
    clickButton("Lagre og send");
    expect(screen.getByRole("link", { name: /tegn tillatt/ })).to.exist;
  });

  it("preutfyller endre referat-skjema fra dialogmote med referat", () => {
    renderEndreReferat();

    expect(screen.getByDisplayValue(narmesteLederNavn)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.situasjonTekst)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidsgiversOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidstakersOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.konklusjonTekst)).to.exist;
  });

  it("forhåndsviser endret referat", () => {
    renderEndreReferat();
    passSkjemaInput();

    const previewButton = screen.getByRole("button", {
      name: "Se forhåndsvisning",
    });
    userEvent.click(previewButton);
    const forhandsvisningReferat = screen.getByRole("dialog", {
      name: referatSkjemaTexts.forhandsvisningContentLabel,
    });

    expect(within(forhandsvisningReferat).getByText(referatTexts.endretHeader))
      .to.exist;
    expect(within(forhandsvisningReferat).getByText(referatTexts.endring)).to
      .exist;
    expect(
      within(forhandsvisningReferat).getByText(
        referatTexts.begrunnelseEndringTitle
      )
    ).to.exist;
    expect(
      within(forhandsvisningReferat).getByText(moteTekster.begrunnelseEndring)
    ).to.exist;
  });

  it("endrer ferdigstilling av dialogmote ved submit av skjema", () => {
    renderEndreReferat();
    passSkjemaInput();
    clickButton("Lagre og send");

    const endringFerdigstillMutation = queryClient
      .getMutationCache()
      .getAll()[0];
    const expectedEndringFerdigstilling = {
      narmesteLederNavn: narmesteLederNavn,
      situasjon: moteTekster.situasjonTekst,
      konklusjon: moteTekster.konklusjonTekst,
      arbeidsgiverOppgave: moteTekster.arbeidsgiversOppgave,
      arbeidstakerOppgave: moteTekster.arbeidstakersOppgave,
      begrunnelseEndring: moteTekster.begrunnelseEndring,
      veilederOppgave: moteTekster.veiledersOppgave,
      document: expectedEndretReferatDocument(),
      andreDeltakere: [],
    };
    expect(endringFerdigstillMutation.options.variables).to.deep.equal(
      expectedEndringFerdigstilling
    );
  });
});

const renderEndreReferat = () => {
  return render(
    <MemoryRouter
      initialEntries={[
        `${dialogmoteRoutePath}/${dialogmoteMedFerdigstiltReferat.uuid}/referat/endre`,
      ]}
    >
      <Route path={`${dialogmoteRoutePath}/:dialogmoteUuid/referat/endre`}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <Referat
              dialogmote={dialogmoteMedFerdigstiltReferat}
              pageTitle="Test"
              mode={ReferatMode.ENDRET}
            />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};

const passSkjemaInput = () => {
  const begrunnelseInput = getTextInput("Årsaken til at referatet må endres");
  const situasjonInput = getTextInput("Situasjon og muligheter");
  const konklusjonInput = getTextInput("Konklusjon");
  const arbeidstakerInput = getTextInput("Arbeidstakerens oppgave:");
  const arbeidsgiverInput = getTextInput("Arbeidsgiverens oppgave:");
  const veilederInput = getTextInput("Veilederens oppgave (valgfri):");
  changeTextInput(begrunnelseInput, moteTekster.begrunnelseEndring);
  changeTextInput(situasjonInput, moteTekster.situasjonTekst);
  changeTextInput(konklusjonInput, moteTekster.konklusjonTekst);
  changeTextInput(arbeidstakerInput, moteTekster.arbeidstakersOppgave);
  changeTextInput(arbeidsgiverInput, moteTekster.arbeidsgiversOppgave);
  changeTextInput(veilederInput, moteTekster.veiledersOppgave);
};
