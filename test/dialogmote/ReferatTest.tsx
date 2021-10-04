import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import Referat, {
  texts as referatSkjemaTexts,
} from "../../src/components/dialogmote/referat/Referat";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { Feilmelding, Innholdstittel } from "nav-frontend-typografi";
import { expect } from "chai";
import { Feiloppsummering } from "nav-frontend-skjema";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "../../src/utils/valideringUtils";
import {
  assertFeilmelding,
  changeFieldValue,
  changeTextAreaValue,
} from "../testUtils";
import { commonTexts, referatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { tilDatoMedUkedagOgManedNavn } from "@/utils/datoUtils";
import { Forhandsvisning } from "@/components/dialogmote/Forhandsvisning";
import { Knapp } from "nav-frontend-knapper";
import Lukknapp from "nav-frontend-lukknapp";
import { AndreDeltakere } from "@/components/dialogmote/referat/AndreDeltakere";
import { SlettKnapp } from "@/components/SlettKnapp";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubFerdigstillApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import { arbeidstaker, dialogmote, navEnhet, veileder } from "./testData";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const lederNavn = "Grønn Bamse";
const annenDeltakerFunksjon = "Verneombud";
const annenDeltakerNavn = "Bodil Bolle";

const mockState = {
  behandlendeEnhet: {
    data: {
      enhetId: navEnhet.id,
      navn: navEnhet.navn,
    },
  },
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
        virksomhetsnummer: "912345678",
      },
      {
        narmesteLederNavn: "Annen Leder",
        status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        virksomhetsnummer: "89829812",
      },
    ],
  },
};

const situasjonTekst = "Noe tekst om situasjonen";
const konklusjonTekst = "Noe tekst om konklusjon";
const arbeidsgiversOppgave = "Noe tekst om arbeidsgivers oppgave";
const arbeidstakersOppgave = "Noe tekst om arbeidstakers oppgave";
const veiledersOppgave = "Noe tekst om veileders oppgave";

const queryClient = new QueryClient();
queryClient.setQueryData(veilederinfoQueryKeys.veilederinfo, () => veileder);

