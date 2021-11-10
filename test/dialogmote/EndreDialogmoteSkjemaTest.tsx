import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import React from "react";
import EndreDialogmoteSkjema from "@/components/dialogmote/endre/EndreDialogmoteSkjema";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { Feilmelding } from "nav-frontend-typografi";
import {
  assertFeilmelding,
  changeFieldValue,
  changeTextAreaValue,
} from "../testUtils";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import { Feiloppsummering } from "nav-frontend-skjema";
import { expect } from "chai";
import { texts as skjemaFeilOppsummeringTexts } from "@/components/SkjemaFeiloppsummering";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import {
  leggTilDagerPaDato,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
  toDatePrettyPrint,
} from "@/utils/datoUtils";
import { apiMock } from "../stubs/stubApi";
import { stubEndreApi } from "../stubs/stubIsdialogmote";
import { InputDateStringToISODateString } from "nav-datovelger/lib/utils/dateFormatUtils";
import { Forhandsvisning } from "@/components/dialogmote/Forhandsvisning";
import { texts as endringSkjemaTexts } from "../../src/components/dialogmote/endre/EndreDialogmoteTekster";
import Lukknapp from "nav-frontend-lukknapp";
import {
  arbeidstaker,
  behandlendeEnhet,
  dialogmote,
  navEnhet,
  veileder,
} from "./testData";
import { genererDato } from "@/components/mote/utils";
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
const nyDato = toDatePrettyPrint(leggTilDagerPaDato(new Date(), 1)) as string;
const moteKlokkeslett = "09:00";
const nyDatoAsISODateString = InputDateStringToISODateString(nyDato);
const nyVideolink = "https://video.nav.no";
const nyttSted = "Videomøte endret";
const nyDatoTid = `${InputDateStringToISODateString(
  nyDato
)}T${moteKlokkeslett}:00`;

let queryClient;

