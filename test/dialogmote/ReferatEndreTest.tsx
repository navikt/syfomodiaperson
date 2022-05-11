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
  dialogmoteMedMellomlagretReferat,
  mockState,
  moteTekster,
  narmesteLederNavn,
} from "./testData";
import { screen, within } from "@testing-library/react";
import { expectedEndretReferatDocument } from "./testDataDocuments";
import sinon from "sinon";
import { MAX_LENGTH_BEGRUNNELSE_ENDRING } from "@/components/dialogmote/referat/ReferatFritekster";
import { queryClientWithMockData } from "../testQueryClient";
import { referatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { renderWithRouter } from "../testRouterUtils";

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
    renderEndreReferat(dialogmoteMedFerdigstiltReferat);

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

  it("preutfyller skjema fra ferdigstilt referat", () => {
    renderEndreReferat(dialogmoteMedFerdigstiltReferat);

    expect(screen.getByDisplayValue(narmesteLederNavn)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.situasjonTekst)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidsgiversOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidstakersOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.konklusjonTekst)).to.exist;
  });

  it("preutfyller skjema med begrunnelse for endring fra mellomlagret endret referat", () => {
    renderEndreReferat(dialogmoteMedMellomlagretReferat);

    expect(screen.getByDisplayValue(moteTekster.begrunnelseEndring)).to.exist;
  });

  it("forhåndsviser endret referat", () => {
    renderEndreReferat(dialogmoteMedFerdigstiltReferat);
    passSkjemaInput();

    clickButton("Se forhåndsvisning");
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
    renderEndreReferat(dialogmoteMedFerdigstiltReferat);
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

const renderEndreReferat = (dialogmote: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <Provider store={store({ ...realState, ...mockState })}>
        <Referat
          dialogmote={dialogmote}
          pageTitle="Test"
          mode={ReferatMode.ENDRET}
        />
      </Provider>
    </QueryClientProvider>,
    `${dialogmoteRoutePath}/:dialogmoteUuid/referat/endre`,
    [`${dialogmoteRoutePath}/${dialogmote.uuid}/referat/endre`]
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