describe("ReferatTest", () => {
  it("viser arbeidstaker, dato og sted i tittel", () => {
    const wrapper = mountReferat();

    expect(wrapper.find(Innholdstittel).text()).to.equal(
      `${arbeidstaker.navn}, 10. mai 2021, Videomøte`
    );
  });

  it("viser alle deltakere forhåndsutfylt med nærmeste leder redigerbar og påkrevd", () => {
    const wrapper = mountReferat();

    expect(
      wrapper
        .find("li")
        .findWhere((li) => li.text() === `Fra NAV: ${veileder.navn}`)
    ).to.exist;
    expect(
      wrapper
        .find("li")
        .findWhere((li) => li.text() === `Arbeidstaker: ${arbeidstaker.navn}`)
    ).to.exist;

    const getNaermesteLederInput = () =>
      wrapper
        .find("input")
        .findWhere((input) => input.prop("name") === "naermesteLeder");

    // Sjekk nærmeste leder preutfylt
    let naermesteLederInput = getNaermesteLederInput();
    expect(naermesteLederInput.prop("value")).to.equal(lederNavn);

    // Sjekk at nærmeste leder valideres
    changeFieldValue(naermesteLederInput, "");
    wrapper.find("form").simulate("submit");
    assertFeilmelding(
      wrapper.find(Feilmelding),
      valideringsTexts.naermesteLederMissing
    );

    // Sjekk at nærmeste leder kan endres
    const endretNaermesteLeder = "Ny Leder";
    changeFieldValue(naermesteLederInput, endretNaermesteLeder);
    naermesteLederInput = getNaermesteLederInput();
    expect(naermesteLederInput.prop("value")).to.equal(endretNaermesteLeder);
  });

  it("validerer alle fritekstfelter unntatt veileders oppgave", () => {
    const wrapper = mountReferat();

    wrapper.find("form").simulate("submit");

    // Feilmeldinger i skjema
    const feil = wrapper.find(Feilmelding);
    assertFeilmelding(feil, valideringsTexts.situasjonMissing);
    assertFeilmelding(feil, valideringsTexts.konklusjonMissing);
    assertFeilmelding(feil, valideringsTexts.arbeidstakersOppgaveMissing);
    assertFeilmelding(feil, valideringsTexts.arbeidsgiversOppgaveMissing);

    // Feilmelding i oppsummering
    const feiloppsummering = wrapper.find(Feiloppsummering);
    expect(feiloppsummering.text()).to.contain(
      skjemaFeilOppsummeringTexts.title
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.situasjonMissing
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.konklusjonMissing
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.arbeidstakersOppgaveMissing
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.arbeidsgiversOppgaveMissing
    );
  });

  it("validerer navn og funksjon på andre deltakere", () => {
    const wrapper = mountReferat();

    const addDeltakerButton = wrapper.find(Knapp).at(0);
    addDeltakerButton.simulate("click");

    wrapper.find("form").simulate("submit");

    // Feilmeldinger i skjema
    const feil = () => wrapper.find(Feilmelding);
    assertFeilmelding(feil(), valideringsTexts.andreDeltakereMissingNavn);
    assertFeilmelding(feil(), valideringsTexts.andreDeltakereMissingFunksjon);

    // Feilmelding i oppsummering
    const feiloppsummering = () => wrapper.find(Feiloppsummering);
    expect(feiloppsummering().text()).to.contain(
      skjemaFeilOppsummeringTexts.title
    );
    expect(feiloppsummering().text()).to.contain(
      valideringsTexts.andreDeltakereMissingNavn
    );
    expect(feiloppsummering().text()).to.contain(
      valideringsTexts.andreDeltakereMissingFunksjon
    );

    // Slett deltaker og sjekk at feil forsvinner
    wrapper.find(SlettKnapp).simulate("click");
    expect(feiloppsummering().text()).not.to.contain(
      valideringsTexts.andreDeltakereMissingNavn
    );
    expect(feiloppsummering().text()).not.to.contain(
      valideringsTexts.andreDeltakereMissingFunksjon
    );
  });

  it("ferdigstiller dialogmote ved submit av skjema", () => {
    stubFerdigstillApi(apiMock(), dialogmote.uuid);
    const wrapper = mountReferat();

    changeTextAreaValue(wrapper, "situasjon", situasjonTekst);
    changeTextAreaValue(wrapper, "konklusjon", konklusjonTekst);
    changeTextAreaValue(wrapper, "arbeidstakersOppgave", arbeidstakersOppgave);
    changeTextAreaValue(wrapper, "arbeidsgiversOppgave", arbeidsgiversOppgave);
    changeTextAreaValue(wrapper, "veiledersOppgave", veiledersOppgave);

    const addDeltakerButton = wrapper.find(Knapp).at(0);
    addDeltakerButton.simulate("click");
    const deltakerInput = wrapper.find(AndreDeltakere).find("input");
    changeFieldValue(deltakerInput.at(0), annenDeltakerFunksjon);
    changeFieldValue(deltakerInput.at(1), annenDeltakerNavn);

    wrapper.find("form").simulate("submit");

    const ferdigstillMutation = queryClient.getMutationCache().getAll()[0];
    const expectedFerdigstilling = {
      narmesteLederNavn: lederNavn,
      situasjon: situasjonTekst,
      konklusjon: konklusjonTekst,
      arbeidsgiverOppgave: arbeidsgiversOppgave,
      arbeidstakerOppgave: arbeidstakersOppgave,
      veilederOppgave: veiledersOppgave,
      document: expectedReferat,
      andreDeltakere: [
        { funksjon: annenDeltakerFunksjon, navn: annenDeltakerNavn },
      ],
    };
    expect(ferdigstillMutation.options.variables).to.deep.equal(
      expectedFerdigstilling
    );
  });

  it("forhåndsviser referat", () => {
    const wrapper = mountReferat();

    changeTextAreaValue(wrapper, "situasjon", situasjonTekst);
    changeTextAreaValue(wrapper, "konklusjon", konklusjonTekst);
    changeTextAreaValue(wrapper, "arbeidstakersOppgave", arbeidstakersOppgave);
    changeTextAreaValue(wrapper, "arbeidsgiversOppgave", arbeidsgiversOppgave);
    changeTextAreaValue(wrapper, "veiledersOppgave", veiledersOppgave);

    const addDeltakerButton = wrapper.find(Knapp).at(0);
    addDeltakerButton.simulate("click");
    const deltakerInput = wrapper.find(AndreDeltakere).find("input");
    changeFieldValue(deltakerInput.at(0), annenDeltakerFunksjon);
    changeFieldValue(deltakerInput.at(1), annenDeltakerNavn);

    const forhandsvisningModal = () => wrapper.find(Forhandsvisning);
    expect(
      forhandsvisningModal().props().getDocumentComponents()
    ).to.deep.equal(expectedReferat);

    const previewButton = wrapper.find(Knapp).at(1);

    previewButton.simulate("click");
    expect(forhandsvisningModal().prop("isOpen")).to.be.true;
    expect(forhandsvisningModal().text()).to.contain(
      referatSkjemaTexts.forhandsvisningTitle
    );
    forhandsvisningModal().find(Lukknapp).simulate("click");
    expect(forhandsvisningModal().prop("isOpen")).to.be.false;
  });
});

const mountReferat = () => {
  return mount(
    <MemoryRouter
      initialEntries={[`${dialogmoteRoutePath}/${dialogmote.uuid}/referat`]}
    >
      <Route path={`${dialogmoteRoutePath}/:dialogmoteUuid/referat`}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <Referat dialogmote={dialogmote} pageTitle="Test" />
          </Provider>
        </QueryClientProvider>
      </Route>
    </MemoryRouter>
  );
};

const expectedReferat: DocumentComponentDto[] = [
  {
    texts: [arbeidstaker.navn],
    type: DocumentComponentType.HEADER,
  },
  {
    texts: [`F.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Dato: ${tilDatoMedUkedagOgManedNavn(dialogmote.tid)}`,
      `Sted: ${dialogmote.sted}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Arbeidstaker: ${arbeidstaker.navn}`,
      `Arbeidsgiver: ${lederNavn}`,
      `Fra NAV: ${veileder.navn}`,
      `${annenDeltakerFunksjon}: ${annenDeltakerNavn}`,
    ],
    title: referatTexts.deltakereTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.detteSkjeddeHeader],
    type: DocumentComponentType.HEADER,
  },
  {
    texts: [konklusjonTekst],
    title: referatTexts.konklusjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [arbeidstakersOppgave],
    title: referatTexts.arbeidstakersOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [arbeidsgiversOppgave],
    title: referatTexts.arbeidsgiversOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veiledersOppgave],
    title: referatTexts.navOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [situasjonTekst],
    title: referatTexts.situasjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn || ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];
