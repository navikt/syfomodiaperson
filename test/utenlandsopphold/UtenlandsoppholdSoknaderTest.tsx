import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { UtenlandsoppholdSoknader } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknader.tsx";
import { utenlandsoppholdQueryKeys } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import {
  mockSoknaderResponse,
  soknadMedVedtakMock,
  soknadUtenVedtakMock,
  gammelSoknadMock,
} from "@/mocks/isutenlandsopphold/mockIsutenlandsopphold";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { MemoryRouter } from "react-router-dom";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { stubSoknaderQuery } from "../stubs/stubIsutenlandsopphold";
import { tilLesbarPeriodeDatoerOgDager } from "@/sider/utenlandsopphold/utils";
import { parsePeriode } from "@/data/utenlandsopphold/utenlandsoppholdTypes";

let queryClient: QueryClient;

const renderUtenlandsopphold = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <NotificationProvider>
          <UtenlandsoppholdSoknader />
        </NotificationProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe("UtenlandsoppholdSoknader", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser feilmelding når henting av søknader feiler", async () => {
    queryClient.setQueryDefaults(
      utenlandsoppholdQueryKeys.soknader(ARBEIDSTAKER_DEFAULT.personIdent),
      { retry: false },
    );

    renderUtenlandsopphold();

    expect(
      await screen.findByText(
        "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
      ),
    ).to.exist;
  });

  it("viser søknader sortert på innsendt tidspunkt med nyeste først", async () => {
    stubSoknaderQuery(mockSoknaderResponse);

    renderUtenlandsopphold();

    const rowHeaders = await screen.findAllByRole("rowheader");

    expect(rowHeaders[0].textContent).to.equal(
      tilLesbarDatoMedArUtenManedNavn(soknadUtenVedtakMock.innsendtTidspunkt),
    );
    expect(rowHeaders[1].textContent).to.equal(
      tilLesbarDatoMedArUtenManedNavn(soknadMedVedtakMock.innsendtTidspunkt),
    );
    expect(rowHeaders[2].textContent).to.equal(
      tilLesbarDatoMedArUtenManedNavn(gammelSoknadMock.innsendtTidspunkt),
    );
  });

  it("viser flere søkte perioder for en søknad", async () => {
    stubSoknaderQuery(mockSoknaderResponse);

    renderUtenlandsopphold();

    expect(
      await screen.findByText(
        tilLesbarPeriodeDatoerOgDager(
          parsePeriode(soknadUtenVedtakMock.soktePerioder[0]),
        ),
      ),
    ).to.exist;
    expect(
      screen.getByText(
        tilLesbarPeriodeDatoerOgDager(
          parsePeriode(soknadUtenVedtakMock.soktePerioder[1]),
        ),
      ),
    ).to.exist;
  });

  it("viser knapp for å starte behandling når søknaden ikke har vedtak", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

    renderUtenlandsopphold();

    expect(await screen.findByRole("button", { name: "Start behandling" })).to
      .exist;
  });

  it("viser at søknaden må behandles i Infotrygd i stedet for knapp når den er innsendt før 1. august 2026", async () => {
    stubSoknaderQuery({ soknader: [gammelSoknadMock] });

    renderUtenlandsopphold();

    expect(await screen.findByText("Må behandles i Infotrygd")).to.exist;
    expect(screen.queryByRole("button", { name: "Start behandling" })).to.not
      .exist;
  });

  it("viser søknadsstatus i stedet for knapp når søknaden har vedtak", async () => {
    stubSoknaderQuery({ soknader: [soknadMedVedtakMock] });

    renderUtenlandsopphold();

    expect(await screen.findByText("Innvilget")).to.exist;
    expect(screen.queryByRole("button", { name: "Start behandling" })).to.not
      .exist;
  });

  it("viser hvem som fattet vedtaket og når for en søknad med vedtak", async () => {
    stubSoknaderQuery({ soknader: [soknadMedVedtakMock] });

    renderUtenlandsopphold();

    expect(
      await screen.findByText(
        `Behandlet ${tilLesbarDatoMedArUtenManedNavn(
          soknadMedVedtakMock.vedtak!.fattetTidspunkt,
        )} av ${soknadMedVedtakMock.vedtak!.fattetAv}`,
      ),
    ).to.exist;
  });

  it("viser ingen informasjon om vedtak for en søknad uten vedtak", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

    renderUtenlandsopphold();

    await screen.findByRole("button", { name: "Start behandling" });

    expect(await screen.findByText("Ikke behandlet i Modia")).to.exist;
    expect(screen.queryByText(/^Behandlet /)).to.not.exist;
  });

  it("viser melding om ingen søknader når listen er tom", async () => {
    stubSoknaderQuery({ soknader: [] });

    renderUtenlandsopphold();

    expect(
      await screen.findByText("Ingen mottatte søknader eller fattede vedtak"),
    ).to.exist;
  });
});
