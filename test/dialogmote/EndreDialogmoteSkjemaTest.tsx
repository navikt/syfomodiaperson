import { dialogmoteRoutePath } from "@/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import EndreDialogmoteSkjema, {
  MAX_LENGTH_ENDRE_BEGRUNNELSE,
  texts,
} from "@/sider/dialogmoter/components/endre/components/EndreDialogmoteSkjema";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { stubEndreApi } from "../stubs/stubIsdialogmote";
import {
  dialogmote,
  dialogmoteMedBehandler,
  endretMote,
  moteTekster,
  navEnhet,
} from "./testData";
import {
  DialogmoteDTO,
  EndreDialogmoteDTO,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedEndringDocuments } from "./testDataDocuments";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { renderWithRouter } from "../testRouterUtils";
import { stubFeatureTogglesApi } from "../stubs/stubUnleash";
import { queryClientWithMockData } from "../testQueryClient";
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";
import { Malform, MalformProvider } from "@/context/malform/MalformContext";
import { getEndreTexts } from "@/sider/dialogmoter/hooks/dialogmoteTexts";
import { StoreKey } from "@/hooks/useLocalStorageState";
import { behandlerLegoLasLegesen } from "@/mocks/isdialogmelding/behandlereDialogmeldingMock";

let queryClient: QueryClient;

