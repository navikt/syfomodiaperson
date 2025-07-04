import React from "react";
import Referat, {
  MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE,
  MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE,
  MAX_LENGTH_BEHANDLERS_OPPGAVE,
  MAX_LENGTH_KONKLUSJON,
  MAX_LENGTH_SITUASJON,
  MAX_LENGTH_VEILEDERS_OPPGAVE,
  ReferatMode,
  texts as referatSkjemaTexts,
  valideringsTexts as referatSkjemaValideringsTexts,
} from "../../src/sider/dialogmoter/components/referat/Referat";
import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubFerdigstillApi } from "../stubs/stubIsdialogmote";
import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  arbeidstaker,
  behandlerDeltakerTekst,
  dialogmote,
  dialogmoteMedBehandler,
  moteTekster,
  narmesteLederNavn,
  veileder,
} from "./testData";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedReferatDocument } from "./testDataDocuments";
import { queryClientWithMockData } from "../testQueryClient";
import { getReferatTexts } from "@/sider/dialogmoter/hooks/dialogmoteTexts";
import { NewDialogmoteReferatDTO } from "@/sider/dialogmoter/types/dialogmoteReferatTypes";
import { renderWithRouter } from "../testRouterUtils";
import { Malform, MalformProvider } from "@/context/malform/MalformContext";
import { StoreKey } from "@/hooks/useLocalStorageState";

let queryClient: QueryClient;

