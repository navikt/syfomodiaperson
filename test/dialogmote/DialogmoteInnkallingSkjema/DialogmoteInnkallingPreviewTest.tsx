import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { QueryClientProvider } from "react-query";
import {
  arbeidsgiver,
  arbeidstaker,
  behandler,
  mockState,
  mote,
  moteTekster,
  navEnhet,
} from "../testData";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect } from "chai";
import userEvent from "@testing-library/user-event";
import { texts as innkallingSkjemaTexts } from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { MemoryRouter, Route } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Provider } from "react-redux";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import React from "react";
import { behandlereDialogmeldingQueryKeys } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";
import { changeTextInput, getTextInput } from "../../testUtils";
import { expectedInnkallingDocuments } from "../testDataDocuments";
import sinon from "sinon";
import { queryClientWithMockData } from "../../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";

let queryClient;
const store = configureStore([]);
const realState = createStore(rootReducer).getState();

describe("Dialogmoteinnkallingskjema", () => {
  let clock;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("previews innkalling to arbeidstaker", () => {
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[0]);
    const forhandsvisningInnkallingArbeidstaker = screen.getByRole("dialog", {
      name: innkallingSkjemaTexts.forhandsvisningArbeidstakerContentLabel,
    });

    expect(
      within(forhandsvisningInnkallingArbeidstaker).getByRole("heading", {
        name: innkallingSkjemaTexts.forhandsvisningArbeidstakerTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningInnkallingArbeidstaker).getByRole("heading", {
        name: innkallingSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedInnkallingDocuments
      .arbeidstaker()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningInnkallingArbeidstaker).getByText(text)).to
          .exist;
      });
  });

  it("previews innkalling to arbeidsgiver", () => {
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[1]);
    const forhandsvisningInnkallingArbeidsgiver = screen.getByRole("dialog", {
      name: innkallingSkjemaTexts.forhandsvisningArbeidsgiverContentLabel,
    });

    expect(
      within(forhandsvisningInnkallingArbeidsgiver).getByRole("heading", {
        name: innkallingSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningInnkallingArbeidsgiver).getByRole("heading", {
        name: innkallingSkjemaTexts.forhandsvisningArbeidsgiverTitle,
      })
    ).to.exist;
    expectedInnkallingDocuments
      .arbeidsgiver()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningInnkallingArbeidsgiver).getByText(text)).to
          .exist;
      });
  });

  it("previews innkalling to behandler", () => {
    queryClient.setQueryData(
      behandlereDialogmeldingQueryKeys.behandleredialogmelding(
        arbeidstaker.personident
      ),
      () => [behandler]
    );
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    const fastlegeInput = screen.getByRole("radio", { name: /Fastlege/ });
    userEvent.click(fastlegeInput);
    const fritekstBehandlerInput = getTextInput(
      "Fritekst til behandler (valgfri)"
    );
    changeTextInput(fritekstBehandlerInput, moteTekster.fritekstTilBehandler);

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(3);
    userEvent.click(previewButtons[2]);
    const forhandsvisningInnkallingBehandler = screen.getByRole("dialog", {
      name: innkallingSkjemaTexts.forhandsvisningBehandlerContentLabel,
    });

    expect(
      within(forhandsvisningInnkallingBehandler).getByRole("heading", {
        name: innkallingSkjemaTexts.forhandsvisningBehandlerTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningInnkallingBehandler).getByRole("heading", {
        name: innkallingSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedInnkallingDocuments
      .behandler()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningInnkallingBehandler).getByText(text)).to
          .exist;
      });
  });
});

const renderDialogmoteInnkallingSkjema = () =>
  render(
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
