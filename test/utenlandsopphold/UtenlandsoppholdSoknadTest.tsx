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
import {
  SoknadDTO,
  SoknaderResponseDTO,
  SoknadStatusDTO,
  SoknadVedtakPostDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { utenlandsoppholdQueryKeys } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "@/mocks/common/mockConstants";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import {
  mockSoknaderResponse,
  soknadUtenVedtakMock,
} from "@/mocks/isutenlandsopphold/mockIsutenlandsopphold";
import { utenlandsoppholdPath } from "@/AppRouter.tsx";
import { clickButton } from "../testUtils";

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

const stubSoknaderQuery = (response: SoknaderResponseDTO) =>
  mockServer.use(
    http.post(`*${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () =>
      HttpResponse.json(response),
    ),
  );

/**
 * Stubber både henting og innsending av søknader med en delt, muterbar tilstand,
 * slik at et evt. refetch av søknadslisten etter et fattet vedtak reflekterer
 * den oppdaterte statusen, i stedet for alltid å returnere den opprinnelige mocken.
 */
const stubSoknaderMedMuterbarTilstand = (soknader: SoknadDTO[]) => {
  let tilstand = soknader;

  mockServer.use(
    http.post(`*${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () =>
      HttpResponse.json({ soknader: tilstand }),
    ),
    http.post<{ soknadId: string }, SoknadVedtakPostDTO>(
      `*${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/vedtak`,
      async ({ request, params }) => {
        const vedtak = await request.json();
        const soknadId = params.soknadId;
        const oppdatertSoknad = tilstand.find(
          (soknad) => soknad.soknadId === soknadId,
        );

        if (!oppdatertSoknad) {
          return HttpResponse.text(
            `Did not find soknad with uuid ${soknadId}`,
            { status: 400 },
          );
        }

        const nySoknad: SoknadDTO = {
          ...oppdatertSoknad,
          status: SoknadStatusDTO.INNVILGET,
          vedtak: {
            utfall: vedtak.utfall,
            innvilgetePerioder: vedtak.innvilgetePerioder,
            fattetAv: VEILEDER_DEFAULT.ident,
            fattetTidspunkt: new Date().toISOString(),
          },
        };
        tilstand = tilstand.map((soknad) =>
          soknad.soknadId === soknadId ? nySoknad : soknad,
        );

        return HttpResponse.json({ soknad: nySoknad });
      },
    ),
  );
};

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

    expect(
      await screen.findByRole("button", { name: "Godkjenn og send vedtak" }),
    ).to.exist;
    expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    expect(screen.getByRole("button", { name: "Vis hele søknaden" })).to.exist;
    expect(screen.getByRole("button", { name: "Tilbake" })).to.exist;
  });

  it("viser melding om at søknaden er behandlet når status ikke er MOTTATT", async () => {
    const behandletSoknad = {
      ...soknadUtenVedtakMock,
      status: SoknadStatusDTO.INNVILGET,
    };
    stubSoknaderQuery({ soknader: [behandletSoknad] });

    renderUtenlandsoppholdSoknad();

    expect(await screen.findByText("Denne søknaden er allerede behandlet")).to
      .exist;
  });

  it("sender vedtak, viser notifikasjon og navigerer tilbake til listen der søknadens status nå vises som innvilget", async () => {
    stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);

    renderUtenlandsoppholdSoknad(
      soknadUtenVedtakMock.soknadId,
      utenlandsoppholdPath,
    );

    expect(await screen.findByRole("button", { name: "Start behandling" })).to
      .exist;

    await clickButton("Start behandling");

    await screen.findByRole("button", { name: "Godkjenn og send vedtak" });
    await clickButton("Godkjenn og send vedtak");

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

  it("navigerer ikke bort og viser ingen notifikasjon hvis sending av vedtak feiler", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });
    mockServer.use(
      http.post(
        `*${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/vedtak`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderUtenlandsoppholdSoknad();

    await screen.findByRole("button", { name: "Godkjenn og send vedtak" });
    await clickButton("Godkjenn og send vedtak");

    await waitFor(() => {
      const vedtakMutation = queryClient.getMutationCache().getAll().pop();
      expect(vedtakMutation?.state.status).to.equal("error");
    });
    expect(screen.getByRole("button", { name: "Godkjenn og send vedtak" })).to
      .exist;
  });
});
