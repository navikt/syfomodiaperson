import { mount } from "enzyme";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { expect } from "chai";
import { Feilmelding } from "nav-frontend-typografi";
import { Feiloppsummering } from "nav-frontend-skjema";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import AvlysDialogmoteSkjema, {
  texts as avlysningSkjemaTexts,
} from "../../src/components/dialogmote/avlys/AvlysDialogmoteSkjema";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "../../src/utils/valideringUtils";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import { avlysningTexts, commonTexts } from "@/data/dialogmote/dialogmoteTexts";
import { Forhandsvisning } from "@/components/dialogmote/Forhandsvisning";
import Lukknapp from "nav-frontend-lukknapp";
import { assertFeilmelding, changeTextAreaValue } from "../testUtils";
import { QueryClient, QueryClientProvider } from "react-query";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubAvlysApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import {
  arbeidstaker,
  behandlendeEnhet,
  dialogmote,
  navEnhet,
  veileder,
} from "./testData";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";

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
};
const tekstTilArbeidstaker = "Noe tekst til arbeidstaker";
const tekstTilArbeidsgiver = "Noe tekst til arbeidsgiver";

const queryClient = new QueryClient();
queryClient.setQueryData(veilederinfoQueryKeys.veilederinfo, () => veileder);
queryClient.setQueryData(
  behandlendeEnhetQueryKeys.behandlendeEnhet(arbeidstaker.personident),
  () => behandlendeEnhet
);

