import {
  arbeidstaker,
  dialogmoteMedVarsel,
  mockState,
  varselArbeidstaker,
} from "../testData";
import { render } from "@testing-library/react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
import { DeltakereSvarInfo } from "@/components/dialogmote/DeltakereSvarInfo";
import {
  MotedeltakerVarselType,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";

const store = configureStore([]);
let queryClient;

const ingenDetaljerTekst = "Ingen detaljer er tilgjengelig.";

describe("DeltakereSvarInfo for arbeidstaker", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  describe("arbeidstaker har åpnet innkalling (ikke svart)", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [],
      [
        varselArbeidstaker(
          MotedeltakerVarselType.INNKALT,
          "2021-12-02T12:56:26.271381"
        ),
      ]
    );

    it("viser arbeidstaker har åpnet innkalling med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, åpnet innkallingen 02.12.2021 - Har ikke gitt svar`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
    });
  });

  describe("arbeidstaker har åpnet innkalling og svart KOMMER uten begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [],
      [
        varselArbeidstaker(
          MotedeltakerVarselType.INNKALT,
          "2021-12-02T12:56:26.271381",
          {
            svarTidspunkt: "2021-12-02T12:56:26.271381",
            svarType: SvarType.KOMMER,
          }
        ),
      ]
    );

    it("viser arbeidstaker 'kommer' med suksess-ikon og manglende begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, kommer - Svar mottatt 02.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getByRole("img", { name: "suksess-ikon" })).to.exist;
    });
  });

  describe("arbeidstaker har åpnet innkalling og svart NYTT_TID_STED med begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [],
      [
        varselArbeidstaker(
          MotedeltakerVarselType.INNKALT,
          "2021-12-02T12:56:26.271381",
          {
            svarType: SvarType.NYTT_TID_STED,
            svarTidspunkt: "2021-12-02T12:56:26.271381",
            svarTekst: "Passer ikke",
          }
        ),
      ]
    );

    it("viser arbeidstaker ønsker å endre tid/sted med advarsel-ikon og begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, ønsker å endre tidspunkt eller sted - Svar mottatt 02.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getByText("Begrunnelse")).to.exist;
      expect(wrapper.getByText("Passer ikke")).to.exist;
      expect(wrapper.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    });
  });

  describe("arbeidstaker har åpnet innkalling og svart KOMMER_IKKE med begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [],
      [
        varselArbeidstaker(
          MotedeltakerVarselType.INNKALT,
          "2021-12-02T12:56:26.271381",
          {
            svarType: SvarType.KOMMER_IKKE,
            svarTekst: "Kommer ikke",
            svarTidspunkt: "2021-12-01T12:56:26.271381",
          }
        ),
      ]
    );

    it("viser arbeidstaker ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, ønsker å avlyse - Svar mottatt 01.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getByText("Begrunnelse")).to.exist;
      expect(wrapper.getByText("Kommer ikke")).to.exist;
      expect(wrapper.getByRole("img", { name: "feil-ikon" })).to.exist;
    });
  });

  describe("arbeidstaker har ikke åpnet innkalling", () => {
    const dialogmoteMedUlestInnkalling = dialogmoteMedVarsel(
      [],
      [varselArbeidstaker(MotedeltakerVarselType.INNKALT)]
    );

    it("viser arbeidstaker har ikke åpnet innkalling med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, har ikke åpnet innkallingen`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedUlestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
      expect(wrapper.queryByText("Har ikke gitt svar", { exact: false })).to.not
        .exist;
    });
  });

  describe("arbeidstaker har åpnet endring (ikke svart)", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [],
      [
        varselArbeidstaker(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-04T12:56:26.271381"
        ),
      ]
    );

    it("viser arbeidstaker har åpnet endring med minus-sirkel-ikon og begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, åpnet endringen 04.12.2021 - Har ikke gitt svar`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
    });
  });

  describe("arbeidstaker har åpnet endring og svart KOMMER uten begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [],
      [
        varselArbeidstaker(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-04T12:56:26.271381",
          {
            svarType: SvarType.KOMMER,
            svarTidspunkt: "2021-12-04T12:56:26.271381",
          }
        ),
      ]
    );

    it("viser arbeidstaker 'kommer' med sukess-ikon og manglende begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, kommer - Svar mottatt 04.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getByRole("img", { name: "suksess-ikon" })).to.exist;
    });
  });

  describe("arbeidstaker har åpnet endring og svart NYTT_TID_STED med begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [],
      [
        varselArbeidstaker(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-04T12:56:26.271381",
          {
            svarType: SvarType.NYTT_TID_STED,
            svarTidspunkt: "2021-12-04T12:56:26.271381",
            svarTekst: "Kan vi endre sted?",
          }
        ),
      ]
    );

    it("viser arbeidstaker ønsker å endre tid/sted med advarsel-ikon og begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, ønsker å endre tidspunkt eller sted - Svar mottatt 04.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getByText("Begrunnelse")).to.exist;
      expect(wrapper.getByText("Kan vi endre sted?")).to.exist;
      expect(wrapper.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    });
  });

  describe("arbeidstaker har åpnet endring og svart KOMMER IKKE med begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [],
      [
        varselArbeidstaker(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-04T12:56:26.271381",
          {
            svarType: SvarType.KOMMER_IKKE,
            svarTidspunkt: "2021-12-04T12:56:26.271381",
            svarTekst: "Jeg kommer ikke",
          }
        ),
      ]
    );

    it("viser arbeidstaker ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, ønsker å avlyse - Svar mottatt 04.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getByText("Begrunnelse")).to.exist;
      expect(wrapper.getByText("Jeg kommer ikke")).to.exist;
      expect(wrapper.getByRole("img", { name: "feil-ikon" })).to.exist;
    });
  });

  describe("arbeidstaker har ikke åpnet endring", () => {
    const dialogmoteMedUlestEndring = dialogmoteMedVarsel(
      [],
      [varselArbeidstaker(MotedeltakerVarselType.NYTT_TID_STED)]
    );

    it("viser arbeidstaker har ikke åpnet endring med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${arbeidstaker.navn}, har ikke åpnet endringen`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedUlestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Arbeidstakeren:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
      expect(wrapper.queryByText("Har ikke gitt svar", { exact: false })).to.not
        .exist;
    });
  });
});
