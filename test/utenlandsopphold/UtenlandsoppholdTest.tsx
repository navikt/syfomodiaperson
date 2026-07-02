import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { mockServer } from "../setup";
import { queryClientWithMockData } from "../testQueryClient";
import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { Utenlandsopphold } from "@/sider/utenlandsopphold/Utenlandsopphold.tsx";
import { SoknaderResponseDTO } from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { utenlandsoppholdQueryKeys } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import {
  mockSoknaderResponse,
  soknadMedVedtakMock,
  soknadUtenVedtakMock,
} from "@/mocks/isutenlandsopphold/mockIsutenlandsopphold";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArUtenManednavn,
} from "@/utils/datoUtils";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";

let queryClient: QueryClient;

const renderUtenlandsopphold = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Utenlandsopphold />
    </QueryClientProvider>,
  );

const stubSoknaderQuery = (response: SoknaderResponseDTO) =>
  mockServer.use(
    http.post(`*${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () =>
      HttpResponse.json(response),
    ),
  );

describe("Utenlandsopphold", () => {
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
      tilLesbarDatoMedArstall(soknadUtenVedtakMock.innsendtTidspunkt),
    );
    expect(rowHeaders[1].textContent).to.equal(
      tilLesbarDatoMedArstall(soknadMedVedtakMock.innsendtTidspunkt),
    );
  });

  it("viser flere søkte perioder for en søknad", async () => {
    stubSoknaderQuery(mockSoknaderResponse);

    renderUtenlandsopphold();

    expect(
      await screen.findByText(
        tilLesbarPeriodeMedArUtenManednavn(
          soknadUtenVedtakMock.soktePerioder[0].fom,
          soknadUtenVedtakMock.soktePerioder[0].tom,
        ),
      ),
    ).to.exist;
    expect(
      screen.getByText(
        tilLesbarPeriodeMedArUtenManednavn(
          soknadUtenVedtakMock.soktePerioder[1].fom,
          soknadUtenVedtakMock.soktePerioder[1].tom,
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

  it("viser søknadsstatus i stedet for knapp når søknaden har vedtak", async () => {
    stubSoknaderQuery({ soknader: [soknadMedVedtakMock] });

    renderUtenlandsopphold();

    expect(await screen.findByText("Innvilget")).to.exist;
    expect(screen.queryByRole("button", { name: "Start behandling" })).to.not
      .exist;
  });

  it("viser melding om ingen søknader når listen er tom", async () => {
    stubSoknaderQuery({ soknader: [] });

    renderUtenlandsopphold();

    expect(
      await screen.findByText("Ingen mottatte søknader eller fattede vedtak"),
    ).to.exist;
  });
});