describe("ReferatTest", () => {
  const referatTexts = getReferatTexts(Malform.BOKMAL);

  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  afterEach(() => {
    localStorage.setItem(StoreKey.MALFORM, Malform.BOKMAL);
  });

  it("viser arbeidstaker, dato og sted i tittel", () => {
    renderReferat(dialogmote);

    expect(
      screen.getByRole("heading", {
        name: `${arbeidstaker.navn}, 10. mai 2021, Videomøte`,
      })
    ).to.exist;
  });

  it("viser alle deltakere forhåndsutfylt med 'Fra arbeidsgiver' redigerbar og påkrevd", async () => {
    renderReferat(dialogmote);

    expect(
      screen.getByRole("heading", { name: `Fra Nav: ${veileder.fulltNavn()}` })
    ).to.exist;
    expect(
      screen.getByRole("heading", {
        name: `Arbeidstaker: ${arbeidstaker.navn}`,
      })
    ).to.exist;
    expect(
      screen.getByRole("heading", {
        name: `Fra arbeidsgiver: ${narmesteLederNavn}`,
      })
    ).to.exist;

    expect(
      screen.getByRole("region", {
        name: "Fra arbeidsgiver: Tatten Tattover",
      })
    ).to.exist;

    const getFraArbeidsgiverInput = () => screen.getByLabelText("Navn");

    // Sjekk at 'Fra arbeidsgiver' valideres
    changeTextInput(getFraArbeidsgiverInput(), "");
    await clickButton("Lagre og send");
    expect(
      screen.getAllByText(
        referatSkjemaTexts.deltakere.arbeidsgiverDeltakerMissing
      )
    ).to.not.be.empty;

    // Sjekk at 'Fra arbeidsgiver' kan endres
    const endretFraArbeidsgiver = "Ny Leder";
    changeTextInput(getFraArbeidsgiverInput(), endretFraArbeidsgiver);
    expect(
      await screen.findByRole("heading", {
        name: `Fra arbeidsgiver: Ny Leder`,
      })
    ).to.exist;
  });

  it("viser behandler som deltaker når behandler er med", () => {
    renderReferat(dialogmoteMedBehandler);

    expect(screen.getByRole("heading", { name: behandlerDeltakerTekst })).to
      .exist;

    expect(
      screen.getByRole("region", {
        name: behandlerDeltakerTekst,
      })
    ).to.exist;

    const behandlerDeltokInput: HTMLInputElement = screen.getByLabelText(
      referatSkjemaTexts.deltakere.behandlerDeltokLabel
    );
    expect(behandlerDeltokInput.checked).to.be.true;
    const behandlerMottarReferatInput: HTMLInputElement = screen.getByLabelText(
      referatSkjemaTexts.deltakere.behandlerMottaReferatLabel
    );
    expect(behandlerMottarReferatInput.checked).to.be.true;
  });

  it("kan endre behandlers deltakelse", async () => {
    stubFerdigstillApi(dialogmoteMedBehandler.uuid);
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();

    // Fjern avkrysning på deltakelse og motta referat
    const behandlerDeltokCheckbox: HTMLInputElement = screen.getByLabelText(
      referatSkjemaTexts.deltakere.behandlerDeltokLabel
    );
    await userEvent.click(behandlerDeltokCheckbox);
    const behandlerMottaReferatCheckbox: HTMLInputElement =
      screen.getByLabelText(
        referatSkjemaTexts.deltakere.behandlerMottaReferatLabel
      );
    await userEvent.click(behandlerMottaReferatCheckbox);

    await clickButton("Lagre og send");

    // Sjekk behandlers deltakelse-felter og brev
    const ferdigstillMutation = queryClient.getMutationCache().getAll().pop();
    const newReferat = ferdigstillMutation?.state
      .variables as unknown as NewDialogmoteReferatDTO;
    expect(newReferat).to.deep.include({
      behandlerDeltatt: false,
      behandlerMottarReferat: false,
    });
    const documentDeltakereTexts = newReferat.document.find(
      (d) => d.title === referatTexts.deltakereTitle
    )?.texts;
    expect(documentDeltakereTexts).to.deep.include(
      `${behandlerDeltakerTekst}, deltok ikke`
    );
  });

  it("validerer alle fritekstfelter unntatt veileders oppgave", async () => {
    renderReferat(dialogmote);

    await clickButton("Lagre og send");

    expect(screen.getAllByText(referatSkjemaValideringsTexts.situasjonMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(referatSkjemaValideringsTexts.konklusjonMissing))
      .to.not.be.empty;
    expect(
      screen.getAllByText(
        referatSkjemaValideringsTexts.arbeidstakersOppgaveMissing
      )
    ).to.not.be.empty;
    expect(
      screen.getAllByText(
        referatSkjemaValideringsTexts.arbeidsgiversOppgaveMissing
      )
    ).to.not.be.empty;
  });

  it("validerer navn og funksjon på andre deltakere", async () => {
    renderReferat(dialogmote);

    await clickButton("Pluss ikon Legg til en deltaker");
    await clickButton("Lagre og send");

    // Feilmeldinger i skjema
    expect(
      screen.getAllByText(
        referatSkjemaTexts.deltakere.andreDeltakereMissingNavn
      )
    ).to.not.be.empty;
    expect(
      screen.getAllByText(
        referatSkjemaTexts.deltakere.andreDeltakereMissingFunksjon
      )
    ).to.not.be.empty;

    // Slett deltaker og sjekk at feil forsvinner
    await clickButton("Slett ikon");
    expect(
      screen.queryAllByText(
        referatSkjemaTexts.deltakere.andreDeltakereMissingNavn
      )
    ).to.be.empty;
    expect(
      screen.queryAllByText(
        referatSkjemaTexts.deltakere.andreDeltakereMissingFunksjon
      )
    ).to.be.empty;
  });

  it("validerer maks lengde på fritekstfelter", () => {
    renderReferat(dialogmoteMedBehandler);

    const situasjonInput = getTextInput("Situasjon og muligheter");
    const konklusjonInput = getTextInput("Konklusjon");
    const arbeidstakerInput = getTextInput("Arbeidstakerens oppgave:");
    const arbeidsgiverInput = getTextInput("Arbeidsgiverens oppgave:");
    const behandlerInput = getTextInput("Behandlerens oppgave (valgfri):");
    const veilederInput = getTextInput("Veilederens oppgave (valgfri):");
    changeTextInput(situasjonInput, getTooLongText(MAX_LENGTH_SITUASJON));
    changeTextInput(konklusjonInput, getTooLongText(MAX_LENGTH_KONKLUSJON));
    changeTextInput(
      arbeidstakerInput,
      getTooLongText(MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE)
    );
    changeTextInput(
      arbeidsgiverInput,
      getTooLongText(MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE)
    );
    changeTextInput(
      behandlerInput,
      getTooLongText(MAX_LENGTH_BEHANDLERS_OPPGAVE)
    );
    changeTextInput(
      veilederInput,
      getTooLongText(MAX_LENGTH_VEILEDERS_OPPGAVE)
    );

    clickButton("Lagre og send");
  });

  it("ferdigstiller dialogmote ved submit av skjema", async () => {
    stubFerdigstillApi(dialogmoteMedBehandler.uuid);
    renderReferat(dialogmoteMedBehandler);

    passSkjemaTekstInput();

    await clickButton("Pluss ikon Legg til en deltaker");
    const annenDeltakerNavnInput = getTextInput("Navn");
    const annenDeltakerFunksjonInput = getTextInput("Funksjon");
    changeTextInput(annenDeltakerNavnInput, annenDeltakerNavn);
    changeTextInput(annenDeltakerFunksjonInput, annenDeltakerFunksjon);

    const expectedSendtDato = new Date();
    await clickButton("Lagre og send");

    const ferdigstillMutation = queryClient.getMutationCache().getAll().pop();
    const expectedFerdigstilling = {
      narmesteLederNavn: narmesteLederNavn,
      situasjon: moteTekster.situasjonTekst,
      konklusjon: moteTekster.konklusjonTekst,
      arbeidsgiverOppgave: moteTekster.arbeidsgiversOppgave,
      arbeidstakerOppgave: moteTekster.arbeidstakersOppgave,
      behandlerDeltatt: true,
      behandlerMottarReferat: true,
      behandlerOppgave: moteTekster.behandlersOppgave,
      veilederOppgave: moteTekster.veiledersOppgave,
      document: expectedReferatDocument(expectedSendtDato),
      andreDeltakere: [
        { funksjon: annenDeltakerFunksjon, navn: annenDeltakerNavn },
      ],
    };
    expect(ferdigstillMutation?.state.variables).to.deep.equal(
      expectedFerdigstilling
    );
  });

  it("forhåndsviser referat", async () => {
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();

    await clickButton("Pluss ikon Legg til en deltaker");
    const annenDeltakerNavnInput = getTextInput("Navn");
    const annenDeltakerFunksjonInput = getTextInput("Funksjon");
    changeTextInput(annenDeltakerNavnInput, annenDeltakerNavn);
    changeTextInput(annenDeltakerFunksjonInput, annenDeltakerFunksjon);

    const expectedSendtDato = new Date();
    await clickButton("Forhåndsvisning");
    const forhandsvisningReferat = screen.getByRole("dialog", {
      hidden: true,
    });

    expectedReferatDocument(expectedSendtDato)
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningReferat).getByText(text)).to.exist;
      });
  });

  it("forhåndsviser referat med nynorsktekster hvis dette er valgt", async () => {
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();

    const malformRadioNynorsk = screen.getByRole("radio", {
      name: "Nynorsk",
    });
    await userEvent.click(malformRadioNynorsk);

    await clickButton("Forhåndsvisning");

    expect(screen.getByText(getReferatTexts(Malform.NYNORSK).intro2)).to.exist;
  });
});

