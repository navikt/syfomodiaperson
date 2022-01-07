import {
  dialogmoteMedVarsel,
  mockState,
  narmesteLederNavn,
  varselArbeidsgiver,
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

describe("DeltakereSvarInfo for arbeidsgiver", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  describe("arbeidsgiver har åpnet innkalling (ikke svart)", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.INNKALT,
          "2021-12-01T12:56:26.271381"
        ),
      ],
      []
    );

    it("viser nærmeste leder har åpnet innkalling med minus-sirkel-ikon og begrunnelse", () => {
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );
      const expectedText = `${narmesteLederNavn}, åpnet innkallingen 01.12.2021 - Har ikke gitt svar`;

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
    });
  });

  describe("arbeidsgiver har åpnet innkalling og svart KOMMER uten begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.INNKALT,
          "2021-12-01T12:56:26.271381",
          {
            svarTidspunkt: "2021-12-01T12:56:26.271381",
            svarType: SvarType.KOMMER,
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder 'kommer' med suksess-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, kommer - Svar mottatt 01.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getByRole("img", { name: "suksess-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har åpnet innkalling og svart NYTT_TID_STED med begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.INNKALT,
          "2021-12-01T12:56:26.271381",
          {
            svarType: SvarType.NYTT_TID_STED,
            svarTidspunkt: "2021-12-01T12:56:26.271381",
            svarTekst: "Passer ikke",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder ønsker å endre tid/sted med advarsel-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, ønsker å endre tidspunkt eller sted - Svar mottatt 01.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getByText("Begrunnelse")).to.exist;
      expect(wrapper.getByText("Passer ikke")).to.exist;
      expect(wrapper.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har åpnet innkalling og svart KOMMER_IKKE med begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.INNKALT,
          "2021-12-01T12:56:26.271381",
          {
            svarType: SvarType.KOMMER_IKKE,
            svarTekst: "Kommer ikke",
            svarTidspunkt: "2021-12-01T12:56:26.271381",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, ønsker å avlyse - Svar mottatt 01.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getByText("Begrunnelse")).to.exist;
      expect(wrapper.getByText("Kommer ikke")).to.exist;
      expect(wrapper.getByRole("img", { name: "feil-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har ikke åpnet innkalling", () => {
    const dialogmoteMedUlestInnkalling = dialogmoteMedVarsel(
      [varselArbeidsgiver(MotedeltakerVarselType.INNKALT)],
      []
    );

    it("viser nærmeste leder har ikke åpnet innkalling med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, har ikke åpnet innkallingen`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedUlestInnkalling} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
      expect(wrapper.queryByText("Har ikke gitt svar", { exact: false })).to.not
        .exist;
    });
  });

  describe("arbeidsgiver har åpnet endring (ikke svart)", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-03T12:56:26.271381"
        ),
      ],
      []
    );

    it("viser nærmeste leder har åpnet endring med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, åpnet endringen 03.12.2021 - Har ikke gitt svar`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
    });
  });

  describe("arbeidsgiver har åpnet endring og svart KOMMER uten begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-03T12:56:26.271381",
          {
            svarType: SvarType.KOMMER,
            svarTidspunkt: "2021-12-03T12:56:26.271381",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder 'kommer' med suksess-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, kommer - Svar mottatt 03.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getByRole("img", { name: "suksess-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har åpnet endring og svart NYTT_TID_STED med begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-03T12:56:26.271381",
          {
            svarType: SvarType.NYTT_TID_STED,
            svarTidspunkt: "2021-12-03T12:56:26.271381",
            svarTekst: "Kan vi endre sted?",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder ønsker å endre tid/sted med advarsel-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, ønsker å endre tidspunkt eller sted - Svar mottatt 03.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getByText("Begrunnelse")).to.exist;
      expect(wrapper.getByText("Kan vi endre sted?")).to.exist;
      expect(wrapper.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har åpnet endring og svart KOMMER IKKE med begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-03T12:56:26.271381",
          {
            svarType: SvarType.KOMMER_IKKE,
            svarTidspunkt: "2021-12-03T12:56:26.271381",
            svarTekst: "Jeg kommer ikke",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, ønsker å avlyse - Svar mottatt 03.12.2021`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedLestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.getByText("Begrunnelse")).to.exist;
      expect(wrapper.getByText("Jeg kommer ikke")).to.exist;
      expect(wrapper.getByRole("img", { name: "feil-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har ikke åpnet endring", () => {
    const dialogmoteMedUlestEndring = dialogmoteMedVarsel(
      [varselArbeidsgiver(MotedeltakerVarselType.NYTT_TID_STED)],
      []
    );

    it("viser nærmeste leder har ikke åpnet endring med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, har ikke åpnet endringen`;
      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedUlestEndring} />
          </Provider>
        </QueryClientProvider>
      );

      expect(wrapper.getByText("Nærmeste leder:")).to.exist;
      expect(wrapper.getByText(expectedText)).to.exist;
      expect(wrapper.queryByText("Har ikke gitt svar", { exact: false })).to.not
        .exist;
      expect(wrapper.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(wrapper.queryByText("Begrunnelse")).to.not.exist;
      expect(wrapper.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
    });
  });
});
