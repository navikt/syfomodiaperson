import { QueryClient, QueryClientProvider } from "react-query";
import configureStore from "redux-mock-store";
import {
  DialogmotedeltakerBehandlerVarselSvarDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import {
  arbeidstaker,
  behandlerDeltaker,
  dialogmote,
  dialogmoteMedBehandler,
  mockState,
} from "../testData";
import { render, within, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { DeltakereSvarInfo } from "@/components/dialogmote/DeltakereSvarInfo";
import React from "react";
import { expect } from "chai";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { LEDERE_DEFAULT } from "../../../mock/common/mockConstants";

const store = configureStore([]);
let queryClient;

const dialogmoteBehandlerMedSvar = (
  svarList: Pick<
    DialogmotedeltakerBehandlerVarselSvarDTO,
    "svarType" | "tekst" | "createdAt"
  >[]
): DialogmoteDTO => ({
  ...dialogmoteMedBehandler,
  behandler: {
    ...behandlerDeltaker,
    varselList: [
      {
        varselType: MotedeltakerVarselType.INNKALT,
        fritekst: "",
        createdAt: "",
        uuid: "",
        document: [],
        svar: svarList.map((svar) => ({ uuid: "", ...svar })),
      },
    ],
  },
});

const ingenDetaljerTekst = "Ingen detaljer er tilgjengelig.";

const getBehandlerExpandableButton = () =>
  screen.getByRole("button", {
    name: /Behandleren/,
  });

const getBehandlerExpanded = () =>
  screen.getByRole("region", {
    name: /Behandleren/,
  });

const renderDeltakereSvarInfo = (dialogmote: DialogmoteDTO) =>
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store(mockState)}>
        <DeltakereSvarInfo dialogmote={dialogmote} />
      </Provider>
    </QueryClientProvider>
  );

describe("DeltakereSvarInfo uten behandler", () => {
  it("viser ikke ekspanderbart panel for svar fra behandler", () => {
    queryClient = new QueryClient();
    renderDeltakereSvarInfo(dialogmote);

    expect(screen.queryByText("Behandleren", { exact: false })).to.not.exist;
    expect(
      screen.queryByRole("button", {
        name: /Behandleren/,
      })
    ).to.not.exist;
    expect(
      screen.queryByRole("region", {
        name: /Behandleren/,
      })
    ).to.not.exist;
  });
});