const renderReferat = (dialogmoteDTO: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <MalformProvider>
        <Referat dialogmote={dialogmoteDTO} mode={ReferatMode.NYTT} />
      </MalformProvider>
    </QueryClientProvider>,
    `${dialogmoteRoutePath}/:dialogmoteUuid/referat`,
    [`${dialogmoteRoutePath}/${dialogmoteDTO.uuid}/referat`]
  );
};

const passSkjemaTekstInput = () => {
  const situasjonInput = getTextInput("Situasjon og muligheter");
  const konklusjonInput = getTextInput("Konklusjon");
  const arbeidstakerInput = getTextInput("Arbeidstakerens oppgave:");
  const arbeidsgiverInput = getTextInput("Arbeidsgiverens oppgave:");
  const behandlerInput = getTextInput("Behandlerens oppgave (valgfri):");
  const veilederInput = getTextInput("Veilederens oppgave (valgfri):");
  changeTextInput(situasjonInput, moteTekster.situasjonTekst);
  changeTextInput(konklusjonInput, moteTekster.konklusjonTekst);
  changeTextInput(arbeidstakerInput, moteTekster.arbeidstakersOppgave);
  changeTextInput(arbeidsgiverInput, moteTekster.arbeidsgiversOppgave);
  changeTextInput(behandlerInput, moteTekster.behandlersOppgave);
  changeTextInput(veilederInput, moteTekster.veiledersOppgave);
};