describe("EndreDialogmoteSkjemaTest", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  afterEach(() => {
    localStorage.setItem(StoreKey.MALFORM, Malform.BOKMAL);
  });

  it("validerer begrunnelser og dato", async () => {
    renderEndreDialogmoteSkjema(dialogmote);

    await clickButton("Send");

    expect(await screen.findByText(texts.begrunnelseArbeidstakerMissing)).to
      .exist;
    expect(await screen.findByText(texts.begrunnelseArbeidsgiverMissing)).to
      .exist;
    expect(await screen.findByText(/Tidspunktet har passert/)).to.exist;
  });
  it("validerer begrunnelse til behandler når behandler er med", async () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);

    await clickButton("Send");

    expect(await screen.findByText(texts.begrunnelseBehandlerMissing)).to.exist;
  });
  it("valideringsmeldinger forsvinner ved utbedring", async () => {
    renderEndreDialogmoteSkjema(dialogmote);

    await clickButton("Send");

    expect(await screen.findByText(texts.begrunnelseArbeidstakerMissing)).to
      .exist;
    expect(await screen.findByText(texts.begrunnelseArbeidsgiverMissing)).to
      .exist;
    expect(await screen.findByText(/Tidspunktet har passert/)).to.exist;

    // Angi dato og begrunnelser
    const datoInput = screen.getByRole("textbox", {
      name: "Dato",
      hidden: true,
    });
    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren",
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder",
    );
    await changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker,
    );
    await changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver,
    );
    await changeTextInput(datoInput, endretMote.dato);
    await clickButton("Send");

    // Feilmeldinger forsvinner
    await waitFor(() => {
      expect(screen.queryByText(texts.begrunnelseArbeidstakerMissing)).to.not
        .exist;
    });
    await waitFor(() => {
      expect(screen.queryByText(texts.begrunnelseArbeidsgiverMissing)).to.not
        .exist;
    });
    await waitFor(() => {
      expect(screen.queryByText(/Tidspunktet har passert/)).to.not.exist;
    });

    // Fjern begrunnelser
    await changeTextInput(begrunnelseArbeidstakerInput, "");
    await changeTextInput(begrunnelseArbeidsgiverInput, "");

    // Feilmeldinger vises
    expect(await screen.findByText(texts.begrunnelseArbeidstakerMissing)).to
      .exist;
    expect(await screen.findByText(texts.begrunnelseArbeidsgiverMissing)).to
      .exist;
  });
  it("validerer maks lengde på begrunnelser", async () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren",
    );

    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder",
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    const tooLongFritekst = getTooLongText(MAX_LENGTH_ENDRE_BEGRUNNELSE);
    await changeTextInput(begrunnelseArbeidstakerInput, tooLongFritekst);
    await changeTextInput(begrunnelseArbeidsgiverInput, tooLongFritekst);
    await changeTextInput(begrunnelseBehandlerInput, tooLongFritekst);

    await clickButton("Send");

    expect(await screen.findAllByText("1 tegn for mye")).to.not.be.empty;
  });

  it("endrer møte ved submit", async () => {
    stubEndreApi(dialogmote.uuid);
    renderEndreDialogmoteSkjema(dialogmote);
    await passSkjemaInput();

    const expectedSendtDato = new Date();
    await clickButton("Send");

    await waitFor(() => {
      const endreMutation = queryClient.getMutationCache().getAll()[0];
      const expectedEndring = {
        arbeidsgiver: {
          begrunnelse: moteTekster.fritekstTilArbeidsgiver,
          endringsdokument: expectedEndringDocuments.arbeidsgiver(
            false,
            expectedSendtDato,
          ),
        },
        arbeidstaker: {
          begrunnelse: moteTekster.fritekstTilArbeidstaker,
          endringsdokument: expectedEndringDocuments.arbeidstaker(
            false,
            expectedSendtDato,
          ),
        },
        videoLink: endretMote.videolink,
        sted: endretMote.sted,
        tid: endretMote.datoTid,
      };
      expect(endreMutation.state.variables).to.deep.equal(expectedEndring);
    });
  });

  it("trimmer videolenke i endring som sendes til api", async () => {
    stubEndreApi(dialogmote.uuid);
    renderEndreDialogmoteSkjema(dialogmote);
    await passSkjemaInput();

    const link = "https://video.nav.no/abc";
    const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
    const linkWithWhitespace = `   ${link}  `;
    await changeTextInput(videoLinkInput, linkWithWhitespace);

    await clickButton("Send");

    let endreMutation;
    await waitFor(() => {
      endreMutation = queryClient.getMutationCache().getAll()[0];
      expect(endreMutation).to.exist;
    });

    const { videoLink, arbeidsgiver, arbeidstaker } = endreMutation.state
      .variables as unknown as EndreDialogmoteDTO;

    const linkDocumentComponents = [
      ...arbeidsgiver.endringsdokument,
      ...arbeidstaker.endringsdokument,
    ].filter((d) => d.type === DocumentComponentType.LINK);

    expect(linkDocumentComponents).to.have.length(2);
    linkDocumentComponents.forEach((documentComponentLink) =>
      expect(documentComponentLink.texts[0]).to.equal(link),
    );
    expect(videoLink).to.equal(link);
  });

  it("endrer møte med behandler ved submit når behandler er med", async () => {
    stubEndreApi(dialogmote.uuid);
    stubFeatureTogglesApi();
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    await passSkjemaInput();
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    await changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler,
    );

    const expectedSendtDato = new Date();
    await clickButton("Send");

    await waitFor(() => {
      const endreMutation = queryClient.getMutationCache().getAll()[0];
      const expectedEndring = {
        arbeidsgiver: {
          begrunnelse: moteTekster.fritekstTilArbeidsgiver,
          endringsdokument: expectedEndringDocuments.arbeidsgiver(
            true,
            expectedSendtDato,
          ),
        },
        arbeidstaker: {
          begrunnelse: moteTekster.fritekstTilArbeidstaker,
          endringsdokument: expectedEndringDocuments.arbeidstaker(
            true,
            expectedSendtDato,
          ),
        },
        behandler: {
          fritekst: moteTekster.fritekstTilBehandler,
          moteDokument: expectedEndringDocuments.behandler(expectedSendtDato),
        },
        videoLink: endretMote.videolink,
        sted: endretMote.sted,
        tid: endretMote.datoTid,
      };
      expect(endreMutation.state.variables).to.deep.equal(expectedEndring);
    });
  });
  describe("ny behandler", () => {
    it("legger til valgt behandler i endring som sendes til api", async () => {
      stubEndreApi(dialogmote.uuid);
      renderEndreDialogmoteSkjema(dialogmote);
      await passSkjemaInput();

      await userEvent.click(
        screen.getByRole("radio", { name: /Lego Las Legesen/ }),
      );
      await clickButton("Send");

      await waitFor(() => {
        const endreMutation = queryClient.getMutationCache().getAll()[0];
        const { behandler } = endreMutation.state
          .variables as unknown as EndreDialogmoteDTO;
        expect(behandler?.deltaker).to.deep.equal({
          personIdent: behandlerLegoLasLegesen.fnr,
          behandlerRef: behandlerLegoLasLegesen.behandlerRef,
          behandlerNavn: "Lego Las Legesen",
          behandlerKontor: behandlerLegoLasLegesen.kontor,
        });
        expect(behandler?.moteDokument).to.not.be.empty;
      });
    });

    it("validerer at behandler er valgt når søk er valgt", async () => {
      renderEndreDialogmoteSkjema(dialogmote);
      await passSkjemaInput();

      await userEvent.click(
        screen.getByRole("radio", { name: "Legg til en behandler" }),
      );
      await clickButton("Send");

      expect(await screen.findByText("Vennligst velg behandler")).to.exist;
      expect(queryClient.getMutationCache().getAll()).to.be.empty;
    });
  });

  it("forhåndsviser endret tid og sted til arbeidstaker", async () => {
    renderEndreDialogmoteSkjema(dialogmote);
    await passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    const expectedSendtDato = new Date();
    await userEvent.click(previewButtons[0]);

    const forhandsvisningEndringArbeidstaker = screen.getByRole("dialog", {
      name: texts.forhandsvisningArbeidstakerContentLabel,
      hidden: true,
    });

    expect(
      within(forhandsvisningEndringArbeidstaker).getByRole("heading", {
        name: texts.forhandsvisningArbeidstakerTitle,
        hidden: true,
      }),
    ).to.exist;
    expect(
      within(forhandsvisningEndringArbeidstaker).getByRole("heading", {
        name: texts.forhandsvisningSubtitle,
        hidden: true,
      }),
    ).to.exist;
    expectedEndringDocuments
      .arbeidstaker(false, expectedSendtDato)
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringArbeidstaker).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser endret tid og sted til arbeidsgiver", async () => {
    renderEndreDialogmoteSkjema(dialogmote);
    await passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    const expectedSendtDato = new Date();
    await userEvent.click(previewButtons[1]);

    const forhandsvisningEndringArbeidsgiver = screen.getByRole("dialog", {
      name: texts.forhandsvisningArbeidsgiverContentLabel,
      hidden: true,
    });

    expect(
      within(forhandsvisningEndringArbeidsgiver).getByRole("heading", {
        name: texts.forhandsvisningArbeidsgiverTitle,
        hidden: true,
      }),
    ).to.exist;
    expect(
      within(forhandsvisningEndringArbeidsgiver).getByRole("heading", {
        name: texts.forhandsvisningSubtitle,
        hidden: true,
      }),
    ).to.exist;
    expectedEndringDocuments
      .arbeidsgiver(false, expectedSendtDato)
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringArbeidsgiver).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser endret tid og sted til behandler når behandler er med", async () => {
    stubFeatureTogglesApi();
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    await passSkjemaInput();
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    await changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler,
    );

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(3);
    const expectedSendtDato = new Date();
    await userEvent.click(previewButtons[2]);

    const forhandsvisningEndringBehandler = screen.getByRole("dialog", {
      name: texts.forhandsvisningBehandlerContentLabel,
      hidden: true,
    });

    expect(
      within(forhandsvisningEndringBehandler).getByRole("heading", {
        name: texts.forhandsvisningBehandlerTitle,
        hidden: true,
      }),
    ).to.exist;

    expectedEndringDocuments
      .behandler(expectedSendtDato)
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringBehandler).getByText(text)).to
          .exist;
      });
  });

  it("forhåndsviser endring med nynorsktekster hvis dette er valgt", async () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    await passSkjemaInput();

    const malformRadioNynorsk = screen.getByRole("radio", {
      name: "Nynorsk",
    });
    await userEvent.click(malformRadioNynorsk);

    const forhandsvisningButton = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    })[0];
    await userEvent.click(forhandsvisningButton);

    expect(screen.getByText(getEndreTexts(Malform.NYNORSK).intro2)).to.exist;
  });
});