describe("EndreDialogmoteSkjemaTest", () => {
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

  it("validerer begrunnelser og dato", () => {
    const wrapper = mountEndreDialogmoteSkjema();

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
    expect(
      feilmeldinger.someWhere((feil) =>
        feil.text().includes("Datoen må være etter")
      )
    ).to.be.true;

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
    expect(feiloppsummering.text()).to.contain("Datoen må være etter");
  });

  it("valideringsmeldinger forsvinner ved utbedring", () => {
    const wrapper = mountEndreDialogmoteSkjema();

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
    expect(
      feilmeldinger.someWhere((feil) =>
        feil.text().includes("Datoen må være etter")
      )
    ).to.be.true;

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
    expect(feiloppsummering.text()).to.contain("Datoen må være etter");

    // Angi dato og begrunnelser
    const datoVelger = wrapper.find("ForwardRef(DateInput)");
    changeFieldValue(datoVelger, nyDato);
    datoVelger.simulate("blur");
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
  it("endrer møte tid og sted ved submit av skjema", () => {
    stubEndreApi(apiMock(), dialogmote.uuid);
    const wrapper = mountEndreDialogmoteSkjema();

    const inputs = wrapper.find("input");
    const stedInput = inputs.findWhere((w) => w.prop("name") === "sted");
    const videoLinkInput = inputs.findWhere(
      (w) => w.prop("name") === "videoLink"
    );
    const datoVelger = wrapper.find("ForwardRef(DateInput)");
    changeFieldValue(datoVelger, nyDato);
    datoVelger.simulate("blur");
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
    changeFieldValue(stedInput, nyttSted);
    changeFieldValue(videoLinkInput, nyVideolink);

    wrapper.find("form").simulate("submit");

    const endreMutation = queryClient.getMutationCache().getAll()[0];
    const expectedEndring = {
      arbeidsgiver: {
        begrunnelse: tekstTilArbeidsgiver,
        endringsdokument: expectedArbeidsgiverEndringsdokument,
      },
      arbeidstaker: {
        begrunnelse: tekstTilArbeidstaker,
        endringsdokument: expectedArbeidstakerEndringsdokument,
      },
      videoLink: nyVideolink,
      sted: nyttSted,
      tid: nyDatoTid,
    };
    expect(endreMutation.options.variables).to.deep.equal(expectedEndring);
  });
  it("forhåndsviser endret tid og sted til arbeidstaker og arbeidsgiver", () => {
    const wrapper = mountEndreDialogmoteSkjema();

    const inputs = wrapper.find("input");
    const stedInput = inputs.findWhere((w) => w.prop("name") === "sted");
    const videoLinkInput = inputs.findWhere(
      (w) => w.prop("name") === "videoLink"
    );
    const datoVelger = wrapper.find("ForwardRef(DateInput)");
    changeFieldValue(datoVelger, nyDato);
    datoVelger.simulate("blur");
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
    changeFieldValue(stedInput, nyttSted);
    changeFieldValue(videoLinkInput, nyVideolink);

    const getForhandsvisningsModaler = () => wrapper.find(Forhandsvisning);
    let forhandsvisninger = getForhandsvisningsModaler();
    expect(
      forhandsvisninger.at(0).props().getDocumentComponents()
    ).to.deep.equal(expectedArbeidstakerEndringsdokument);
    expect(
      forhandsvisninger.at(1).props().getDocumentComponents()
    ).to.deep.equal(expectedArbeidsgiverEndringsdokument);

    const previewButtons = wrapper.find(Knapp);

    // Forhåndsvis endringsbrev til arbeidstaker og sjekk at modal vises med riktig tittel
    previewButtons.at(0).simulate("click");
    forhandsvisninger = getForhandsvisningsModaler();
    let forhandsvisningEndringArbeidstaker = forhandsvisninger.at(0);
    let forhandsvisningEndringArbeidsgiver = forhandsvisninger.at(1);
    expect(forhandsvisningEndringArbeidstaker.prop("isOpen")).to.be.true;
    expect(forhandsvisningEndringArbeidsgiver.prop("isOpen")).to.be.false;
    expect(forhandsvisningEndringArbeidstaker.text()).to.contain(
      endringSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningEndringArbeidstaker.text()).to.contain(
      endringSkjemaTexts.forhandsvisningArbeidstakerSubtitle
    );
    expect(forhandsvisningEndringArbeidsgiver.text()).not.to.contain(
      endringSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningEndringArbeidsgiver.text()).not.to.contain(
      endringSkjemaTexts.forhandsvisningArbeidsgiverSubtitle
    );

    // Lukk forhåndsvis endringsbrev til arbeidstaker
    forhandsvisningEndringArbeidstaker.find(Lukknapp).simulate("click");

    // Forhåndsvis endringsbrev til arbeidsgiver og sjekk at modal vises med riktig tittel
    previewButtons.at(1).simulate("click");
    forhandsvisninger = getForhandsvisningsModaler();
    forhandsvisningEndringArbeidstaker = forhandsvisninger.at(0);
    forhandsvisningEndringArbeidsgiver = forhandsvisninger.at(1);
    expect(forhandsvisningEndringArbeidstaker.prop("isOpen")).to.be.false;
    expect(forhandsvisningEndringArbeidsgiver.prop("isOpen")).to.be.true;
    expect(forhandsvisningEndringArbeidstaker.text()).not.to.contain(
      endringSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningEndringArbeidstaker.text()).not.to.contain(
      endringSkjemaTexts.forhandsvisningArbeidstakerSubtitle
    );
    expect(forhandsvisningEndringArbeidsgiver.text()).to.contain(
      endringSkjemaTexts.forhandsvisningTitle
    );
    expect(forhandsvisningEndringArbeidsgiver.text()).to.contain(
      endringSkjemaTexts.forhandsvisningArbeidsgiverSubtitle
    );
  });
});

const mountEndreDialogmoteSkjema = () => {
  return mount(
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

const expectedArbeidsgiverEndringsdokument = [
  {
    texts: [`Gjelder ${arbeidstaker.navn} (f.nr ${arbeidstaker.personident})`],
    type: "PARAGRAPH",
  },
  {
    texts: [
      "Du har tidligere blitt innkalt til et dialogmøte. Møtet skulle vært avholdt 10. mai 2021, kl. 09.00.",
    ],
    type: "PARAGRAPH",
  },
  {
    texts: ["Møtet må flyttes. Dette tidspunktet og møtestedet gjelder nå:"],
    type: "PARAGRAPH",
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(nyDatoAsISODateString, moteKlokkeslett)
      ),
    ],
    title: "Møtetidspunkt",
    type: "PARAGRAPH",
  },
  {
    texts: [nyttSted],
    title: "Møtested",
    type: "PARAGRAPH",
  },
  {
    texts: [nyVideolink],
    title: "Lenke til videomøte",
    type: "LINK",
  },
  {
    texts: [tekstTilArbeidsgiver],
    type: "PARAGRAPH",
  },
  {
    texts: [
      "I møtet vil vi høre både hva du og arbeidstakeren sier om arbeidssituasjonen og mulighetene for å jobbe. Vi blir enige om en plan som kan hjelpe arbeidstakeren videre.",
    ],
    type: "PARAGRAPH",
  },
  {
    texts: [
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi ikke sett behov for det.",
    ],
    type: "PARAGRAPH",
  },
  {
    texts: [
      "Det er viktig at dere fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
    ],
    title: "Før møtet",
    type: "PARAGRAPH",
  },
  {
    texts: ["Vennlig hilsen", navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
  {
    texts: ["Arbeidsgivertelefonen", "55 55 33 36"],
    type: "PARAGRAPH",
  },
];
const expectedArbeidstakerEndringsdokument = [
  {
    texts: [`${arbeidstaker.navn} (f.nr ${arbeidstaker.personident})`],
    type: "PARAGRAPH",
  },
  {
    texts: [
      "Du har tidligere blitt innkalt til et dialogmøte. Møtet skulle vært avholdt 10. mai 2021, kl. 09.00.",
    ],
    type: "PARAGRAPH",
  },
  {
    texts: ["Møtet må flyttes. Dette tidspunktet og møtestedet gjelder nå:"],
    type: "PARAGRAPH",
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(nyDatoAsISODateString, moteKlokkeslett)
      ),
    ],
    title: "Møtetidspunkt",
    type: "PARAGRAPH",
  },
  {
    texts: [nyttSted],
    title: "Møtested",
    type: "PARAGRAPH",
  },
  {
    texts: [nyVideolink],
    title: "Lenke til videomøte",
    type: "LINK",
  },
  {
    texts: [tekstTilArbeidstaker],
    type: "PARAGRAPH",
  },
  {
    texts: [
      "I møtet vil vi høre både hva du og arbeidsgiveren sier om arbeidssituasjonen og mulighetene for å jobbe. Vi blir enige om en plan som kan hjelpe deg videre.",
    ],
    type: "PARAGRAPH",
  },
  {
    texts: [
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi ikke sett behov for det.",
    ],
    type: "PARAGRAPH",
  },
  {
    texts: [
      "Det er viktig at dere fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
    ],
    title: "Før møtet",
    type: "PARAGRAPH",
  },
  {
    texts: ["Vennlig hilsen", navEnhet.navn],
    type: "PARAGRAPH",
  },
  {
    texts: [veileder.navn],
    type: "PARAGRAPH",
  },
];
