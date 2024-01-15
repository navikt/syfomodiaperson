import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../../mock/common/mockConstants";
import {
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
  Oppfolgingsgrunn,
} from "@/data/oppfolgingsoppgave/types";
import { generateUUID } from "@/utils/uuidUtils";
import { expect } from "chai";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import { apiMock } from "../stubs/stubApi";
import { Oppfolgingsoppgave } from "@/components/oppfolgingsoppgave/Oppfolgingsoppgave";
import { changeTextInput } from "../testUtils";
import dayjs from "dayjs";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { stubOppfolgingsoppgaveApi } from "../stubs/stubIshuskelapp";

let queryClient: QueryClient;
let apiMockScope: nock.Scope;

const oppfolgingsoppgaveOppfolgingsgrunn =
  Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE;
const oppfolgingsoppgaveOppfogingsgrunnText = "Vurder behov for dialogmøte";
const oppfolgingsoppgave: OppfolgingsoppgaveResponseDTO = {
  createdBy: VEILEDER_IDENT_DEFAULT,
  uuid: generateUUID(),
  oppfolgingsgrunn: oppfolgingsoppgaveOppfolgingsgrunn,
  tekst: "Dette var en veldig god grunn for å lage oppfolgingsoppgave.",
  updatedAt: new Date(),
  createdAt: new Date(),
  frist: "2030-01-01",
};
const openOppfolgingsoppgaveButtonText = "Oppfølgingsoppgave";

const renderOppfolgingsoppgave = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Oppfolgingsoppgave />
    </QueryClientProvider>
  );

describe("Oppfolgingsoppgave", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe("oppfolgingsoppgave exists", () => {
    beforeEach(() => {
      stubOppfolgingsoppgaveApi(apiMockScope, oppfolgingsoppgave);
    });
    it("renders oppfolgingsoppgave-tekst with save, cancel and remove buttons", async () => {
      renderOppfolgingsoppgave();

      expect(await screen.findByText(oppfolgingsoppgaveOppfogingsgrunnText)).to
        .exist;
      expect(await screen.findByText("Frist: 01.01.2030")).to.exist;
      expect(await screen.findByRole("button", { hidden: true, name: "Fjern" }))
        .to.exist;
      expect(
        await screen.findByText(
          `Opprettet av: ${VEILEDER_DEFAULT.navn} (${
            VEILEDER_DEFAULT.ident
          }), ${tilLesbarDatoMedArUtenManedNavn(new Date())}`
        )
      ).to.exist;
    });
    it("remove deletes oppfolgingsoppgave", async () => {
      renderOppfolgingsoppgave();

      const removeButton = await screen.findByRole("button", {
        hidden: true,
        name: "Fjern",
      });
      userEvent.click(removeButton);

      const fjernOppfolgingsoppgaveMutation = queryClient
        .getMutationCache()
        .getAll()[0];
      expect(fjernOppfolgingsoppgaveMutation.state.variables).to.deep.equal(
        oppfolgingsoppgave.uuid
      );
    });
  });
  describe("OppfolgingsoppgaveModal: no oppfolgingsoppgave exists", () => {
    beforeEach(() => {
      stubOppfolgingsoppgaveApi(apiMockScope, undefined);
    });
    it("renders oppfolgingsoppgave input with radio group, datepicker and save and cancel buttons", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      userEvent.click(openModalButton);

      expect(await screen.findByText("Velg oppfølgingsgrunn (obligatorisk)")).to
        .exist;
      expect(screen.getByRole("textbox", { hidden: true, name: "Frist" })).to
        .exist;
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
      userEvent.click(openModalButton);

      const oppfolgingsgrunnRadioButton = await screen.findByText(
        "Vurder behov for dialogmøte"
      );
      userEvent.click(oppfolgingsgrunnRadioButton);
      const beskrivelseInput = screen.getByLabelText("Beskrivelse");
      changeTextInput(
        beskrivelseInput,
        "Dette var en veldig god grunn for å lage oppfolgingsoppgave."
      );

      const fristDateInput = screen.getByRole("textbox", {
        hidden: true,
        name: "Frist",
      });
      const fristDate = dayjs();
      changeTextInput(fristDateInput, fristDate.format("DD-MM-YY"));
      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      userEvent.click(lagreButton);

      await waitFor(() => {
        const lagreOppfolgingsoppgaveMutation = queryClient
          .getMutationCache()
          .getAll();
        const expectedOppfolgingsoppgave: OppfolgingsoppgaveRequestDTO = {
          oppfolgingsgrunn: Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE,
          tekst: "Dette var en veldig god grunn for å lage oppfolgingsoppgave.",
          frist: fristDate.format("YYYY-MM-DD"),
        };
        expect(
          lagreOppfolgingsoppgaveMutation[0].state.variables
        ).to.deep.equal(expectedOppfolgingsoppgave);
      });
    });
  });
});