import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import { VEILEDER_DEFAULT } from "@/mocks/common/mockConstants";
import {
  EditOppfolgingsoppgaveRequestDTO,
  Oppfolgingsgrunn,
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
  OppfolgingsoppgaveVersjonResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { generateUUID } from "@/utils/utils";
import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import Oppfolgingsoppgave from "@/components/oppfolgingsoppgave/Oppfolgingsoppgave";
import { changeTextInput } from "../testUtils";
import dayjs from "dayjs";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { stubOppfolgingsoppgaveApi } from "../stubs/stubIshuskelapp";

let queryClient: QueryClient;

const oppfolgingsoppgaveOppfolgingsgrunn =
  Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE;
const oppfolgingsoppgaveOppfogingsgrunnText = "Vurder behov for dialogmøte";
const oppfolgingsoppgaveTekst =
  "Dette var en veldig god grunn for å lage oppfolgingsoppgave.";
const oppfolgingsoppgave: OppfolgingsoppgaveResponseDTO = {
  uuid: generateUUID(),
  updatedAt: new Date(),
  createdAt: new Date(),
  isActive: true,
  removedBy: null,
  versjoner: [
    {
      oppfolgingsgrunn: oppfolgingsoppgaveOppfolgingsgrunn,
      tekst: oppfolgingsoppgaveTekst,
      frist: "2030-01-01",
      createdBy: VEILEDER_DEFAULT.ident,
    } as OppfolgingsoppgaveVersjonResponseDTO,
  ],
};
const openOppfolgingsoppgaveButtonText = "Oppfølgingsoppgave";

const renderOppfolgingsoppgave = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Oppfolgingsoppgave />
    </QueryClientProvider>
  );

async function clickEditButton() {
  const editButton = await screen.findByRole("button", {
    hidden: true,
    name: "Endre",
  });
  await userEvent.click(editButton);
}

