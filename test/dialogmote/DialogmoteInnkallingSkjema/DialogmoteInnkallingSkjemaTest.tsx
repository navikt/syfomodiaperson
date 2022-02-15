import React from "react";
import { expect } from "chai";
import { MemoryRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { texts as skjemaFeilOppsummeringTexts } from "@/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import { QueryClientProvider } from "react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubInnkallingApi } from "../../stubs/stubIsdialogmote";
import { apiMock } from "../../stubs/stubApi";
import {
  arbeidsgiver,
  arbeidstaker,
  mockState,
  mote,
  moteTekster,
  navEnhet,
} from "../testData";
import { fireEvent, render, screen } from "@testing-library/react";
import { changeTextInput, clickButton, getTextInput } from "../../testUtils";
import { expectedInnkallingDocuments } from "../testDataDocuments";
import sinon from "sinon";
import { queryClientWithMockData } from "../../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { VIRKSOMHET_UTEN_NARMESTE_LEDER } from "../../../mock/common/mockConstants";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
let queryClient;

describe("DialogmoteInnkallingSkjema", () => {
  let clock;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("validerer arbeidsgiver, dato, tid og sted", () => {
    renderDialogmoteInnkallingSkjema();
    clickButton("Send innkallingene");

    expect(screen.getAllByText(valideringsTexts.orgMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.dateMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.timeMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.placeMissing)).to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(screen.getByRole("link", { name: valideringsTexts.orgMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.dateMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.timeMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.placeMissing })).to
      .exist;
  });

  it("valideringsmeldinger forsvinner ved utbedring", () => {
    renderDialogmoteInnkallingSkjema();
    clickButton("Send innkallingene");

    expect(screen.getAllByText(valideringsTexts.orgMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.dateMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.timeMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.placeMissing)).to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(screen.getByRole("link", { name: valideringsTexts.orgMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.dateMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.timeMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.placeMissing })).to
      .exist;

    passSkjemaInput();

    // Feilmeldinger og feiloppsummering forsvinner
    expect(screen.queryAllByText(valideringsTexts.orgMissing)).to.be.empty;
    expect(screen.queryAllByText(valideringsTexts.dateMissing)).to.be.empty;
    expect(screen.queryAllByText(valideringsTexts.timeMissing)).to.be.empty;
    expect(screen.queryAllByText(valideringsTexts.placeMissing)).to.be.empty;

    // Tøm felt for sted
    const stedInput = getTextInput("Sted");
    changeTextInput(stedInput, "");

    // Feilmelding vises, feiloppsummering vises ved neste submit
    expect(screen.getAllByText(valideringsTexts.placeMissing)).to.have.length(
      1
    );

    clickButton("Send innkallingene");
    expect(screen.getAllByText(valideringsTexts.placeMissing)).to.have.length(
      2
    );
  });

  it("oppretter innkalling med verdier fra skjema", () => {
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    clickButton("Send innkallingene");

    const innkallingMutation = queryClient.getMutationCache().getAll()[0];
    const expectedInnkallingDto = {
      arbeidsgiver: {
        virksomhetsnummer: arbeidsgiver.orgnr,
        fritekstInnkalling: moteTekster.fritekstTilArbeidsgiver,
        innkalling: expectedInnkallingDocuments.arbeidsgiver(),
      },
      arbeidstaker: {
        personIdent: arbeidstaker.personident,
        fritekstInnkalling: moteTekster.fritekstTilArbeidstaker,
        innkalling: expectedInnkallingDocuments.arbeidstaker(),
      },
      tidSted: {
        sted: mote.sted,
        tid: mote.datoTid,
        videoLink: mote.videolink,
      },
    };

    expect(innkallingMutation.options.variables).to.deep.equal(
      expectedInnkallingDto
    );

    expect(screen.queryByText(/Det er ikke registrert en nærmeste leder/i)).to
      .not.exist;
    expect(screen.queryByLabelText("Nærmeste leder")).to.exist;
    expect(screen.queryByLabelText("Epost")).to.exist;
  });

  it("viser alertstripe hvis valgt arbeidsgiver ikke har registrert nærmeste leder", () => {
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();
    const virksomhetSelect = screen.getByRole("combobox", {
      name: "Arbeidsgiver",
    });
    fireEvent.change(virksomhetSelect, {
      target: { value: VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer },
    });

    expect(screen.queryByText(/Det er ikke registrert en nærmeste leder/i)).to
      .exist;
    expect(screen.queryByLabelText("Nærmeste leder")).to.not.exist;
    expect(screen.queryByLabelText("Epost")).to.not.exist;
  });
});

const renderDialogmoteInnkallingSkjema = () => {
  return render(
    <MemoryRouter initialEntries={[dialogmoteRoutePath]}>
      <Route path={dialogmoteRoutePath}>
        <QueryClientProvider client={queryClient}>
          <ValgtEnhetContext.Provider
            value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
          >
            <Provider store={store({ ...realState, ...mockState })}>
              <DialogmoteInnkallingSkjema pageTitle="Test" />
            </Provider>
          </ValgtEnhetContext.Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};

const passSkjemaInput = () => {
  const virksomhetSelect = screen.getByRole("combobox", {
    name: "Arbeidsgiver",
  });
  const datoInput = getTextInput("Dato");
  const klokkeslettInput = screen.getByLabelText("Klokkeslett");
  const stedInput = getTextInput("Sted");
  const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
  const fritekstArbeidstakerInput = getTextInput(
    "Fritekst til arbeidstakeren (valgfri)"
  );
  const fritekstArbeidsgiverInput = getTextInput(
    "Fritekst til nærmeste leder (valgfri)"
  );

  fireEvent.change(virksomhetSelect, { target: { value: arbeidsgiver.orgnr } });
  changeTextInput(datoInput, mote.dato);
  fireEvent.blur(datoInput);
  changeTextInput(klokkeslettInput, mote.klokkeslett);
  changeTextInput(stedInput, mote.sted);
  changeTextInput(videoLinkInput, mote.videolink);
  changeTextInput(
    fritekstArbeidstakerInput,
    moteTekster.fritekstTilArbeidstaker
  );
  changeTextInput(
    fritekstArbeidsgiverInput,
    moteTekster.fritekstTilArbeidsgiver
  );
};
