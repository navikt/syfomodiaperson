import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import HistorikkContainer from "@/sider/historikk/container/HistorikkContainer";
import { renderWithRouter } from "../testRouterUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
} from "@/mocks/common/mockConstants";
import { historikkQueryKeys } from "@/data/historikk/historikkQueryHooks";
import { historikkmotebehovMock } from "@/mocks/syfomotebehov/historikkmotebehovMock";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";
import { historikkPath } from "@/routers/AppRouter";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { oppfolgingstilfellePersonMock } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { veilederBrukerKnytningQueryKeys } from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";

let queryClient: QueryClient;

const renderHistorikk = () =>
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <HistorikkContainer />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    historikkPath,
    [historikkPath]
  );

function setupTestdataHistorikk() {
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => oppfolgingstilfellePersonMock
  );
  queryClient.setQueryData(
    historikkQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    historikkQueryKeys.oppfolgingsplan(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    aktivitetskravQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  queryClient.setQueryData(
    vedtakQueryKeys.vedtak(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    dialogmotekandidatQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    veilederBrukerKnytningQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
}

describe("Historikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    setupTestdataHistorikk();
  });

  it("viser tilbakemelding når ingen historikk", async () => {
    renderHistorikk();

    expect(await screen.findAllByText("Logg")).to.exist;
    expect(screen.getByText("Denne personen har ingen oppfølgingshistorikk")).to
      .exist;
    expect(
      screen.getByText(
        "Når en sykmeldt blir fulgt opp vil oppfølgingen bli loggført her slik at du får oversikt over hva som har skjedd og hvem som har vært involvert i oppfølgingen."
      )
    ).to.exist;
  });

  it("viser select/dropdown med oppfolgingstilfeller når person har hendelser", async () => {
    queryClient.setQueryData(
      ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
      () => LEDERE_DEFAULT
    );
    renderHistorikk();

    expect(await screen.findAllByText("Logg")).to.exist;
    expect(screen.getByLabelText("Sykefraværstilfelle")).to.exist;
    expect(screen.getByText("Sykefraværstilfelle")).to.exist;
    expect(
      screen.getByRole("option", { name: "21. februar – 10. desember 2024" })
    ).to.exist;
    expect(
      screen.queryByRole("option", { name: "Utenfor sykefraværstilfelle" })
    ).to.not.exist;
  });

  it("viser select/dropdown med valg om hendelser utenfor oppfolgingstilfelle", async () => {
    queryClient.setQueryData(
      historikkQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [historikkmotebehovMock]
    );
    renderHistorikk();

    expect(await screen.findAllByText("Logg")).to.exist;
    expect(
      screen.getByRole("option", { name: "21. februar – 10. desember 2024" })
    ).to.exist;
    expect(screen.getByRole("option", { name: "Utenfor sykefraværstilfelle" }))
      .to.exist;
  });
});
