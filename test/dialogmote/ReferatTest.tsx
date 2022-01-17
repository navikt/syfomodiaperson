import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import Referat, {
  texts as referatSkjemaTexts,
  valideringsTexts as referatSkjemaValideringsTexts,
} from "../../src/components/dialogmote/referat/Referat";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { expect } from "chai";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "../../src/utils/valideringUtils";
import {
  changeTextInput,
  clickButton,
  getFeilmeldingLink,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubFerdigstillApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  arbeidstaker,
  behandlendeEnhet,
  behandlerDeltakerTekst,
  dialogmote,
  dialogmoteMedBehandler,
  lederNavn,
  moteTekster,
  veileder,
} from "./testData";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { MAX_LENGTH_SITUASJON } from "@/components/dialogmote/referat/Situasjon";
import { MAX_LENGTH_KONKLUSJON } from "@/components/dialogmote/referat/Konklusjon";
import { MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE } from "@/components/dialogmote/referat/ArbeidstakersOppgave";
import { MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE } from "@/components/dialogmote/referat/ArbeidsgiversOppgave";
import { MAX_LENGTH_VEILEDERS_OPPGAVE } from "@/components/dialogmote/referat/VeiledersOppgave";
import { MAX_LENGTH_BEHANDLERS_OPPGAVE } from "@/components/dialogmote/referat/BehandlersOppgave";
import { VIRKSOMHET_PONTYPANDY } from "../../mock/common/mockConstants";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedReferatDocument } from "./testDataDocuments";

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

