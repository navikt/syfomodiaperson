import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LegacyTilgangBanner from "../../src/components/LegacyTilgangBanner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { queryClientWithMockData } from "../testQueryClient";
import {
  ARBEIDSTAKER_DEFAULT,
  BEHANDLENDE_ENHET_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import Side from "@/components/side/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { unleashQueryKeys } from "@/data/unleash/unleashQueryHooks";
import { mockUnleashResponse } from "@/mocks/unleashMocks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "@/mocks/istilgangskontroll/tilgangtilbrukerMock";
import { Events, setIdentifier } from "@/utils/umami";

const bannerTitle = "Du har en gammel tilgang til Modia Sykefraværsoppfølging";

describe("LegacyTilgangBanner", () => {
  it("viser advarsel om legacy tilgang", () => {
    render(<LegacyTilgangBanner />);

    expect(screen.getByText(bannerTitle)).to.exist;
  });
});

describe("LegacyTilgangBanner i Side", () => {
  let queryClient: QueryClient;

  function renderSide() {
    render(
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{
            valgtEnhet: BEHANDLENDE_ENHET_DEFAULT.enhetId,
            setValgtEnhet: () => void 0,
          }}
        >
          <MemoryRouter initialEntries={["/test"]}>
            <Routes>
              <Route
                path="/test"
                element={
                  <Side
                    tittel="Test"
                    aktivtMenypunkt={Menypunkter.SYKMELDINGER}
                  >
                    <div />
                  </Side>
                }
              />
            </Routes>
          </MemoryRouter>
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    );
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    await setIdentifier(VEILEDER_IDENT_DEFAULT);
    queryClient = queryClientWithMockData();
  });

  it("vises når toggle er true og legacyTilgang er true", async () => {
    renderSide();

    expect(screen.getByText(bannerTitle)).to.exist;

    await waitFor(() => {
      expect(umami.track).toHaveBeenCalledTimes(1);
    });
    expect(umami.track).toHaveBeenCalledWith(Events.ALERT_VIST, {
      tekst: bannerTitle,
    });
  });

  it("vises ikke når unleash toggle isNyTilgangskontrollEnabled er false", () => {
    queryClient.setQueryData(
      unleashQueryKeys.toggles(
        BEHANDLENDE_ENHET_DEFAULT.enhetId,
        VEILEDER_IDENT_DEFAULT
      ),
      () => ({
        ...mockUnleashResponse,
        [ToggleNames.isNyTilgangskontrollEnabled]: false,
      })
    );

    renderSide();

    expect(screen.queryByText(bannerTitle)).to.be.null;
    expect(umami.track).not.toHaveBeenCalled();
  });

  it("vises ikke når legacyTilgang er false", () => {
    queryClient.setQueryData(
      tilgangQueryKeys.tilgang(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({ ...tilgangBrukerMock, legacyTilgang: false })
    );

    renderSide();

    expect(screen.queryByText(bannerTitle)).to.be.null;
    expect(umami.track).not.toHaveBeenCalled();
  });
});
