import { MemoryRouter, Route } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import React from "react";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import EndreDialogmoteSkjema from "@/components/dialogmote/endre/EndreDialogmoteSkjema";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  changeTextInput,
  clickButton,
  getFeilmeldingLink,
  getTextInput,
  getTooLongText,
  maxLengthErrorMessage,
} from "../testUtils";
import { expect } from "chai";
import { texts as skjemaFeilOppsummeringTexts } from "@/components/SkjemaFeiloppsummering";
import { apiMock } from "../stubs/stubApi";
import { stubEndreApi } from "../stubs/stubIsdialogmote";
import { texts as endringSkjemaTexts } from "../../src/components/dialogmote/endre/EndreDialogmoteTekster";
import {
  arbeidstaker,
  behandlendeEnhet,
  dialogmote,
  dialogmoteMedBehandler,
  endretMote,
  mockState,
  moteTekster,
  veileder,
} from "./testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MAX_LENGTH_AVLYS_BEGRUNNELSE } from "@/components/dialogmote/avlys/AvlysDialogmoteSkjema";
import { expectedEndringDocuments } from "./testDataDocuments";
import sinon from "sinon";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { LEDERE_DEFAULT } from "../../mock/common/mockConstants";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);

let queryClient;

describe("EndreDialogmoteSkjemaTest", () => {
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
    queryClient.setQueryData(
      ledereQueryKeys.ledere(arbeidstaker.personident),
      () => LEDERE_DEFAULT
    );

    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("validerer begrunnelser og dato", () => {
    renderEndreDialogmoteSkjema(dialogmote);

    clickButton("Lagre endringer");

    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(/Datoen må være etter/)).to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;
    expect(
      screen.getByRole("link", {
        name: /Datoen må være etter/,
      })
    ).to.exist;
  });
  it("validerer begrunnelse til behandler når behandler er med", () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);

    clickButton("Lagre endringer");

    expect(screen.getAllByText(valideringsTexts.begrunnelseBehandlerMissing));
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseBehandlerMissing)).to
      .exist;
  });
  it("valideringsmeldinger forsvinner ved utbedring", () => {
    renderEndreDialogmoteSkjema(dialogmote);

    clickButton("Lagre endringer");

    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(/Datoen må være etter/)).to.not.be.empty;
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;
    expect(
      screen.getByRole("link", {
        name: /Datoen må være etter/,
      })
    ).to.exist;

    // Angi dato og begrunnelser
    const datoInput = getTextInput("Dato");
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
    changeTextInput(datoInput, endretMote.dato);
    fireEvent.blur(datoInput);

    // Feilmeldinger og feiloppsummering forsvinner
    expect(
      screen.queryAllByText(valideringsTexts.begrunnelseArbeidstakerMissing)
    ).to.be.empty;
    expect(
      screen.queryAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing)
    ).to.be.empty;
    expect(screen.queryAllByText(/Datoen må være etter/)).to.be.empty;

    // Fjern begrunnelser
    changeTextInput(begrunnelseArbeidstakerInput, "");
    changeTextInput(begrunnelseArbeidsgiverInput, "");

    // Feilmeldinger vises, feiloppsummering vises ved neste submit
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.exist;

    clickButton("Lagre endringer");
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;
  });
  it("validerer maks lengde på begrunnelser", () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_AVLYS_BEGRUNNELSE);
    const maxLengthErrorMsg = maxLengthErrorMessage(
      MAX_LENGTH_AVLYS_BEGRUNNELSE
    );
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);

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

    clickButton("Lagre endringer");

    expect(
      screen.getAllByRole("link", { name: maxLengthErrorMsg })
    ).to.have.length(3, "Validerer maks lengde på alle begrunnelser");
  });

  it("endrer møte ved submit", () => {
    stubEndreApi(apiMock(), dialogmote.uuid);
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    clickButton("Lagre endringer");

    const endreMutation = queryClient.getMutationCache().getAll()[0];
    const expectedEndring = {
      arbeidsgiver: {
        begrunnelse: moteTekster.fritekstTilArbeidsgiver,
        endringsdokument: expectedEndringDocuments.arbeidsgiver(),
      },
      arbeidstaker: {
        begrunnelse: moteTekster.fritekstTilArbeidstaker,
        endringsdokument: expectedEndringDocuments.arbeidstaker(),
      },
      videoLink: endretMote.videolink,
      sted: endretMote.sted,
      tid: endretMote.datoTid,
    };
    expect(endreMutation.options.variables).to.deep.equal(expectedEndring);
  });

  it("endrer møte med behandler ved submit når behandler er med", () => {
    stubEndreApi(apiMock(), dialogmote.uuid);
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    passSkjemaInput();
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler
    );

    clickButton("Lagre endringer");

    const endreMutation = queryClient.getMutationCache().getAll()[0];
    const expectedEndring = {
      arbeidsgiver: {
        begrunnelse: moteTekster.fritekstTilArbeidsgiver,
        endringsdokument: expectedEndringDocuments.arbeidsgiver(true),
      },
      arbeidstaker: {
        begrunnelse: moteTekster.fritekstTilArbeidstaker,
        endringsdokument: expectedEndringDocuments.arbeidstaker(true),
      },
      behandler: {
        begrunnelse: moteTekster.fritekstTilBehandler,
        endringsdokument: expectedEndringDocuments.behandler(),
      },
      videoLink: endretMote.videolink,
      sted: endretMote.sted,
      tid: endretMote.datoTid,
    };
    expect(endreMutation.options.variables).to.deep.equal(expectedEndring);
  });
  it("forhåndsviser endret tid og sted til arbeidstaker", () => {
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[0]);

    const forhandsvisningEndringArbeidstaker = screen.getByRole("dialog", {
      name: endringSkjemaTexts.forhandsvisningArbeidstakerContentLabel,
    });

    expect(
      within(forhandsvisningEndringArbeidstaker).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningArbeidstakerTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningEndringArbeidstaker).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedEndringDocuments
      .arbeidstaker()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringArbeidstaker).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser endret tid og sted til arbeidsgiver", () => {
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[1]);

    const forhandsvisningEndringArbeidsgiver = screen.getByRole("dialog", {
      name: endringSkjemaTexts.forhandsvisningArbeidsgiverContentLabel,
    });

    expect(
      within(forhandsvisningEndringArbeidsgiver).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningArbeidsgiverTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningEndringArbeidsgiver).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedEndringDocuments
      .arbeidsgiver()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringArbeidsgiver).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser endret tid og sted til behandler når behandler er med", () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    passSkjemaInput();
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler
    );

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(3);
    userEvent.click(previewButtons[2]);

    const forhandsvisningEndringBehandler = screen.getByRole("dialog", {
      name: endringSkjemaTexts.forhandsvisningBehandlerContentLabel,
    });

    expect(
      within(forhandsvisningEndringBehandler).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningBehandlerTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningEndringBehandler).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedEndringDocuments
      .behandler()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringBehandler).getByText(text)).to
          .exist;
      });
  });
});

