import React from "react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  arbeidsgiver,
  arbeidstaker,
  behandlendeEnhet,
  behandler,
  mockStateBehandler,
  mote,
  moteTekster,
  navEnhet,
  veileder,
} from "../testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
  maxLengthErrorMessage,
} from "../../testUtils";
import { MAX_LENGTH_INNKALLING_FRITEKST } from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { behandlereDialogmeldingQueryKeys } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";
import { MemoryRouter, Route } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Provider } from "react-redux";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { stubInnkallingApi } from "../../stubs/stubIsdialogmote";
import { apiMock } from "../../stubs/stubApi";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedInnkallingDocuments } from "../testDataDocuments";

let queryClient;
const store = configureStore([]);
const realState = createStore(rootReducer).getState();

describe("Dialogmoteinnkallingskjema", () => {
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
    queryClient.setQueryData(
      behandlereDialogmeldingQueryKeys.behandleredialogmelding(
        arbeidstaker.personident
      ),
      () => [behandler]
    );
  });

  it("validerer maks lengde på alle fritekstfelter inkl behandler", () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_INNKALLING_FRITEKST);
    const maxLengthErrorMsg = maxLengthErrorMessage(
      MAX_LENGTH_INNKALLING_FRITEKST
    );
    renderDialogmoteInnkallingSkjemaMedFastlegeEnabled();

    const fastlegeInput = screen.getByRole("radio", { name: /Fastlege/ });
    userEvent.click(fastlegeInput);

    const fritekstArbeidstakerInput = getTextInput(
      "Fritekst til arbeidstakeren (valgfri)"
    );
    const fritekstArbeidsgiverInput = getTextInput(
      "Fritekst til nærmeste leder (valgfri)"
    );
    const fritekstBehandlerInput = getTextInput(
      "Fritekst til behandler (valgfri)"
    );
    changeTextInput(
      fritekstArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      fritekstArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );
    changeTextInput(fritekstBehandlerInput, moteTekster.fritekstTilBehandler);
    clickButton("Send innkallingene");

    expect(screen.queryAllByText(maxLengthErrorMsg)).to.have.length(0);

    changeTextInput(fritekstArbeidstakerInput, tooLongFritekst);
    changeTextInput(fritekstArbeidsgiverInput, tooLongFritekst);
    changeTextInput(fritekstBehandlerInput, tooLongFritekst);
    clickButton("Send innkallingene");

    expect(
      screen.queryAllByRole("link", { name: maxLengthErrorMsg })
    ).to.have.length(3);
  });

  it("submit creates innkalling with behandler when behandler is selected", () => {
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjemaMedFastlegeEnabled();
    passSkjemaInput();

    clickButton("Send innkallingene");

    const innkallingMutation = queryClient.getMutationCache().getAll()[0];
    const expectedInnkallingDto = {
      tildeltEnhet: navEnhet,
      arbeidsgiver: {
        virksomhetsnummer: arbeidsgiver.orgnr,
        fritekstInnkalling: moteTekster.fritekstTilArbeidsgiver,
        innkalling: expectedInnkallingDocuments.arbeidsgiver,
      },
      arbeidstaker: {
        personIdent: arbeidstaker.personident,
        fritekstInnkalling: moteTekster.fritekstTilArbeidstaker,
        innkalling: expectedInnkallingDocuments.arbeidstaker,
      },
      behandler: {
        personIdent: behandler.fnr,
        behandlerRef: behandler.behandlerRef,
        behandlerNavn: behandlerNavn(behandler),
        behandlerKontor: behandler.kontor,
        fritekstInnkalling: moteTekster.fritekstTilBehandler,
        innkalling: expectedInnkallingDocuments.behandler,
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
  });

  it("doesn't display behandler fritekst and preview when none is selected", () => {
    renderDialogmoteInnkallingSkjemaMedFastlegeEnabled();

    expect(
      screen.queryByRole("textbox", {
        name: /Fritekst til behandler/,
      })
    ).to.not.exist;
    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
  });
});

const renderDialogmoteInnkallingSkjemaMedFastlegeEnabled = () => {
  return render(
    <MemoryRouter initialEntries={[dialogmoteRoutePath]}>
      <Route path={dialogmoteRoutePath}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockStateBehandler })}>
            <DialogmoteInnkallingSkjema pageTitle="Test" />
          </Provider>
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
  const fastlegeInput = screen.getByRole("radio", { name: /Fastlege/ });
  userEvent.click(fastlegeInput);
  const fritekstArbeidstakerInput = getTextInput(
    "Fritekst til arbeidstakeren (valgfri)"
  );
  const fritekstArbeidsgiverInput = getTextInput(
    "Fritekst til nærmeste leder (valgfri)"
  );
  const fritekstBehandlerInput = getTextInput(
    "Fritekst til behandler (valgfri)"
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
  changeTextInput(fritekstBehandlerInput, moteTekster.fritekstTilBehandler);
};
