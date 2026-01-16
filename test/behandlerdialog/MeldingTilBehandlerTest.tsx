import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { beforeEach, describe, expect, it } from "vitest";
import { MeldingTilBehandler } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandler";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import {
  MeldingTilBehandlerDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { behandlereDialogmeldingMock } from "@/mocks/isdialogmelding/behandlereDialogmeldingMock";
import userEvent from "@testing-library/user-event";
import {
  expectedLegeerklaringDocument,
  expectedMeldingFraNAVDocument,
  expectedTilleggsopplysningerDocument,
} from "./testDataDocuments";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { oppfolgingstilfellePersonMock } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { OppfolgingstilfellePersonDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

let queryClient: QueryClient;

const renderMeldingTilBehandler = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MeldingTilBehandler />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

const enMeldingTekst = "En testmelding";

describe("MeldingTilBehandler", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser overskrift og warning-alert for kopi til bruker dersom ikke aktivt oppfølgingstilfelle", () => {
    const emptyOppfolgingstilfellePersonMock: OppfolgingstilfellePersonDTO = {
      ...oppfolgingstilfellePersonMock,
      oppfolgingstilfelleList: [],
    };
    queryClient.setQueryData(
      oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => emptyOppfolgingstilfellePersonMock
    );

    renderMeldingTilBehandler();

    const alertText =
      "Personen har ikke et aktivt sykefravær. Dialogmeldingen skal kun benyttes i sykefraværsoppfølgingen. Meldingen vises til innbyggeren på Min side.";

    expect(screen.getByRole("heading", { name: "Dialogmelding til behandler" }))
      .to.exist;
    expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
    expect(screen.getByText(alertText)).to.exist;
  });

  const selectLabel = "Hvilken meldingstype ønsker du å sende?";

  describe("MeldingTilBehandlerSkjema", () => {
    it("Viser select komponent for valg av meldingstype", () => {
      renderMeldingTilBehandler();

      expect(screen.getByLabelText(selectLabel)).to.exist;

      fireEvent.change(screen.getByLabelText(selectLabel), {
        target: { value: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER },
      });

      const selectElement: HTMLSelectElement =
        screen.getByLabelText(selectLabel);

      expect(selectElement.value).to.equal(
        MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER
      );
      expect(selectElement.value).to.not.equal(
        MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING
      );

      fireEvent.change(screen.getByLabelText(selectLabel), {
        target: { value: MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING },
      });

      expect(selectElement.value).to.equal(
        MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING
      );
      expect(selectElement.value).to.not.equal(
        MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER
      );
    });

    it("Viser informasjon om meldingstype legeerklaring hvis valgt", () => {
      renderMeldingTilBehandler();

      const legeerklaringText =
        "Legeerklæring vedrørende pasienten. Behandleren honoreres med takst L40.";
      expect(screen.queryByText(legeerklaringText)).to.not.exist;

      fireEvent.change(screen.getByLabelText(selectLabel), {
        target: { value: MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING },
      });

      expect(screen.getByText(legeerklaringText)).to.exist;
    });

    it("Viser radiobuttons med behandlervalg, der det ikke er mulig å velge 'Ingen behandler'", async () => {
      renderMeldingTilBehandler();

      await waitFor(
        () => expect(screen.queryByText("Ingen behandler")).to.not.exist
      );
      expect(screen.getByText("Søk etter behandler")).to.exist;
    });

    it("Viser behandlersøk ved klikk på radiobutton 'Søk etter behandler'", async () => {
      renderMeldingTilBehandler();

      const sokBehandlerRadioButton = await screen.findByRole("radio", {
        name: "Søk etter behandler",
      });
      await userEvent.click(sokBehandlerRadioButton);

      expect(
        screen.getByText("Finner du ikke behandleren du leter etter?", {
          exact: false,
        })
      ).to.exist;
    });

    it("Forhåndsviser tilleggsopplysninger-melding ved klikk på Forhåndsvisning-knapp", async () => {
      renderMeldingTilBehandler();

      fireEvent.change(screen.getByLabelText(selectLabel), {
        target: { value: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER },
      });

      const meldingInput = getTextInput(
        "Skriv inn teksten du ønsker å sende til behandler"
      );
      changeTextInput(meldingInput, enMeldingTekst);

      const previewButton = screen.getByRole("button", {
        name: "Forhåndsvisning",
      });
      await userEvent.click(previewButton);

      const previewModal = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(previewModal).to.exist;

      const expectedTexts = expectedTilleggsopplysningerDocument(
        enMeldingTekst
      ).flatMap((documentComponent) => documentComponent.texts);
      expectedTexts.forEach((text) => {
        expect(within(previewModal).getByText(text)).to.exist;
      });
    });

    it("Forhåndsviser legeerklæring-melding ved klikk på Forhåndsvisning-knapp", async () => {
      renderMeldingTilBehandler();

      fireEvent.change(screen.getByLabelText(selectLabel), {
        target: { value: MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING },
      });

      const meldingInput = getTextInput(
        "Skriv inn teksten du ønsker å sende til behandler"
      );
      changeTextInput(meldingInput, enMeldingTekst);

      const previewButton = screen.getByRole("button", {
        name: "Forhåndsvisning",
      });
      await userEvent.click(previewButton);

      const previewModal = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(previewModal).to.exist;

      const expectedTexts = expectedLegeerklaringDocument(
        enMeldingTekst
      ).flatMap((documentComponent) => documentComponent.texts);
      expectedTexts.forEach((text) => {
        expect(within(previewModal).getByText(text)).to.exist;
      });
    });

    it("Forhåndsviser melding fra Nav-melding ved klikk på Forhåndsvisning-knapp", async () => {
      renderMeldingTilBehandler();
      fireEvent.change(screen.getByLabelText(selectLabel), {
        target: { value: MeldingType.HENVENDELSE_MELDING_FRA_NAV },
      });

      const meldingInput = getTextInput(
        "Skriv inn teksten du ønsker å sende til behandler"
      );
      changeTextInput(meldingInput, enMeldingTekst);

      const previewButton = screen.getByRole("button", {
        name: "Forhåndsvisning",
      });
      await userEvent.click(previewButton);

      const previewModal = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(previewModal).to.exist;

      const expectedTexts = expectedMeldingFraNAVDocument(
        enMeldingTekst
      ).flatMap((documentComponent) => documentComponent.texts);
      expectedTexts.forEach((text) => {
        expect(within(previewModal).getByText(text)).to.exist;
      });
    });

    it("Validerer MeldingTilBehandlerSkjema ved innsending", async () => {
      renderMeldingTilBehandler();

      await clickButton("Send til behandler");

      await waitFor(() => {
        expect(screen.getByText("Vennligst angi meldingstekst")).to.exist;
      });
      await waitFor(() => {
        expect(screen.getByText("Vennligst velg behandler")).to.exist;
      });

      const meldingInput = getTextInput(
        "Skriv inn teksten du ønsker å sende til behandler"
      );
      changeTextInput(meldingInput, enMeldingTekst);
      await waitFor(() => {
        expect(screen.queryByText("Vennligst angi meldingstekst")).to.not.exist;
      });

      const velgBehandlerRadioButton = screen.getAllByText("Fastlege:", {
        exact: false,
      })[0];
      fireEvent.click(velgBehandlerRadioButton);
      await waitFor(() => {
        expect(screen.queryByText("Vennligst velg behandler")).to.not.exist;
      });
    });
  });

  describe("MeldingTilBehandler innsending", () => {
    const expectedMeldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER,
      behandlerIdent: behandlereDialogmeldingMock[0].fnr,
      behandlerNavn: `${behandlereDialogmeldingMock[0].fornavn} ${behandlereDialogmeldingMock[0].mellomnavn} ${behandlereDialogmeldingMock[0].etternavn}`,
      behandlerRef: behandlereDialogmeldingMock[0].behandlerRef,
      tekst: enMeldingTekst,
      document: expectedTilleggsopplysningerDocument(enMeldingTekst),
    };

    it("Send melding med verdier fra skjema", async () => {
      renderMeldingTilBehandler();

      const velgBehandlerRadioButton = screen.getAllByText("Fastlege:", {
        exact: false,
      })[0];
      fireEvent.click(velgBehandlerRadioButton);

      fireEvent.change(screen.getByLabelText(selectLabel), {
        target: { value: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER },
      });

      const meldingInput = getTextInput(
        "Skriv inn teksten du ønsker å sende til behandler"
      );
      changeTextInput(meldingInput, expectedMeldingTilBehandlerDTO.tekst);

      await clickButton("Send til behandler");

      await waitFor(() => {
        const meldingTilBehandlerMutation = queryClient
          .getMutationCache()
          .getAll()[0];

        expect(meldingTilBehandlerMutation.state.variables).to.deep.equal(
          expectedMeldingTilBehandlerDTO
        );
      });
    });
  });
});
