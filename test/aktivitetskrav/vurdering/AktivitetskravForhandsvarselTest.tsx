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
import { getForhandsvarselFrist } from "@/utils/datoUtils";
import React from "react";
import { VurderAktivitetskrav } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { queryClientWithMockData } from "../../testQueryClient";
import {
  changeTextInput,
  clickButton,
  clickTab,
  getTextInput,
  getTooLongText,
} from "../../testUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  SendForhandsvarselDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { expect, describe, it, beforeEach } from "vitest";
import { getSendForhandsvarselDocument } from "../varselDocuments";
import { stubVurderAktivitetskravForhandsvarselApi } from "../../stubs/stubIsaktivitetskrav";
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
        frist: expectedFrist,
      };
      expect(vurdering.fritekst).to.deep.equal(expectedVurdering.fritekst);
      expect(vurdering.document).to.deep.equal(expectedVurdering.document);
      expect(vurdering.frist.toDateString()).to.deep.equal(
        expectedVurdering.frist.toDateString()
      );

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
        frist: expectedFrist,
      };
      expect(vurdering.fritekst).to.deep.equal(expectedVurdering.fritekst);
      expect(vurdering.document).to.deep.equal(expectedVurdering.document);
      expect(vurdering.frist.toDateString()).to.deep.equal(
        expectedVurdering.frist.toDateString()
      );

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
        frist: expectedFrist,
      };
      expect(vurdering.fritekst).to.deep.equal(expectedVurdering.fritekst);
      expect(vurdering.document).to.deep.equal(expectedVurdering.document);
      expect(vurdering.frist.toDateString()).to.deep.equal(
        expectedVurdering.frist.toDateString()
      );

      await waitFor(
        () => expect(screen.queryByText(enLangBeskrivelse)).to.not.exist
      );
    });

    it("IKKE_OPPFYLT is present when status is forhandsvarsel and it is expired", async () => {
      renderVurderAktivitetskrav(expiredForhandsvarselAktivitetskrav);

      await clickTab(tabTexts["IKKE_OPPFYLT"]);

      expect(
        screen.getByRole("heading", {
          name: "Ikke oppfylt",
        })
      ).to.exist;

      expect(
        screen.getByText(/Innstilling må skrives og sendes til NAY i Gosys/)
      ).to.exist;
      await clickButton("Lagre");

      const vurderIkkeOppfyltMutation = queryClient
        .getMutationCache()
        .getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        status: AktivitetskravStatus.IKKE_OPPFYLT,
        arsaker: [],
      };
      expect(vurderIkkeOppfyltMutation.state.variables).to.deep.equal(
        expectedVurdering
      );
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
