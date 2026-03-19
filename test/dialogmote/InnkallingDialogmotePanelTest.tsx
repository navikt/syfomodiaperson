import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import dayjs from "dayjs";
import InnkallingDialogmotePanel from "@/sider/dialogmoter/components/innkalling/InnkallingDialogmotePanel";
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
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import {
  meldtMotebehovArbeidstakerBehandletMock,
  svartJaMotebehovArbeidstakerUbehandletMock,
} from "@/mocks/syfomotebehov/motebehovMock";

let queryClient: QueryClient;

const brukerKanVarsles = {
  ...kontaktinformasjonMock,
  skalHaVarsel: true,
};
const brukerKanIkkeVarsles = {
  ...kontaktinformasjonMock,
  skalHaVarsel: false,
};

function renderInnkallingDialogmotePanel(kontaktinfo: KontaktinfoDTO) {
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
}

function mockUbehandletMotebehov() {
  queryClient.setQueryData(
    motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
    () => [svartJaMotebehovArbeidstakerUbehandletMock]
  );
}

function mockBehandletMotebehov() {
  queryClient.setQueryData(
    motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
    () => [meldtMotebehovArbeidstakerBehandletMock()]
  );
}

function mockDialogmotekandidat() {
  queryClient.setQueryData(
    dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
    () => dialogmotekandidatMock
  );
}

describe("InnkallingDialogmotePanel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("med dm2 enabled", () => {
    it("viser advarsel om fysisk brev når bruker ikke kan varsles", () => {
      mockBehandletMotebehov();

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
      mockBehandletMotebehov();

      renderInnkallingDialogmotePanel(brukerKanIkkeVarsles);

      const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
      expect(button).to.exist;
      await userEvent.click(button);
    });

    it("viser ingen advarsel når bruker kan varsles", () => {
      mockBehandletMotebehov();

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(screen.queryByRole("img", { name: "Advarsel" })).to.not.exist;
      expect(
        screen.queryByRole(
          brukerKanIkkeVarslesPapirpostTexts.brukerKanIkkeVarslesTekst
        )
      ).to.not.exist;
    });

    it("viser ikke knapp til DialogmoteUnntak når bruker ikke er Dialogmotekandidat", () => {
      mockBehandletMotebehov();

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(queryButton("Sett unntak")).to.not.exist;
      expect(queryButton("Ikke aktuell")).to.not.exist;
    });

    it("viser ingen knapper under møtebehov-kvittering når møtebehov ikke er behandlet og bruker ikke er kandidat", async () => {
      mockUbehandletMotebehov();

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(await screen.findByText("Vurder behov for dialogmøte")).to.exist;
      expect(queryButton("Nytt dialogmøte")).to.not.exist;
      expect(queryButton("Sett unntak")).to.not.exist;
      expect(queryButton("Ikke aktuell")).to.not.exist;
    });

    it("viser ingen knapper under møtebehov-kvittering når møtebehov ikke er behandlet og bruker er kandidat", async () => {
      mockDialogmotekandidat();
      mockUbehandletMotebehov();

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(await screen.findByText("Vurder behov for dialogmøte")).to.exist;
      expect(screen.getByRole("button", { name: "Avvent" })).to.exist;
      expect(queryButton("Nytt dialogmøte")).to.not.exist;
      expect(queryButton("Sett unntak")).to.not.exist;
      expect(queryButton("Ikke aktuell")).to.not.exist;
    });

    it("viser kun Nytt dialogmote etter møtebehov er behandlet og når bruker ikke er kandidat", async () => {
      mockBehandletMotebehov();

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
      expect(button).to.exist;
      expect(queryButton("Sett unntak")).to.not.exist;
      expect(queryButton("Ikke aktuell")).to.not.exist;
      await userEvent.click(button);
    });

    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og ingen ferdigstilte referat", async () => {
      mockDialogmotekandidat();
      mockBehandletMotebehov();

      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => []
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = await screen.findByRole("button", { name: "Sett unntak" });
      expect(button).to.exist;
      await userEvent.click(button);
    });

    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et ferdigstilt referat som er opprettet tidligere enn tidspunkt for Kandidat", async () => {
      mockDialogmotekandidat();
      mockBehandletMotebehov();

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

      const button = await screen.findByRole("button", { name: "Sett unntak" });
      expect(button).to.exist;
      await userEvent.click(button);
    });

    it("viser ikke knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et ferdigstilt referat som er opprettet etter tidspunkt for Kandidat", () => {
      mockDialogmotekandidat();
      mockBehandletMotebehov();

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
      expect(queryButton("Ikke aktuell")).to.not.exist;
    });

    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et mellomlagret referat som er opprettet etter tidspunkt for Kandidat", async () => {
      mockDialogmotekandidat();
      mockBehandletMotebehov();

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

      const button = await screen.findByRole("button", { name: "Sett unntak" });
      expect(button).to.exist;
      expect(await screen.findByRole("button", { name: "Ikke aktuell" })).to
        .exist;
      await userEvent.click(button);
    });
  });

  it("viser ikke innhold relatert til møtebehov når siste møtebehov har ferdigstilt referat", () => {
    mockUbehandletMotebehov();

    const referatCreatedAt = dayjs(
      new Date(svartJaMotebehovArbeidstakerUbehandletMock.opprettetDato)
    ).add(1, "day");

    const dialogmote = createDialogmote(
      "1",
      DialogmoteStatus.FERDIGSTILT,
      referatCreatedAt.toDate()
    );
    const dialogmoteMedFerdigstiltReferatEtterMotebehov = {
      ...dialogmote,
      referatList: [createReferat(true, referatCreatedAt.toISOString())],
    };

    queryClient.setQueryData(
      dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [dialogmoteMedFerdigstiltReferatEtterMotebehov]
    );

    renderInnkallingDialogmotePanel(brukerKanVarsles);

    expect(screen.queryByText("Møtebehov")).to.not.exist;
    expect(screen.queryByText("Vurder behov for dialogmøte")).to.not.exist;
    expect(queryButton("Bekreft")).to.not.exist;
  });

  it("viser avvent-banner når det finnes avvent-data", () => {
    mockBehandletMotebehov();

    const frist = "2025-01-10";
    queryClient.setQueryData(
      dialogmotekandidatQueryKeys.avvent(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          frist,
          createdBy: "Z123456",
          beskrivelse: "Vi avventer ny informasjon",
        },
      ]
    );

    renderInnkallingDialogmotePanel(brukerKanVarsles);

    const labels = screen.getAllByText(/Avventer til/i);
    expect(labels.length).to.be.greaterThan(0);
    expect(screen.getByText("Vi avventer ny informasjon")).to.exist;
  });

  it("viser ikke avvent-banner når avvent-listen er tom (for eksempel etter unntak/ikke-aktuell)", () => {
    mockBehandletMotebehov();

    queryClient.setQueryData(
      dialogmotekandidatQueryKeys.avvent(ARBEIDSTAKER_DEFAULT.personIdent),
      () => []
    );

    renderInnkallingDialogmotePanel(brukerKanVarsles);

    expect(screen.queryByText("Vi avventer ny informasjon")).to.not.exist;
  });
});