describe("AvlysDialogmoteSkjemaTest", () => {
  it("viser møtetidspunkt", () => {
    const wrapper = mountAvlysDialogmoteSkjema();

    expect(wrapper.text()).to.contain("Gjelder dialogmøtet");
    expect(wrapper.text()).to.contain("Mandag 10. mai 2021 kl. 09.00");
  });
  it("validerer begrunnelser", () => {
    const wrapper = mountAvlysDialogmoteSkjema();

    wrapper.find("form").simulate("submit");

    // Feilmeldinger i skjema
    const feilmeldinger = wrapper.find(Feilmelding);
    assertFeilmelding(
      feilmeldinger,
      valideringsTexts.begrunnelseArbeidstakerMissing
    );
    assertFeilmelding(
      feilmeldinger,
      valideringsTexts.begrunnelseArbeidsgiverMissing
    );

    // Feilmeldinger i oppsummering
    const feiloppsummering = wrapper.find(Feiloppsummering);
    expect(feiloppsummering.text()).to.contain(
      skjemaFeilOppsummeringTexts.title
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.begrunnelseArbeidstakerMissing
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.begrunnelseArbeidsgiverMissing
    );
  });
  it("valideringsmeldinger forsvinner ved utbedring", () => {
    const wrapper = mountAvlysDialogmoteSkjema();

    wrapper.find("form").simulate("submit");

    // Feilmeldinger i skjema
    const feilmeldinger = wrapper.find(Feilmelding);
    assertFeilmelding(
      feilmeldinger,
      valideringsTexts.begrunnelseArbeidstakerMissing
    );
    assertFeilmelding(
      feilmeldinger,
      valideringsTexts.begrunnelseArbeidsgiverMissing
    );

    // Feilmeldinger i oppsummering
    const feiloppsummering = wrapper.find(Feiloppsummering);
    expect(feiloppsummering.text()).to.contain(
      skjemaFeilOppsummeringTexts.title
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.begrunnelseArbeidstakerMissing
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.begrunnelseArbeidsgiverMissing
    );

    // Angi begrunnelser
    changeTextAreaValue(
      wrapper,
      "begrunnelseArbeidsgiver",
      tekstTilArbeidsgiver
    );
    changeTextAreaValue(
      wrapper,
      "begrunnelseArbeidstaker",
      tekstTilArbeidstaker
    );

    // Feilmeldinger og feiloppsummering forsvinner
    expect(wrapper.find(Feiloppsummering)).to.have.length(0);
    expect(wrapper.find(Feilmelding)).to.have.length(0);

    // Fjern begrunnelser
    changeTextAreaValue(wrapper, "begrunnelseArbeidsgiver", "");
    changeTextAreaValue(wrapper, "begrunnelseArbeidstaker", "");

    // Feilmeldinger vises, feiloppsummering vises ved neste submit
    expect(wrapper.find(Feiloppsummering)).to.have.length(0);
    expect(wrapper.find(Feilmelding)).to.have.length(2);

    wrapper.find(Hovedknapp).simulate("click");
    expect(wrapper.find(Feiloppsummering)).to.have.length(1);
  });
  it("avlyser møte ved submit av skjema", () => {
    stubAvlysApi(apiMock(), dialogmote.uuid);
    const wrapper = mountAvlysDialogmoteSkjema();

    changeTextAreaValue(
      wrapper,
      "begrunnelseArbeidsgiver",
      tekstTilArbeidsgiver
    );
    changeTextAreaValue(
      wrapper,
      "begrunnelseArbeidstaker",
      tekstTilArbeidstaker
    );

    wrapper.find("form").simulate("submit");

    const avlysMutation = queryClient.getMutationCache().getAll()[0];
    const expectedAvlysning = {
      arbeidsgiver: {
        avlysning: expectedAvlysningArbeidsgiver,
        begrunnelse: tekstTilArbeidsgiver,
      },
      arbeidstaker: {
        avlysning: expectedAvlysningArbeidstaker,
        begrunnelse: tekstTilArbeidstaker,
      },
    };
    expect(avlysMutation.options.variables).to.deep.equal(expectedAvlysning);
  });

  it("forhåndsviser avlysning til arbeidstaker og arbeidsgiver", () => {
    const wrapper = mountAvlysDialogmoteSkjema();

    changeTextAreaValue(
      wrapper,
      "begrunnelseArbeidsgiver",
      tekstTilArbeidsgiver
    );
    changeTextAreaValue(
      wrapper,
      "begrunnelseArbeidstaker",
      tekstTilArbeidstaker
    );

    let forhandsvisningModaler = wrapper.find(Forhandsvisning);
    expect(
      forhandsvisningModaler.at(0).props().getDocumentComponents()
    ).to.deep.equal(expectedAvlysningArbeidstaker);
    expect(
      forhandsvisningModaler.at(1).props().getDocumentComponents()
    ).to.deep.equal(expectedAvlysningArbeidsgiver);

    const previewButtons = wrapper.find(Knapp);

    // Forhåndsvis avlysning til arbeidstaker og sjekk at modal vises med riktig tittel
    previewButtons.at(0).simulate("click");
    forhandsvisningModaler = wrapper.find(Forhandsvisning);
    let forhandsvisningAvlysningArbeidstaker = forhandsvisningModaler.at(0);
    let forhandsvisningAvlysningArbeidsgiver = forhandsvisningModaler.at(1);
    expect(forhandsvisningAvlysningArbeidstaker.prop("isOpen")).to.be.true;
    expect(forhandsvisningAvlysningArbeidsgiver.prop("isOpen")).to.be.false;
    expect(forhandsvisningAvlysningArbeidstaker.text()).to.contain(
      avlysningSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningAvlysningArbeidstaker.text()).to.contain(
      avlysningSkjemaTexts.forhandsvisningArbeidstakerSubtitle
    );
    expect(forhandsvisningAvlysningArbeidsgiver.text()).not.to.contain(
      avlysningSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningAvlysningArbeidsgiver.text()).not.to.contain(
      avlysningSkjemaTexts.forhandsvisningArbeidsgiverSubtitle
    );

    // Lukk forhåndsvis avlysning til arbeidstaker
    forhandsvisningAvlysningArbeidstaker.find(Lukknapp).simulate("click");

    // Forhåndsvis avlysning til arbeidsgiver og sjekk at modal vises med riktig tittel
    previewButtons.at(1).simulate("click");
    forhandsvisningModaler = wrapper.find(Forhandsvisning);
    forhandsvisningAvlysningArbeidstaker = forhandsvisningModaler.at(0);
    forhandsvisningAvlysningArbeidsgiver = forhandsvisningModaler.at(1);
    expect(forhandsvisningAvlysningArbeidstaker.prop("isOpen")).to.be.false;
    expect(forhandsvisningAvlysningArbeidsgiver.prop("isOpen")).to.be.true;
    expect(forhandsvisningAvlysningArbeidstaker.text()).not.to.contain(
      avlysningSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningAvlysningArbeidstaker.text()).not.to.contain(
      avlysningSkjemaTexts.forhandsvisningArbeidstakerSubtitle
    );
    expect(forhandsvisningAvlysningArbeidsgiver.text()).to.contain(
      avlysningSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningAvlysningArbeidsgiver.text()).to.contain(
      avlysningSkjemaTexts.forhandsvisningArbeidsgiverSubtitle
    );
  });
});

const mountAvlysDialogmoteSkjema = () => {
  return mount(
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

const expectedAvlysningArbeidsgiver = [
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}.`],
    type: "PARAGRAPH",
  },
  {
    texts: [
      `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}. ${avlysningTexts.intro2}`,
    ],
    type: "PARAGRAPH",
  },
  {
    texts: [tekstTilArbeidsgiver],
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
];
const expectedAvlysningArbeidstaker = [
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}.`],
    type: "PARAGRAPH",
  },
  {
    texts: [
      `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}. ${avlysningTexts.intro2}`,
    ],
    type: "PARAGRAPH",
  },
  {
    texts: [tekstTilArbeidstaker],
    type: "PARAGRAPH",
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
];
