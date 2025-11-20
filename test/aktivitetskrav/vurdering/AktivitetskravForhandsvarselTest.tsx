import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../../dialogmote/testData";
import { getForhandsvarselFrist } from "@/utils/forhandsvarselUtils";
import React from "react";
import { VurderAktivitetskrav } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { queryClientWithMockData } from "../../testQueryClient";
import {
  changeTextInput,
  clickButton,
  clickTab,
  getTextInput,
  getTooLongText,
  daysFromToday,
} from "../../testUtils";
import {
  AktivitetskravDTO,
  SendForhandsvarselDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { beforeEach, describe, expect, it } from "vitest";
import { getSendForhandsvarselDocument } from "../vurderingDocumentsTestUtils";
import {
  stubVurderAktivitetskravApi,
  stubVurderAktivitetskravForhandsvarselApi,
} from "../../stubs/stubIsaktivitetskrav";
import { NotificationContext } from "@/context/notification/NotificationContext";
import { Brevmal } from "@/data/aktivitetskrav/forhandsvarselTexts";
import {
  aktivitetskrav,
  enLangBeskrivelse,
  expiredForhandsvarselAktivitetskrav,
  forhandsvarselAktivitetskrav,
  tabTexts,
} from "./vurderingTestUtils";

let queryClient: QueryClient;

const renderVurderAktivitetskrav = (aktivitetskravDto: AktivitetskravDTO) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationContext.Provider
          value={{ notification: undefined, setNotification: () => void 0 }}
        >
          <VurderAktivitetskrav aktivitetskrav={aktivitetskravDto} />
        </NotificationContext.Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

const expectedFrist = getForhandsvarselFrist();

describe("VurderAktivitetskrav forhåndsvarsel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  describe("Send forhåndsvarsel", () => {
    it("Does not show AVVENT or FORHANDSVARSEL choice when forhandsvarsel is sent", () => {
      renderVurderAktivitetskrav(forhandsvarselAktivitetskrav);

      expect(screen.queryByRole("tab", { name: "Sett unntak" })).to.exist;
      expect(screen.queryByRole("tab", { name: "Er i aktivitet" })).to.exist;
      expect(screen.queryByRole("tab", { name: "Send forhåndsvarsel" })).to.not
        .exist;
      expect(screen.queryByRole("tab", { name: "Ikke oppfylt" })).to.not.exist;
      expect(screen.queryByRole("button", { name: "Avvent" })).to.not.exist;
    });

    it("Viser select for valg av mal med 'Med arbeidsgiver' forhåndsvalgt", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      await clickTab(tabTexts["FORHANDSVARSEL"]);

      const velgMalSelect = screen.getByRole("combobox");
      expect(
        within(velgMalSelect).getByRole("option", { name: "Har arbeidsgiver" })
      ).to.exist;
      expect(
        within(velgMalSelect).getByRole("option", {
          name: "Har ikke arbeidsgiver",
        })
      ).to.exist;
      expect(screen.getByDisplayValue("Har arbeidsgiver")).to.exist;
      expect(screen.queryByDisplayValue("Har ikke arbeidsgiver")).to.not.exist;
    });

    it("Send forhåndsvarsel with beskrivelse filled in, and reset form after submit", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      stubVurderAktivitetskravForhandsvarselApi(aktivitetskrav.uuid);
      const beskrivelseLabel = "Begrunnelse (obligatorisk)";

      await clickTab(tabTexts["FORHANDSVARSEL"]);

      expect(
        screen.getByRole("heading", {
          name: "Send forhåndsvarsel",
        })
      ).to.exist;

      expect(screen.getByRole("textbox", { name: beskrivelseLabel })).to.exist;
      expect(screen.getByText("Forhåndsvisning")).to.exist;

      const beskrivelseInput = getTextInput(beskrivelseLabel);
      changeTextInput(beskrivelseInput, enLangBeskrivelse);

      await clickButton("Send");

      let sendForhandsvarselMutation;
      await waitFor(() => {
        sendForhandsvarselMutation = queryClient.getMutationCache().getAll()[0];
        expect(sendForhandsvarselMutation).to.exist;
      });
      const vurdering = sendForhandsvarselMutation.state
        .variables as unknown as SendForhandsvarselDTO;
      const expectedVurdering: SendForhandsvarselDTO = {
        fritekst: enLangBeskrivelse,
        document: getSendForhandsvarselDocument(enLangBeskrivelse),
        frist: expectedFrist.toISOString().substring(0, 10),
      };
      expect(vurdering.fritekst).to.deep.equal(expectedVurdering.fritekst);
      expect(vurdering.document).to.deep.equal(expectedVurdering.document);
      expect(vurdering.frist).to.deep.equal(expectedVurdering.frist);

      await waitFor(
        () => expect(screen.queryByText(enLangBeskrivelse)).to.not.exist
      );
    });

    it("Send forhåndsvarsel with mal 'Uten arbeidsgiver'", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      stubVurderAktivitetskravForhandsvarselApi(aktivitetskrav.uuid);
      const beskrivelseLabel = "Begrunnelse (obligatorisk)";

      await clickTab(tabTexts["FORHANDSVARSEL"]);

      expect(
        screen.getByRole("heading", {
          name: "Send forhåndsvarsel",
        })
      ).to.exist;

      expect(screen.getByRole("textbox", { name: beskrivelseLabel })).to.exist;
      expect(screen.getByText("Forhåndsvisning")).to.exist;

      const beskrivelseInput = getTextInput(beskrivelseLabel);
      changeTextInput(beskrivelseInput, enLangBeskrivelse);

      const velgMalSelect = screen.getByRole("combobox");
      fireEvent.change(velgMalSelect, {
        target: { value: "UTEN_ARBEIDSGIVER" },
      });

      await clickButton("Send");

      let sendForhandsvarselMutation;
      await waitFor(() => {
        sendForhandsvarselMutation = queryClient.getMutationCache().getAll()[0];
        expect(sendForhandsvarselMutation).to.exist;
      });
      const vurdering = sendForhandsvarselMutation.state
        .variables as unknown as SendForhandsvarselDTO;
      const expectedVurdering: SendForhandsvarselDTO = {
        fritekst: enLangBeskrivelse,
        document: getSendForhandsvarselDocument(
          enLangBeskrivelse,
          Brevmal.UTEN_ARBEIDSGIVER
        ),
        frist: expectedFrist.toISOString().substring(0, 10),
      };
      expect(vurdering.fritekst).to.deep.equal(expectedVurdering.fritekst);
      expect(vurdering.document).to.deep.equal(expectedVurdering.document);
      expect(vurdering.frist).to.deep.equal(expectedVurdering.frist);

      await waitFor(
        () => expect(screen.queryByText(enLangBeskrivelse)).to.not.exist
      );
    });

    it("Send forhåndsvarsel with mal 'Bosatt i Norge'", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      stubVurderAktivitetskravForhandsvarselApi(aktivitetskrav.uuid);
      const beskrivelseLabel = "Begrunnelse (obligatorisk)";

      await clickTab(tabTexts["FORHANDSVARSEL"]);

      expect(
        screen.getByRole("heading", {
          name: "Send forhåndsvarsel",
        })
      ).to.exist;

      expect(screen.getByRole("textbox", { name: beskrivelseLabel })).to.exist;
      expect(screen.getByText("Forhåndsvisning")).to.exist;

      const beskrivelseInput = getTextInput(beskrivelseLabel);
      changeTextInput(beskrivelseInput, enLangBeskrivelse);

      const velgMalSelect = screen.getByRole("combobox");
      fireEvent.change(velgMalSelect, {
        target: { value: "UTLAND" },
      });

      await clickButton("Send");

      let sendForhandsvarselMutation;
      await waitFor(() => {
        sendForhandsvarselMutation = queryClient.getMutationCache().getAll()[0];
        expect(sendForhandsvarselMutation).to.exist;
      });
      const vurdering = sendForhandsvarselMutation.state
        .variables as unknown as SendForhandsvarselDTO;
      const expectedVurdering: SendForhandsvarselDTO = {
        fritekst: enLangBeskrivelse,
        document: getSendForhandsvarselDocument(
          enLangBeskrivelse,
          Brevmal.UTLAND
        ),
        frist: expectedFrist.toISOString().substring(0, 10),
      };
      expect(vurdering.fritekst).to.deep.equal(expectedVurdering.fritekst);
      expect(vurdering.document).to.deep.equal(expectedVurdering.document);
      expect(vurdering.frist).to.deep.equal(expectedVurdering.frist);

      await waitFor(
        () => expect(screen.queryByText(enLangBeskrivelse)).to.not.exist
      );
    });

    it("INNSTILLING_OM_STANS is present when status is forhandsvarsel and it is expired", async () => {
      renderVurderAktivitetskrav(expiredForhandsvarselAktivitetskrav);
      stubVurderAktivitetskravApi(expiredForhandsvarselAktivitetskrav.uuid);

      await clickTab("Skriv innstilling om stans");

      expect(
        screen.getByRole("heading", {
          name: "Skriv innstilling om stans til Nav arbeid og ytelser",
        })
      ).to.exist;
    });
    it("Fails to send forhåndsvarsel when no beskrivelse is filled in", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      await clickTab(tabTexts["FORHANDSVARSEL"]);
      await clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });
    it("Validerer maks tegn beskrivelse", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      await clickTab(tabTexts["FORHANDSVARSEL"]);

      const tooLongBeskrivelse = getTooLongText(5000);
      const beskrivelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      await clickButton("Send");

      expect(await screen.findByText("1 tegn for mye")).to.exist;
    });
    it("Tillater valg av fristDato innenfor 3-6 uker og sender valgt frist", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      stubVurderAktivitetskravForhandsvarselApi(aktivitetskrav.uuid);
      await clickTab(tabTexts["FORHANDSVARSEL"]);
      const beskrivelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(beskrivelseInput, enLangBeskrivelse);
      const fristInput = screen.getByRole("textbox", { name: /Svarfrist/ });
      const pad = (n: number) => n.toString().padStart(2, "0");
      const targetDate = daysFromToday(25);
      const formatted = `${pad(targetDate.getDate())}.${pad(
        targetDate.getMonth() + 1
      )}.${targetDate.getFullYear()}`;
      changeTextInput(fristInput, formatted);
      fireEvent.blur(fristInput);
      await clickButton("Send");
      let sendForhandsvarselMutation;
      await waitFor(() => {
        sendForhandsvarselMutation = queryClient.getMutationCache().getAll()[0];
        expect(sendForhandsvarselMutation).to.exist;
      });
      const vurdering = sendForhandsvarselMutation.state
        .variables as unknown as SendForhandsvarselDTO;
      const expectedFristString = `${targetDate.getFullYear()}-${(
        targetDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${targetDate.getDate().toString().padStart(2, "0")}`;
      expect(vurdering.frist).to.equal(expectedFristString);
    });
    it("Viser feil ved ugyldig datoformat i fristdato", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      await clickTab(tabTexts["FORHANDSVARSEL"]);
      const fristInput = screen.getByRole("textbox", { name: /Svarfrist/ });
      changeTextInput(fristInput, "2025/01/01");
      fireEvent.blur(fristInput);
      expect(await screen.findByText("Ugyldig datoformat. Bruk dd.mm.åååå")).to
        .exist;
      await clickButton("Send");
      expect(queryClient.getMutationCache().getAll().length).to.equal(0);
    });
    it("Viser feil ved fristdato utenfor gyldig intervall", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      await clickTab(tabTexts["FORHANDSVARSEL"]);
      const fristInput = screen.getByRole("textbox", { name: /Svarfrist/ });
      const pad = (n: number) => n.toString().padStart(2, "0");
      const tooEarly = daysFromToday(10);
      const formattedTooEarly = `${pad(tooEarly.getDate())}.${pad(
        tooEarly.getMonth() + 1
      )}.${tooEarly.getFullYear()}`;
      changeTextInput(fristInput, formattedTooEarly);
      fireEvent.blur(fristInput);
      expect(await screen.findByText("Vennligst velg en gyldig dato")).to.exist;
      await clickButton("Send");
      expect(queryClient.getMutationCache().getAll().length).to.equal(0);
    });
    it("Viser required feil ved tom fristdato", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      await clickTab(tabTexts["FORHANDSVARSEL"]);
      const fristInput = screen.getByRole("textbox", { name: /Svarfrist/ });
      changeTextInput(fristInput, "");
      fireEvent.blur(fristInput);
      expect(await screen.findByText("Vennligst velg en gyldig dato")).to.exist;
      await clickButton("Send");
      expect(queryClient.getMutationCache().getAll().length).to.equal(0);
    });
  });
  describe("ForhandsvarselOppsummering", () => {
    it("Viser oppsummering når forhåndsvarsel er sendt", () => {
      renderVurderAktivitetskrav(forhandsvarselAktivitetskrav);

      expect(
        screen.getByRole("heading", {
          name: "Oppsummering av forhåndsvarselet",
        })
      ).to.exist;
      expect(screen.getByText("Frist: ", { exact: false })).to.exist;
      expect(
        screen.getByText(
          "Husk å sjekke Gosys og Modia for mer informasjon før du vurderer."
        )
      ).to.exist;
    });

    it("Viser ikke oppsummering når forhåndsvarsel ikke er sendt", () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      expect(
        screen.queryByRole("heading", {
          name: "Oppsummering av forhåndsvarselet",
        })
      ).to.not.exist;
      expect(screen.queryByText("Frist: ", { exact: false })).to.not.exist;
      expect(
        screen.queryByText(
          "Husk å sjekke Gosys og Modia for mer informasjon før du vurderer."
        )
      ).to.not.exist;
    });
  });
});
