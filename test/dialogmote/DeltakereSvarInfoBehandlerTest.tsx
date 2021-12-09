import { QueryClient, QueryClientProvider } from "react-query";
import configureStore from "redux-mock-store";
import {
  DialogmotedeltakerBehandlerVarselSvarDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import {
  behandlerDeltaker,
  dialogmote,
  dialogmoteMedBehandler,
  mockState,
} from "./testData";
import { render, RenderResult, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { DeltakereSvarInfo } from "@/components/dialogmote/DeltakereSvarInfo";
import React from "react";
import { expect } from "chai";

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

const getBehandlerExpandableButton = (wrapper: RenderResult) =>
  wrapper.getByRole("button", {
    name: /Behandleren/,
  });

const getBehandlerExpanded = (wrapper: RenderResult) =>
  wrapper.getByRole("region", {
    name: /Behandleren/,
  });

describe("DeltakereSvarInfo dialogmote uten behandler", () => {
  let wrapper;
  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <DeltakereSvarInfo dialogmote={dialogmote} />
        </Provider>
      </QueryClientProvider>
    );
  });
  it("viser ikke ekspanderbart panel for svar fra behandler", () => {
    expect(wrapper.queryByText("Behandleren", { exact: false })).to.not.exist;
    expect(
      wrapper.queryByRole("button", {
        name: /Behandleren/,
      })
    ).to.not.exist;
    expect(
      wrapper.queryByRole("region", {
        name: /Behandleren/,
      })
    ).to.not.exist;
  });
});

describe("DeltakereSvarInfo dialogmote med behandler", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
  });
  describe("behandler har ikke svart på innkalling", () => {
    const dialogmoteMedUbesvartVarsel = dialogmoteBehandlerMedSvar([]);
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedUbesvartVarsel} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser at behandler ikke har gitt svar", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, har ikke gitt svar`;

      expect(wrapper.getByText("Behandleren:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser minus-sirkel ikon", () => {
      const behandlerExpandable = getBehandlerExpandableButton(wrapper);
      expect(
        within(behandlerExpandable).getByRole("img", {
          name: "minus-sirkel-ikon",
        })
      ).to.exist;
    });
    it("viser manglende begrunnelse-tekst", () => {
      const behandlerExpanded = getBehandlerExpanded(wrapper);
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
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedSvar} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser behandler 'kommer'", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, kommer - Svar mottatt 07.12.2021`;

      expect(wrapper.getByText("Behandleren:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser suksess-ikon", () => {
      const behandlerExpandable = getBehandlerExpandableButton(wrapper);
      expect(
        within(behandlerExpandable).getByRole("img", {
          name: "suksess-ikon",
        })
      ).to.exist;
    });
    it("viser manglende begrunnelse-tekst", () => {
      const behandlerExpanded = getBehandlerExpanded(wrapper);
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
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedSvar} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser behandler ønsker å avlyse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å avlyse - Svar mottatt 08.12.2021`;

      expect(wrapper.getByText("Behandleren:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser feil-ikon", () => {
      const behandlerExpandable = getBehandlerExpandableButton(wrapper);
      expect(
        within(behandlerExpandable).getByRole("img", {
          name: "feil-ikon",
        })
      ).to.exist;
    });
    it("viser begrunnelse", () => {
      const behandlerExpanded = getBehandlerExpanded(wrapper);
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
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedSvar} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser behandler ønsker å endre tid/sted", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å endre tidspunkt eller sted - Oppdatering mottatt 08.12.2021`;

      expect(wrapper.getByText("Behandleren:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser advarsel-ikon", () => {
      const behandlerExpandable = getBehandlerExpandableButton(wrapper);
      expect(
        within(behandlerExpandable).getByRole("img", {
          name: "advarsel-ikon",
        })
      ).to.exist;
    });
    it("viser begrunnelser fra siste og tidligere svar", () => {
      const behandlerExpanded = getBehandlerExpanded(wrapper);
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
        within(behandlerExpanded).queryByText(
          "Ingen detaljer er tilgjengelig.",
          { exact: false }
        )
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
    let wrapper;
    beforeEach(() => {
      wrapper = render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store(mockState)}>
            <DeltakereSvarInfo dialogmote={dialogmoteMedSvar} />
          </Provider>
        </QueryClientProvider>
      );
    });
    it("viser behandler ønsker å avlyse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å avlyse - Oppdatering mottatt 08.12.2021`;

      expect(wrapper.getByText("Behandleren:", { exact: false })).to.exist;
      expect(wrapper.getByText(expectedText, { exact: false })).to.exist;
    });
    it("viser feil-ikon", () => {
      const behandlerExpandable = getBehandlerExpandableButton(wrapper);
      expect(
        within(behandlerExpandable).getByRole("img", {
          name: "feil-ikon",
        })
      ).to.exist;
    });
    it("viser begrunnelse", () => {
      const behandlerExpanded = getBehandlerExpanded(wrapper);
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
        within(behandlerExpanded).queryByText(
          "Ingen detaljer er tilgjengelig.",
          { exact: false }
        )
      ).to.not.exist;
    });
  });
});
