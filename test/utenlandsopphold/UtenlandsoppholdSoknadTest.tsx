import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { mockServer } from "../setup";
import { queryClientWithMockData } from "../testQueryClient";
import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { UtenlandsoppholdSoknad } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknad.tsx";
import { UtenlandsoppholdSoknader } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknader.tsx";
import { utenlandsoppholdQueryKeys } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "@/mocks/common/mockConstants";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import {
  mockSoknaderResponse,
  soknadMedVedtakMock,
  soknadUtenVedtakMock,
} from "@/mocks/isutenlandsopphold/mockIsutenlandsopphold";
import { utenlandsoppholdPath } from "@/AppRouter.tsx";
import { clickButton, clickRadio } from "../testUtils";
import {
  stubSoknaderMedMuterbarTilstand,
  stubSoknaderQuery,
} from "../stubs/stubIsutenlandsopphold";

let queryClient: QueryClient;

const renderUtenlandsoppholdSoknad = (
  soknadId: string = soknadUtenVedtakMock.soknadId,
  initialPath: string = `${utenlandsoppholdPath}/${soknadId}`,
) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <NotificationProvider>
          <Routes>
            <Route
              path={`${utenlandsoppholdPath}/:utenlandsoppholdSoknadId`}
              element={<UtenlandsoppholdSoknad />}
            />
            <Route
              path={utenlandsoppholdPath}
              element={<UtenlandsoppholdSoknader />}
            />
          </Routes>
        </NotificationProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe("UtenlandsoppholdSoknad", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser feilmelding når henting av søknader feiler", async () => {
    queryClient.setQueryDefaults(
      utenlandsoppholdQueryKeys.soknader(ARBEIDSTAKER_DEFAULT.personIdent),
      { retry: false },
    );

    renderUtenlandsoppholdSoknad();

    expect(
      await screen.findByText(
        "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
      ),
    ).to.exist;
  });

  it("viser melding om at søknaden mangler når listen er tom", async () => {
    stubSoknaderQuery({ soknader: [] });

    renderUtenlandsoppholdSoknad();

    expect(await screen.findByText("Fant ikke søknaden")).to.exist;
  });

  it("viser søkte perioder og knapp for å sende vedtak", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

    renderUtenlandsoppholdSoknad();

    expect(await screen.findByRole("button", { name: "Send vedtak" })).to.exist;
    expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    expect(screen.getByRole("button", { name: "Vis hele søknaden" })).to.exist;
    expect(screen.getByRole("button", { name: "Tilbake" })).to.exist;
  });

  it("viser melding om at søknaden er behandlet når status ikke er MOTTATT", async () => {
    stubSoknaderQuery({ soknader: [soknadMedVedtakMock] });

    renderUtenlandsoppholdSoknad(soknadMedVedtakMock.soknadId);

    expect(await screen.findByText(/Denne søknaden er allerede behandlet/)).to
      .exist;
  });

  it("sender innvilget vedtak, viser notifikasjon og navigerer tilbake til listen der søknadens status nå vises som innvilget", async () => {
    stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);

    renderUtenlandsoppholdSoknad(
      soknadUtenVedtakMock.soknadId,
      utenlandsoppholdPath,
    );

    expect(await screen.findByRole("button", { name: "Start behandling" })).to
      .exist;

    await clickButton("Start behandling");

    await clickRadio("Innvilgelse: Godkjenn hele perioden");

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickButton("Send vedtak");

    expect(
      await screen.findByText(
        "Vedtaket om utenlandsopphold utenfor EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
      ),
    ).to.exist;
    expect(screen.queryByText("Fant ikke søknaden")).to.not.exist;
    expect(screen.queryByRole("button", { name: "Start behandling" })).to.not
      .exist;
    expect(await screen.findAllByText("Innvilget")).to.have.lengthOf(2);
    expect(
      await screen.findAllByText(
        new RegExp(`^Behandlet .* av ${VEILEDER_DEFAULT.ident}$`),
      ),
    ).to.have.lengthOf(2);
  });

  it("sender avslag vedtak, viser notifikasjon og navigerer tilbake til listen der søknadens status nå vises som avslag", async () => {
    stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);

    renderUtenlandsoppholdSoknad(
      soknadUtenVedtakMock.soknadId,
      utenlandsoppholdPath,
    );

    expect(await screen.findByRole("button", { name: "Start behandling" })).to
      .exist;

    await clickButton("Start behandling");

    await clickRadio("Avslag: Avslå hele perioden");

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickButton("Send vedtak");

    expect(
      await screen.findByText(
        "Vedtaket om utenlandsopphold utenfor EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
      ),
    ).to.exist;
    expect(screen.queryByText("Fant ikke søknaden")).to.not.exist;
    expect(screen.queryByRole("button", { name: "Start behandling" })).to.not
      .exist;
    expect(await screen.findAllByText("Avslag")).to.have.lengthOf(1);
    expect(
      await screen.findAllByText(
        new RegExp(`^Behandlet .* av ${VEILEDER_DEFAULT.ident}$`),
      ),
    ).to.have.lengthOf(2);
  });

  it("viser valideringsfeil og sender ikke vedtak når ingen utfall er valgt", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

    renderUtenlandsoppholdSoknad();

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickButton("Send vedtak");

    expect(
      await screen.findByText("Du må velge et utfall for å fatte vedtaket"),
    ).to.exist;

    await waitFor(() => {
      expect(queryClient.getMutationCache().getAll()).to.have.lengthOf(0);
    });
  });

  it("navigerer ikke bort og viser ingen notifikasjon hvis sending av vedtak feiler", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });
    mockServer.use(
      http.post(
        `*${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/vedtak`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderUtenlandsoppholdSoknad();

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickRadio("Innvilgelse: Godkjenn hele perioden");
    await clickButton("Send vedtak");

    await waitFor(() => {
      const vedtakMutation = queryClient.getMutationCache().getAll().pop();
      expect(vedtakMutation?.state.status).to.equal("error");
    });
    expect(screen.getByRole("button", { name: "Send vedtak" })).to.exist;
  });
});
