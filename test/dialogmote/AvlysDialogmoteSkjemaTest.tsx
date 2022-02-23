import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { expect } from "chai";
import AvlysDialogmoteSkjema, {
  MAX_LENGTH_AVLYS_BEGRUNNELSE,
  texts as avlysningSkjemaTexts,
} from "../../src/components/dialogmote/avlys/AvlysDialogmoteSkjema";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import {
  changeTextInput,
  clickButton,
  getFeilmeldingLink,
  getTextInput,
  getTooLongText,
  maxLengthErrorMessage,
} from "../testUtils";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubAvlysApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import {
  arbeidstaker,
  behandlendeEnhet,
  dialogmote,
  dialogmoteMedBehandler,
  mockState,
  moteTekster,
  veileder,
} from "./testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedAvlysningDocuments } from "./testDataDocuments";
import sinon from "sinon";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);

let queryClient;

describe("AvlysDialogmoteSkjemaTest", () => {
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

  it("viser møtetidspunkt", () => {
    renderAvlysDialogmoteSkjema(dialogmote);

    expect(screen.getByText("Gjelder dialogmøtet")).to.exist;
    expect(screen.getByText("Mandag 10. mai 2021 kl. 09.00")).to.exist;
  });
  it("validerer begrunnelser", () => {
    renderAvlysDialogmoteSkjema(dialogmote);
    clickButton("Send avlysning");

    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;
  });
  it("validerer begrunnelse til behandler når behandler er med", () => {
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);
    clickButton("Send avlysning");

    expect(screen.getAllByText(valideringsTexts.begrunnelseBehandlerMissing)).to
      .not.be.empty;

    // Feilmelding i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseBehandlerMissing)).to
      .exist;
  });
  it("valideringsmeldinger forsvinner ved utbedring", () => {
    renderAvlysDialogmoteSkjema(dialogmote);
    clickButton("Send avlysning");
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;

    // Angi begrunnelser
    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );

    // Feilmeldinger og feiloppsummering forsvinner
    expect(
      screen.queryAllByText(valideringsTexts.begrunnelseArbeidstakerMissing)
    ).to.be.empty;
    expect(
      screen.queryAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing)
    ).to.be.empty;

    // Fjern begrunnelser
    changeTextInput(begrunnelseArbeidstakerInput, "");
    changeTextInput(begrunnelseArbeidsgiverInput, "");

    // Feilmeldinger vises, feiloppsummering vises ved neste submit
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.exist;

    clickButton("Send avlysning");
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
  });
  it("validerer maks lengde på begrunnelser", () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_AVLYS_BEGRUNNELSE);
    const maxLengthErrorMsg = maxLengthErrorMessage(
      MAX_LENGTH_AVLYS_BEGRUNNELSE
    );
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(begrunnelseArbeidstakerInput, tooLongFritekst);
    changeTextInput(begrunnelseArbeidsgiverInput, tooLongFritekst);
    changeTextInput(begrunnelseBehandlerInput, tooLongFritekst);

    clickButton("Send avlysning");

    expect(
      screen.getAllByRole("link", { name: maxLengthErrorMsg })
    ).to.have.length(3, "Validerer maks lengde på alle begrunnelser");
  });
  it("avlyser møte ved submit", () => {
    stubAvlysApi(apiMock(), dialogmote.uuid);
    renderAvlysDialogmoteSkjema(dialogmote);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );

    clickButton("Send avlysning");

    const avlysMutation = queryClient.getMutationCache().getAll()[0];
    const expectedAvlysningDto = {
      arbeidsgiver: {
        avlysning: expectedAvlysningDocuments.arbeidsgiver(),
        begrunnelse: moteTekster.fritekstTilArbeidsgiver,
      },
      arbeidstaker: {
        avlysning: expectedAvlysningDocuments.arbeidstaker(),
        begrunnelse: moteTekster.fritekstTilArbeidstaker,
      },
    };
    expect(avlysMutation.options.variables).to.deep.equal(expectedAvlysningDto);
  });
  it("avlyser med behandler ved submit når behandler er med", () => {
    stubAvlysApi(apiMock(), dialogmote.uuid);
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );
    changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler
    );

    clickButton("Send avlysning");

    const avlysMutation = queryClient.getMutationCache().getAll()[0];
    const expectedAvlysningDto = {
      arbeidsgiver: {
        avlysning: expectedAvlysningDocuments.arbeidsgiver(),
        begrunnelse: moteTekster.fritekstTilArbeidsgiver,
      },
      arbeidstaker: {
        avlysning: expectedAvlysningDocuments.arbeidstaker(),
        begrunnelse: moteTekster.fritekstTilArbeidstaker,
      },
      behandler: {
        avlysning: expectedAvlysningDocuments.behandler(),
        begrunnelse: moteTekster.fritekstTilBehandler,
      },
    };
    expect(avlysMutation.options.variables).to.deep.equal(expectedAvlysningDto);
  });
  it("forhåndsviser avlysning til arbeidstaker", () => {
    renderAvlysDialogmoteSkjema(dialogmote);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[0]);

    const forhandsvisningAvlysningArbeidstaker = screen.getByRole("dialog", {
      name: avlysningSkjemaTexts.forhandsvisningArbeidstakerContentlabel,
    });
    expect(
      within(forhandsvisningAvlysningArbeidstaker).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningArbeidstakerTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningAvlysningArbeidstaker).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedAvlysningDocuments
      .arbeidstaker()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningAvlysningArbeidstaker).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser avlysning til arbeidsgiver", () => {
    renderAvlysDialogmoteSkjema(dialogmote);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[1]);

    const forhandsvisningAvlysningArbeidsgiver = screen.getByRole("dialog", {
      name: avlysningSkjemaTexts.forhandsvisningArbeidsgiverContentlabel,
    });
    expect(
      within(forhandsvisningAvlysningArbeidsgiver).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningArbeidsgiverTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningAvlysningArbeidsgiver).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedAvlysningDocuments
      .arbeidsgiver()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningAvlysningArbeidsgiver).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser avlysning til behandler når behandler er med", () => {
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );
    changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler
    );

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(3);
    userEvent.click(previewButtons[2]);

    const forhandsvisningAvlysningBehandler = screen.getByRole("dialog", {
      name: avlysningSkjemaTexts.forhandsvisningBehandlerContentlabel,
    });
    expect(
      within(forhandsvisningAvlysningBehandler).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningBehandlerTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningAvlysningBehandler).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedAvlysningDocuments
      .behandler()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningAvlysningBehandler).getByText(text)).to
          .exist;
      });
  });
});

const renderAvlysDialogmoteSkjema = (dialogmote: DialogmoteDTO) => {
  return render(
    <MemoryRouter initialEntries={[`${dialogmoteRoutePath}/123abc/avlys`]}>
      <Route path={`${dialogmoteRoutePath}/:dialogmoteUuid/avlys`}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <AvlysDialogmoteSkjema dialogmote={dialogmote} pageTitle="test" />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};