describe("DeltakereSvarInfo med behandler", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.setQueryData(
      ledereQueryKeys.ledere(arbeidstaker.personident),
      () => LEDERE_DEFAULT
    );
  });
  describe("behandler har ikke svart på innkalling", () => {
    const dialogmoteMedUbesvartVarsel = dialogmoteBehandlerMedSvar([]);

    it("viser at behandler ikke har gitt svar med minus-sirkel ikon og manglende begrunnelse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, har ikke gitt svar`;
      renderDeltakereSvarInfo(dialogmoteMedUbesvartVarsel);

      const behandlerExpandableButon = getBehandlerExpandableButton();
      const behandlerExpanded = getBehandlerExpanded();

      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        within(behandlerExpandableButon).getByRole("img", {
          name: "minus-sirkel-ikon",
        })
      ).to.exist;
      expect(within(behandlerExpanded).getByText(ingenDetaljerTekst)).to.exist;
      expect(within(behandlerExpanded).queryByText("Begrunnelse")).to.not.exist;
    });
  });
  describe("behandler har svart kommer uten begrunnelse", () => {
    const dialogmoteMedSvar = dialogmoteBehandlerMedSvar([
      {
        svarType: SvarType.KOMMER,
        createdAt: "2021-12-07T12:56:26.271381",
      },
    ]);

    it("viser behandler 'kommer' med suksess-ikon og manglende begrunnelse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, kommer - Svar mottatt 07.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedSvar);

      const behandlerExpandableButton = getBehandlerExpandableButton();
      const behandlerExpanded = getBehandlerExpanded();

      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        within(behandlerExpandableButton).getByRole("img", {
          name: "suksess-ikon",
        })
      ).to.exist;
      expect(within(behandlerExpanded).getByText(ingenDetaljerTekst)).to.exist;
      expect(within(behandlerExpanded).queryByText("Begrunnelse")).to.not.exist;
    });
  });
  describe("behandler har svart 'kommer ikke' med begrunnelse", () => {
    const dialogmoteMedSvar = dialogmoteBehandlerMedSvar([
      {
        svarType: SvarType.KOMMER_IKKE,
        tekst: "Jeg kan ikke komme",
        createdAt: "2021-12-08T12:56:26.271381",
      },
    ]);

    it("viser behandler ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å avlyse - Svar mottatt 08.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedSvar);

      const behandlerExpandableButton = getBehandlerExpandableButton();
      const behandlerExpanded = getBehandlerExpanded();

      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        within(behandlerExpandableButton).getByRole("img", {
          name: "feil-ikon",
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).getByText("Begrunnelse mottatt 08.12.2021", {
          exact: false,
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).getByText("Jeg kan ikke komme", {
          exact: false,
        })
      ).to.exist;
    });
  });
  describe("behandler har svart 'nytt tid/sted' med begrunnelse etter 'kommer' med begrunnelse", () => {
    const dialogmoteMedSvar = dialogmoteBehandlerMedSvar([
      {
        svarType: SvarType.NYTT_TID_STED,
        tekst: "Tidspunktet passer ikke likevel",
        createdAt: "2021-12-08T12:56:26.271381",
      },
      {
        svarType: SvarType.KOMMER,
        tekst: "Jeg kommer",
        createdAt: "2021-12-07T12:56:26.271381",
      },
    ]);

    it("viser behandler ønsker å endre tid/sted med advarsel-ikon og begrunnelser fra siste og tidligere svar", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å endre tidspunkt eller sted - Oppdatering mottatt 08.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedSvar);

      const behandlerExpandableButton = getBehandlerExpandableButton();
      const behandlerExpanded = getBehandlerExpanded();

      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        within(behandlerExpandableButton).getByRole("img", {
          name: "advarsel-ikon",
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).getByText("Begrunnelse mottatt 08.12.2021", {
          exact: false,
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).getByText("Tidspunktet passer ikke likevel", {
          exact: false,
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).getByText("Begrunnelse mottatt 07.12.2021", {
          exact: false,
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).getByText("Jeg kommer", { exact: false })
      ).to.exist;
      expect(
        within(behandlerExpanded).queryByText(ingenDetaljerTekst, {
          exact: false,
        })
      ).to.not.exist;
    });
  });
  describe("behandler har svart 'kommer ikke' med begrunnelse etter 'kommer' uten begrunnelse", () => {
    const dialogmoteMedSvar = dialogmoteBehandlerMedSvar([
      {
        svarType: SvarType.KOMMER_IKKE,
        tekst: "Kommer ikke likevel",
        createdAt: "2021-12-08T12:56:26.271381",
      },
      {
        svarType: SvarType.KOMMER,
        createdAt: "2021-12-07T12:56:26.271381",
      },
    ]);

    it("viser behandler ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å avlyse - Oppdatering mottatt 08.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedSvar);

      const behandlerExpandableButton = getBehandlerExpandableButton();
      const behandlerExpanded = getBehandlerExpanded();

      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        within(behandlerExpandableButton).getByRole("img", {
          name: "feil-ikon",
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).getByText("Begrunnelse mottatt 08.12.2021", {
          exact: false,
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).getByText("Kommer ikke likevel", {
          exact: false,
        })
      ).to.exist;
      expect(
        within(behandlerExpanded).queryByText(ingenDetaljerTekst, {
          exact: false,
        })
      ).to.not.exist;
    });
  });
});