const renderEndreDialogmoteSkjema = (dialogmote: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MalformProvider>
          <EndreDialogmoteSkjema dialogmote={dialogmote} />
        </MalformProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    `${dialogmoteRoutePath}/:dialogmoteUuid/endre`,
    [`${dialogmoteRoutePath}/${dialogmote.uuid}/endre`],
  );
};

const passSkjemaInput = async () => {
  const datoInput = getTextInput("Dato");
  const klokkeslettInput = screen.getByLabelText("Klokkeslett");
  const stedInput = getTextInput("Sted");
  const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
  const begrunnelseArbeidstakerInput = getTextInput(
    "Begrunnelse til arbeidstakeren",
  );
  const begrunnelseArbeidsgiverInput = getTextInput(
    "Begrunnelse til nærmeste leder",
  );
  await changeTextInput(datoInput, endretMote.dato);
  fireEvent.blur(datoInput);
  await changeTextInput(klokkeslettInput, endretMote.klokkeslett);
  await changeTextInput(stedInput, endretMote.sted);
  await changeTextInput(videoLinkInput, endretMote.videolink);
  await changeTextInput(
    begrunnelseArbeidstakerInput,
    moteTekster.fritekstTilArbeidstaker,
  );
  await changeTextInput(
    begrunnelseArbeidsgiverInput,
    moteTekster.fritekstTilArbeidsgiver,
  );
};
