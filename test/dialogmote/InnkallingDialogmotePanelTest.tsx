import { expect, describe, it, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import dayjs from "dayjs";
import { InnkallingDialogmotePanel } from "@/sider/dialogmoter/components/innkalling/InnkallingDialogmotePanel";
import { texts as brukerKanIkkeVarslesPapirpostTexts } from "../../src/sider/dialogmoter/components/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { createMellomlagretReferat, navEnhet } from "./testData";
import { queryClientWithMockData } from "../testQueryClient";
import { queryButton } from "../testUtils";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { dialogmotekandidatMock } from "@/mocks/isdialogmotekandidat/dialogmotekandidatMock";
import { dialogmoterQueryKeys } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { DialogmoteStatus } from "@/sider/dialogmoter/types/dialogmoteTypes";
import {
  createDialogmote,
  createReferat,
} from "@/mocks/isdialogmote/dialogmoterMock";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { kontaktinformasjonMock } from "@/mocks/syfoperson/persondataMock";
import { KontaktinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";

let queryClient: QueryClient;

const brukerKanVarsles = {
  ...kontaktinformasjonMock,
  skalHaVarsel: true,
};
const brukerKanIkkeVarsles = {
  ...kontaktinformasjonMock,
  skalHaVarsel: false,
};

const renderInnkallingDialogmotePanel = (kontaktinfo: KontaktinfoDTO) => {
  queryClient.setQueryData(
    brukerQueryKeys.kontaktinfo(ARBEIDSTAKER_DEFAULT.personIdent),
    () => kontaktinfo
  );
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("InnkallingDialogmotePanel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("med dm2 enabled", () => {
    it("viser advarsel om fysisk brev når bruker ikke kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanIkkeVarsles);

      expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
      expect(
        screen.getByText(
          brukerKanIkkeVarslesPapirpostTexts.brukerKanIkkeVarslesTekst
        )
      ).to.exist;
      expect(
        screen.getByText(brukerKanIkkeVarslesPapirpostTexts.papirpostDialogmote)
      ).to.exist;
    });
    it("viser knapp til Dialogmoteinkalling når bruker ikke kan varsles", async () => {
      renderInnkallingDialogmotePanel(brukerKanIkkeVarsles);

      const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
      expect(button).to.exist;
      await userEvent.click(button);
    });

    it("viser ingen advarsel når bruker kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(screen.queryByRole("img", { name: "Advarsel" })).to.not.exist;
      expect(
        screen.queryByRole(
          brukerKanIkkeVarslesPapirpostTexts.brukerKanIkkeVarslesTekst
        )
      ).to.not.exist;
    });
    it("viser knapp til Dialogmoteinkalling  når bruker kan varsles", async () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
      expect(button).to.exist;
      await userEvent.click(button);
    });
    it("viser ikke knapp til DialogmoteUnntak når bruker ikke er Dialogmotekandidat", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(queryButton("Sett unntak")).to.not.exist;
    });
    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og ingen ferdigstilte referat ", async () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => []
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByRole("button", { name: "Sett unntak" });
      expect(button).to.exist;
      await userEvent.click(button);
    });
    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et ferdigstilt referat som er opprettet tidligere enn tidspunkt for Kandidat", async () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );
      const createdAt = dayjs(
        new Date(dialogmotekandidatMock.kandidatAt)
      ).subtract(1, "days");
      const dialogmote = createDialogmote(
        "1",
        DialogmoteStatus.FERDIGSTILT,
        createdAt.toDate()
      );
      const dialogmoteFerdigstiltTidligereEnnKandidat = {
        ...dialogmote,
        referatList: [createReferat(true, createdAt.toISOString())],
      };
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [dialogmoteFerdigstiltTidligereEnnKandidat]
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByText("Sett unntak");
      expect(button).to.exist;
      await userEvent.click(button);
    });
    it("viser ikke knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et ferdigstilt referat som er opprettet etter tidspunkt for Kandidat", () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );
      const createdAt = dayjs(new Date(dialogmotekandidatMock.kandidatAt)).add(
        1,
        "days"
      );
      const dialogmote = createDialogmote(
        "1",
        DialogmoteStatus.FERDIGSTILT,
        createdAt.toDate()
      );
      const dialogmoteFerdigstiltEtterKandidat = {
        ...dialogmote,
        referatList: [createReferat(true, createdAt.toISOString())],
      };
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [dialogmoteFerdigstiltEtterKandidat]
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = queryButton("Sett unntak");
      expect(button).to.not.exist;
    });
    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et mellomlagret referat som er opprettet etter tidspunkt for Kandidat", async () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );
      const createdAt = dayjs(new Date(dialogmotekandidatMock.kandidatAt)).add(
        1,
        "days"
      );
      const dialogmote = createDialogmote(
        "1",
        DialogmoteStatus.FERDIGSTILT,
        createdAt.toDate()
      );

      const dialogmoteMellomlagreReferatEtterKandidat = {
        ...dialogmote,
        referatList: [createMellomlagretReferat(createdAt.toISOString())],
      };
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [dialogmoteMellomlagreReferatEtterKandidat]
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByText("Sett unntak");
      expect(button).to.exist;
      await userEvent.click(button);
    });
  });
});
