import {
  arbeidsgiver,
  arbeidstaker,
  dialogmote,
  mockState,
  narmesteLederNavn,
} from "./testData";
import { render } from "@testing-library/react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
import { DeltakereSvarInfo } from "@/components/dialogmote/DeltakereSvarInfo";
import {
  DialogmotedeltakerArbeidsgiverVarselDTO,
  DialogmotedeltakerArbeidstakerVarselDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";

const store = configureStore([]);
let queryClient;

const varselArbeidsgiver = (
  type: MotedeltakerVarselType,
  lestDato?: string
): DialogmotedeltakerArbeidsgiverVarselDTO => ({
  uuid: "",
  varselType: type,
  fritekst: "",
  document: [],
  createdAt: "",
  lestDato: lestDato,
  status: "",
});
const varselArbeidstaker = (
  type: MotedeltakerVarselType,
  lestDato?: string
): DialogmotedeltakerArbeidstakerVarselDTO => ({
  uuid: "",
  varselType: type,
  fritekst: "",
  document: [],
  digitalt: true,
  createdAt: "",
  lestDato: lestDato,
});

const dialogmoteMedVarsel = (
  varselArbeidsgiver: DialogmotedeltakerArbeidsgiverVarselDTO,
  varselArbeidstaker: DialogmotedeltakerArbeidstakerVarselDTO
): DialogmoteDTO => ({
  ...dialogmote,
  arbeidsgiver: {
    virksomhetsnummer: arbeidsgiver.orgnr,
    type: "ARBEIDSGIVER",
    varselList: [varselArbeidsgiver],
  },
  arbeidstaker: {
    personIdent: arbeidstaker.personident,
    type: "ARBEIDSTAKER",
    varselList: [varselArbeidstaker],
  },
});

const ingenDetaljerTekst = "Ingen detaljer er tilgjengelig.";
const ikkeSvartTekst = "Har ikke gitt svar";

describe("DeltakereSvarInfo for arbeidstaker og arbeidsgiver", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  describe("arbeidstaker og arbeidsgiver har åpnet innkalling", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      varselArbeidsgiver(
        MotedeltakerVarselType.INNKALT,
        "2021-12-01T12:56:26.271381"
      ),
      varselArbeidstaker(
        MotedeltakerVarselType.INNKALT,
        "2021-12-02T12:56:26.271381"
      )
    );
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser nærmeste leder har åpnet innkalling", () => {
      const expectedText = `${narmesteLederNavn}, åpnet innkallingen 01.12.2021`;

      expect(wrapper.getByText("Nærmeste leder:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser arbeidstaker har åpnet innkalling", () => {
      const expectedText = `${arbeidstaker.navn}, åpnet innkallingen 02.12.2021`;

      expect(wrapper.getByText("Arbeidstakeren", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser manglende begrunnelse-tekst for nærmeste leder og arbeidstaker", () => {
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.have.length(2);
      expect(wrapper.queryByText("Begrunnelse", { exact: false })).to.not.exist;
    });
    it("viser suksess-ikon for nærmeste leder og arbeidstaker", () => {
      expect(
        wrapper.getAllByRole("img", { name: "suksess-ikon" })
      ).to.have.length(2);
    });
    it("viser ikke svar-tekst", () => {
      expect(wrapper.queryByText(ikkeSvartTekst, { exact: false })).to.not
        .exist;
    });
  });

  describe("arbeidstaker og arbeidsgiver har ikke åpnet innkalling", () => {
    const dialogmoteMedUlestInnkalling = dialogmoteMedVarsel(
      varselArbeidsgiver(MotedeltakerVarselType.INNKALT),
      varselArbeidstaker(MotedeltakerVarselType.INNKALT)
    );
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedUlestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser nærmeste leder har ikke åpnet innkalling", () => {
      const expectedText = `${narmesteLederNavn}, har ikke åpnet innkallingen`;

      expect(wrapper.getByText("Nærmeste leder:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser arbeidstaker har ikke åpnet innkalling", () => {
      const expectedText = `${arbeidstaker.navn}, har ikke åpnet innkallingen`;

      expect(wrapper.getByText("Arbeidstakeren", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser manglende begrunnelse-tekst for nærmeste leder og arbeidstaker", () => {
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.have.length(2);
      expect(wrapper.queryByText("Begrunnelse", { exact: false })).to.not.exist;
    });
    it("viser minus-sirkel-ikon for nærmeste leder og arbeidstaker", () => {
      expect(
        wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })
      ).to.have.length(2);
    });
    it("viser ikke svar-tekst", () => {
      expect(wrapper.queryByText(ikkeSvartTekst, { exact: false })).to.not
        .exist;
    });
  });

  describe("arbeidstaker og arbeidsgiver har åpnet endring", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      varselArbeidsgiver(
        MotedeltakerVarselType.NYTT_TID_STED,
        "2021-12-03T12:56:26.271381"
      ),
      varselArbeidstaker(
        MotedeltakerVarselType.NYTT_TID_STED,
        "2021-12-04T12:56:26.271381"
      )
    );
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser nærmeste leder har åpnet endring", () => {
      const expectedText = `${narmesteLederNavn}, åpnet endringen 03.12.2021`;

      expect(wrapper.getByText("Nærmeste leder:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser arbeidstaker har åpnet endring", () => {
      const expectedText = `${arbeidstaker.navn}, åpnet endringen 04.12.2021`;

      expect(wrapper.getByText("Arbeidstakeren", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser manglende begrunnelse-tekst for nærmeste leder og arbeidstaker", () => {
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.have.length(2);
      expect(wrapper.queryByText("Begrunnelse", { exact: false })).to.not.exist;
    });
    it("viser suksess-ikon for nærmeste leder og arbeidstaker", () => {
      expect(
        wrapper.getAllByRole("img", { name: "suksess-ikon" })
      ).to.have.length(2);
    });
    it("viser ikke svar-tekst", () => {
      expect(wrapper.queryByText(ikkeSvartTekst, { exact: false })).to.not
        .exist;
    });
  });

  describe("arbeidstaker og arbeidsgiver har ikke åpnet endring", () => {
    const dialogmoteMedUlestEndring = dialogmoteMedVarsel(
      varselArbeidsgiver(MotedeltakerVarselType.NYTT_TID_STED),
      varselArbeidstaker(MotedeltakerVarselType.NYTT_TID_STED)
    );
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedUlestEndring} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser nærmeste leder har ikke åpnet endring", () => {
      const expectedText = `${narmesteLederNavn}, har ikke åpnet endringen`;

      expect(wrapper.getByText("Nærmeste leder:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser arbeidstaker har ikke åpnet endring", () => {
      const expectedText = `${arbeidstaker.navn}, har ikke åpnet endringen`;

      expect(wrapper.getByText("Arbeidstakeren", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser manglende begrunnelse-tekst for nærmeste leder og arbeidstaker", () => {
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.have.length(2);
      expect(wrapper.queryByText("Begrunnelse", { exact: false })).to.not.exist;
    });
    it("viser minus-sirkel-ikon for nærmeste leder og arbeidstaker", () => {
      expect(
        wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })
      ).to.have.length(2);
    });
    it("viser ikke svar-tekst", () => {
      expect(wrapper.queryByText(ikkeSvartTekst, { exact: false })).to.not
        .exist;
    });
  });
});