describe("Oppfolgingsoppgave", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("oppfolgingsoppgave exists", () => {
    beforeEach(() => {
      stubOppfolgingsoppgaveApi(oppfolgingsoppgave);
    });
    it("renders oppfolgingsoppgave-tekst with save, cancel and remove buttons", async () => {
      renderOppfolgingsoppgave();

      expect(await screen.findByText(oppfolgingsoppgaveOppfogingsgrunnText)).to
        .exist;
      expect(await screen.findByText("Frist: 01.01.2030")).to.exist;
      expect(await screen.findByRole("button", { name: "Endre" })).to.exist;
      expect(
        await screen.findByRole("button", {
          name: "Fjerner oppfølgingsoppgaven fra oversikten",
        })
      ).to.exist;
    });
    it("renders oppfolgingsoppgave-info", async () => {
      renderOppfolgingsoppgave();

      expect(
        await screen.findByText(
          `Opprettet: ${tilLesbarDatoMedArUtenManedNavn(new Date())}`
        )
      ).to.exist;
      expect(
        await screen.findByText(
          `Sist oppdatert: ${tilLesbarDatoMedArUtenManedNavn(new Date())}`
        )
      ).to.exist;
      expect(
        await screen.findByText(
          `Sist oppdatert av: ${VEILEDER_DEFAULT.fulltNavn()} (${
            VEILEDER_DEFAULT.ident
          })`
        )
      ).to.exist;
    });
    it("remove deletes oppfolgingsoppgave", async () => {
      renderOppfolgingsoppgave();

      const removeButton = await screen.findByRole("button", {
        name: "Fjerner oppfølgingsoppgaven fra oversikten",
      });
      await userEvent.click(removeButton);

      const fjernOppfolgingsoppgaveMutation = queryClient
        .getMutationCache()
        .getAll()[0];
      expect(fjernOppfolgingsoppgaveMutation.state.variables).to.deep.equal(
        oppfolgingsoppgave.uuid
      );
    });
    it("edit opens oppfolgingsoppgavemodal", async () => {
      renderOppfolgingsoppgave();

      await clickEditButton();

      const dialogs = await screen.findAllByRole("dialog", {
        hidden: true,
      });
      const oppfolgingsoppgaveModal = dialogs[0];
      expect(oppfolgingsoppgaveModal).to.exist;
      expect(within(oppfolgingsoppgaveModal).getByText("Lagre")).to.exist;
      expect(within(oppfolgingsoppgaveModal).getByText("Avbryt")).to.exist;
    });
    it("edit oppfolgingsgrunn edits existing oppfolgingsoppgave", async () => {
      renderOppfolgingsoppgave();

      await clickEditButton();

      const selectOppfolgingsgrunn = await screen.findByLabelText(
        "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
      );
      fireEvent.change(selectOppfolgingsgrunn, {
        target: { value: Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT },
      });

      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      await userEvent.click(lagreButton);

      await waitFor(() => {
        const endreOppfolgingsoppgaveMutation = queryClient
          .getMutationCache()
          .getAll();
        const expectedOppfolgingsoppgave: EditOppfolgingsoppgaveRequestDTO = {
          tekst: oppfolgingsoppgaveTekst,
          frist: "2030-01-01",
          oppfolgingsgrunn: Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT,
        };
        expect(
          endreOppfolgingsoppgaveMutation[0].state.variables
        ).to.deep.equal(expectedOppfolgingsoppgave);
      });
    });
    it("edit oppfolgingsgrunn and date edits existing oppfolgingsoppgave", async () => {
      renderOppfolgingsoppgave();

      await clickEditButton();

      const selectOppfolgingsgrunn = await screen.findByLabelText(
        "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
      );
      fireEvent.change(selectOppfolgingsgrunn, {
        target: { value: Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT },
      });
      const fristDateInput = screen.getByRole("textbox", {
        hidden: true,
        name: "Frist (obligatorisk)",
      });
      const fristDate = dayjs();
      changeTextInput(fristDateInput, fristDate.format("DD-MM-YY"));

      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      await userEvent.click(lagreButton);

      await waitFor(() => {
        const endreOppfolgingsoppgaveMutation = queryClient
          .getMutationCache()
          .getAll();
        const expectedOppfolgingsoppgave: EditOppfolgingsoppgaveRequestDTO = {
          tekst: oppfolgingsoppgaveTekst,
          frist: fristDate.format("YYYY-MM-DD"),
          oppfolgingsgrunn: Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT,
        };
        expect(
          endreOppfolgingsoppgaveMutation[0].state.variables
        ).to.deep.equal(expectedOppfolgingsoppgave);
      });
    });
    it("edit date of existing oppfolgingsoppgavemodal edits existing oppfolgingsoppgave", async () => {
      renderOppfolgingsoppgave();

      await clickEditButton();

      const fristDateInput = screen.getByRole("textbox", {
        hidden: true,
        name: "Frist (obligatorisk)",
      });
      const fristDate = dayjs();
      changeTextInput(fristDateInput, fristDate.format("DD-MM-YY"));

      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      await userEvent.click(lagreButton);

      await waitFor(() => {
        const endreOppfolgingsoppgaveMutation = queryClient
          .getMutationCache()
          .getAll();
        const expectedOppfolgingsoppgave: EditOppfolgingsoppgaveRequestDTO = {
          tekst: oppfolgingsoppgaveTekst,
          frist: fristDate.format("YYYY-MM-DD"),
          oppfolgingsgrunn: oppfolgingsoppgaveOppfolgingsgrunn,
        };
        expect(
          endreOppfolgingsoppgaveMutation[0].state.variables
        ).to.deep.equal(expectedOppfolgingsoppgave);
      });
    });
    it("fails if no changes are made on existing oppfolgingsoppgavemodal", async () => {
      renderOppfolgingsoppgave();

      await clickEditButton();

      expect(
        screen.getByRole("textbox", {
          hidden: true,
          name: "Frist (obligatorisk)",
        })
      ).to.exist;

      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      expect(lagreButton).to.exist;
      await userEvent.click(lagreButton);

      await screen.findByText("Du må gjøre en endring før du kan lagre.");
    });
  });
  describe("OppfolgingsoppgaveModal: no oppfolgingsoppgave exists", () => {
    beforeEach(() => {
      stubOppfolgingsoppgaveApi(undefined);
    });

    it("renders oppfolgingsoppgave input with radio group, textarea, datepicker and save and cancel buttons", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      await userEvent.click(openModalButton);

      expect(screen.getByRole("heading", { name: "Oppfølgingsoppgave" })).to
        .exist;
      expect(
        await screen.findByText(
          "Du kan lage en oppfølgingsoppgave hvis du har behov for å følge opp den sykmeldte utenom de hendelsene Modia lager automatisk. Oppfølgingsbehovet må være hjemlet i folketrygdloven kapittel 8. Den sykmeldte kan kreve innsyn i oppfølgingsoppgavene."
        )
      ).to.exist;

      expect(
        await screen.findByText(
          "Velg den oppfølgingsgrunnen som passer med formålet for oppfølgingen."
        )
      ).to.exist;
      expect(screen.getByRole("textbox", { hidden: true, name: "Beskrivelse" }))
        .to.exist;
      expect(
        screen.getByRole("textbox", {
          hidden: true,
          name: "Frist (obligatorisk)",
        })
      ).to.exist;
      expect(screen.getByRole("button", { hidden: true, name: "Lagre" })).to
        .exist;
      expect(screen.getByRole("button", { hidden: true, name: "Avbryt" })).to
        .exist;
    });
    it("save oppfolgingsoppgave with oppfolgingsgrunn and frist", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      await userEvent.click(openModalButton);

      const selectOppfolgingsgrunn = await screen.findByLabelText(
        "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
      );
      fireEvent.change(selectOppfolgingsgrunn, {
        target: { value: Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE },
      });
      const beskrivelseInput = screen.getByLabelText("Beskrivelse");
      changeTextInput(beskrivelseInput, oppfolgingsoppgaveTekst);

      const fristDateInput = screen.getByRole("textbox", {
        hidden: true,
        name: "Frist (obligatorisk)",
      });
      const fristDate = dayjs();
      changeTextInput(fristDateInput, fristDate.format("DD-MM-YY"));
      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      await userEvent.click(lagreButton);

      await waitFor(() => {
        const lagreOppfolgingsoppgaveMutation = queryClient
          .getMutationCache()
          .getAll();
        const expectedOppfolgingsoppgave: OppfolgingsoppgaveRequestDTO = {
          oppfolgingsgrunn: Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE,
          tekst: oppfolgingsoppgaveTekst,
          frist: fristDate.format("YYYY-MM-DD"),
        };
        expect(
          lagreOppfolgingsoppgaveMutation[0].state.variables
        ).to.deep.equal(expectedOppfolgingsoppgave);
      });
    });
    it("shown extra alert when ANNET oppfolgingsgrunn is chosen", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      await userEvent.click(openModalButton);

      const selectOppfolgingsgrunn = await screen.findByLabelText(
        "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
      );
      fireEvent.change(selectOppfolgingsgrunn, {
        target: { value: Oppfolgingsgrunn.ANNET },
      });
      expect(
        screen.queryByText(
          "Denne oppgaven skal kun brukes til sykefraværsoppfølging, altså ikke oppgaver knyttet til andre ytelser eller formål. Innbyggeren kan få innsyn i det du skriver her."
        )
      ).to.exist;
    });
    it("does not show extra alert when ANNET oppfolgingsgrunn is NOT chosen", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      await userEvent.click(openModalButton);

      const selectOppfolgingsgrunn = await screen.findByLabelText(
        "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
      );
      fireEvent.change(selectOppfolgingsgrunn, {
        target: { value: Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER },
      });
      expect(
        screen.queryByText(
          "Denne oppgaven skal kun brukes til sykefraværsoppfølging, altså ikke oppgaver knyttet til andre ytelser eller formål. Innbyggeren kan få innsyn i det du skriver her."
        )
      ).to.not.exist;
    });
    it("show an alert if oppfolgingsoppgavebeskrivelsen becomes more than 200 characters", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      await userEvent.click(openModalButton);

      const lengthBeskrivelseAlert =
        "Husk at opplysninger som har betydning for saken skal journalføres i eget notat i Gosys.";
      expect(screen.queryByText(lengthBeskrivelseAlert)).to.not.exist;

      const beskrivelseInput = screen.getByLabelText("Beskrivelse");
      changeTextInput(
        beskrivelseInput,
        "Dette var en veldig god grunn for å lage oppfølgingsoppgave. Faktisk så god grunn at jeg ønsker å skrive så mye som 200 tegn for å sjekke om det kommer opp et varsel med beskrivelse hvis jeg skriver så mange tegn."
      );
      expect(screen.queryByText(lengthBeskrivelseAlert)).to.exist;
    });
  });
});