const renderEndreDialogmoteSkjema = (dialogmote: DialogmoteDTO) => {
  return render(
    <MemoryRouter
      initialEntries={[`${dialogmoteRoutePath}/${dialogmote.uuid}/endre`]}
    >
      <Route path={`${dialogmoteRoutePath}/:dialogmoteUuid/endre`}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <EndreDialogmoteSkjema dialogmote={dialogmote} pageTitle="test" />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};

const passSkjemaInput = () => {
  const datoInput = getTextInput("Dato");
  const klokkeslettInput = screen.getByLabelText("Klokkeslett");
  const stedInput = getTextInput("Sted");
  const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
  const begrunnelseArbeidstakerInput = getTextInput(
    "Begrunnelse til arbeidstakeren"
  );
  const begrunnelseArbeidsgiverInput = getTextInput(
    "Begrunnelse til nærmeste leder"
  );
  changeTextInput(datoInput, endretMote.dato);
  fireEvent.blur(datoInput);
  changeTextInput(klokkeslettInput, endretMote.klokkeslett);
  changeTextInput(stedInput, endretMote.sted);
  changeTextInput(videoLinkInput, endretMote.videolink);
  changeTextInput(
    begrunnelseArbeidstakerInput,
    moteTekster.fritekstTilArbeidstaker
  );
  changeTextInput(
    begrunnelseArbeidsgiverInput,
    moteTekster.fritekstTilArbeidsgiver
  );
};