describe("ReferatTest", () => {
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
  });

  it("viser arbeidstaker, dato og sted i tittel", () => {
    renderReferat(dialogmote);

    expect(
      screen.getByRole("heading", {
        name: `${arbeidstaker.navn}, 10. mai 2021, Videomøte`,
      })
    ).to.exist;
  });

  it("viser alle deltakere forhåndsutfylt med nærmeste leder redigerbar og påkrevd", () => {
    renderReferat(dialogmote);

    const deltakerList = screen.getByRole("list");
    expect(within(deltakerList).getByText(`Fra NAV: ${veileder.navn}`)).to
      .exist;
    expect(within(deltakerList).getByText(`Arbeidstaker: ${arbeidstaker.navn}`))
      .to.exist;

    const getNaermesteLederInput = () => getTextInput("Nærmeste leder");

    // Sjekk nærmeste leder preutfylt
    expect(getNaermesteLederInput().getAttribute("value")).to.equal(lederNavn);

    // Sjekk at nærmeste leder valideres
    changeTextInput(getNaermesteLederInput(), "");
    clickButton("Lagre og send");
    expect(screen.getAllByText(valideringsTexts.naermesteLederMissing)).to.not
      .be.empty;

    // Sjekk at nærmeste leder kan endres
    const endretNaermesteLeder = "Ny Leder";
    changeTextInput(getNaermesteLederInput(), endretNaermesteLeder);
    expect(getNaermesteLederInput().getAttribute("value")).to.equal(
      endretNaermesteLeder
    );
  });

  it("viser behandler som deltaker når behandler er med", () => {
    renderReferat(dialogmoteMedBehandler);

    const deltakerList = screen.getByRole("list");
    expect(within(deltakerList).getByText(behandlerDeltakerTekst)).to.exist;
  });

  it("validerer alle fritekstfelter unntatt veileders oppgave", () => {
    renderReferat(dialogmote);

    clickButton("Lagre og send");

    expect(screen.getAllByText(referatSkjemaValideringsTexts.situasjonMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(referatSkjemaValideringsTexts.konklusjonMissing))
      .to.not.be.empty;
    expect(
      screen.getAllByText(
        referatSkjemaValideringsTexts.arbeidstakersOppgaveMissing
      )
    ).to.not.be.empty;
    expect(
      screen.getAllByText(
        referatSkjemaValideringsTexts.arbeidsgiversOppgaveMissing
      )
    ).to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(referatSkjemaValideringsTexts.situasjonMissing))
      .to.exist;
    expect(getFeilmeldingLink(referatSkjemaValideringsTexts.konklusjonMissing))
      .to.exist;
    expect(
      getFeilmeldingLink(
        referatSkjemaValideringsTexts.arbeidstakersOppgaveMissing
      )
    ).to.exist;
    expect(
      getFeilmeldingLink(
        referatSkjemaValideringsTexts.arbeidsgiversOppgaveMissing
      )
    ).to.exist;
  });

  it("validerer navn og funksjon på andre deltakere", () => {
    renderReferat(dialogmote);

    const addDeltakerButton = screen.getByRole("button", {
      name: "Pluss ikon Legg til en deltaker",
    });
    userEvent.click(addDeltakerButton);
    clickButton("Lagre og send");

    // Feilmeldinger i skjema
    expect(screen.getAllByText(valideringsTexts.andreDeltakereMissingNavn)).to
      .not.be.empty;
    expect(screen.getAllByText(valideringsTexts.andreDeltakereMissingFunksjon))
      .to.not.be.empty;

    // Feilmelding i oppsummering
    expect(getFeilmeldingLink(valideringsTexts.andreDeltakereMissingNavn)).to
      .exist;
    expect(getFeilmeldingLink(valideringsTexts.andreDeltakereMissingFunksjon))
      .to.exist;

    // Slett deltaker og sjekk at feil forsvinner
    const fjernDeltakerButton = screen.getByRole("button", {
      name: "Slett ikon",
    });
    userEvent.click(fjernDeltakerButton);
    expect(screen.queryAllByText(valideringsTexts.andreDeltakereMissingNavn)).to
      .be.empty;
    expect(
      screen.queryAllByText(valideringsTexts.andreDeltakereMissingFunksjon)
    ).to.be.empty;
  });

  it("validerer maks lengde på fritekstfelter", () => {
    renderReferat(dialogmoteMedBehandler);

    const situasjonInput = getTextInput("Situasjon og muligheter");
    const konklusjonInput = getTextInput("Konklusjon");
    const arbeidstakerInput = getTextInput("Arbeidstakerens oppgave:");
    const arbeidsgiverInput = getTextInput("Arbeidsgiverens oppgave:");
    const behandlerInput = getTextInput("Behandlerens oppgave (valgfri):");
    const veilederInput = getTextInput("Veilederens oppgave (valgfri):");
    changeTextInput(situasjonInput, getTooLongText(MAX_LENGTH_SITUASJON));
    changeTextInput(konklusjonInput, getTooLongText(MAX_LENGTH_KONKLUSJON));
    changeTextInput(
      arbeidstakerInput,
      getTooLongText(MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE)
    );
    changeTextInput(
      arbeidsgiverInput,
      getTooLongText(MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE)
    );
    changeTextInput(
      behandlerInput,
      getTooLongText(MAX_LENGTH_BEHANDLERS_OPPGAVE)
    );
    changeTextInput(
      veilederInput,
      getTooLongText(MAX_LENGTH_VEILEDERS_OPPGAVE)
    );

    clickButton("Lagre og send");

    expect(
      screen.getAllByRole("link", { name: /tegn tillatt/ })
    ).to.have.length(6, "Validerer maks lengde på alle fritekstfelter");
  });

  it("ferdigstiller dialogmote ved submit av skjema", () => {
    stubFerdigstillApi(apiMock(), dialogmoteMedBehandler.uuid);
    renderReferat(dialogmoteMedBehandler);

    passSkjemaTekstInput();

    const addDeltakerButton = screen.getByRole("button", {
      name: "Pluss ikon Legg til en deltaker",
    });
    userEvent.click(addDeltakerButton);
    const annenDeltakerNavnInput = getTextInput("Navn");
    const annenDeltakerFunksjonInput = getTextInput("Funksjon");
    changeTextInput(annenDeltakerNavnInput, annenDeltakerNavn);
    changeTextInput(annenDeltakerFunksjonInput, annenDeltakerFunksjon);

    clickButton("Lagre og send");

    const ferdigstillMutation = queryClient.getMutationCache().getAll()[0];
    const expectedFerdigstilling = {
      narmesteLederNavn: lederNavn,
      situasjon: moteTekster.situasjonTekst,
      konklusjon: moteTekster.konklusjonTekst,
      arbeidsgiverOppgave: moteTekster.arbeidsgiversOppgave,
      arbeidstakerOppgave: moteTekster.arbeidstakersOppgave,
      behandlerOppgave: moteTekster.behandlersOppgave,
      veilederOppgave: moteTekster.veiledersOppgave,
      document: expectedReferatDocument,
      andreDeltakere: [
        { funksjon: annenDeltakerFunksjon, navn: annenDeltakerNavn },
      ],
    };
    expect(ferdigstillMutation.options.variables).to.deep.equal(
      expectedFerdigstilling
    );
  });

  it("forhåndsviser referat", () => {
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();

    const addDeltakerButton = screen.getByRole("button", {
      name: "Pluss ikon Legg til en deltaker",
    });
    userEvent.click(addDeltakerButton);
    const annenDeltakerNavnInput = getTextInput("Navn");
    const annenDeltakerFunksjonInput = getTextInput("Funksjon");
    changeTextInput(annenDeltakerNavnInput, annenDeltakerNavn);
    changeTextInput(annenDeltakerFunksjonInput, annenDeltakerFunksjon);

    const previewButton = screen.getByRole("button", {
      name: "Se forhåndsvisning",
    });
    userEvent.click(previewButton);
    const forhandsvisningReferat = screen.getByRole("dialog", {
      name: referatSkjemaTexts.forhandsvisningContentLabel,
    });

    expect(
      within(forhandsvisningReferat).getByRole("heading", {
        name: referatSkjemaTexts.forhandsvisningTitle,
      })
    ).to.exist;
    expectedReferatDocument
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningReferat).getByText(text)).to.exist;
      });
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
  changeTextInput(situasjonInput, moteTekster.situasjonTekst);
  changeTextInput(konklusjonInput, moteTekster.konklusjonTekst);
  changeTextInput(arbeidstakerInput, moteTekster.arbeidstakersOppgave);
  changeTextInput(arbeidsgiverInput, moteTekster.arbeidsgiversOppgave);
  changeTextInput(behandlerInput, moteTekster.behandlersOppgave);
  changeTextInput(veilederInput, moteTekster.veiledersOppgave);
};
