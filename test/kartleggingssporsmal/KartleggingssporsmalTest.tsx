import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import KartleggingssporsmalSide from "@/sider/kartleggingssporsmal/KartleggingssporsmalSide";
import { kartleggingssporsmalQueryKeys } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import {
  kartleggingIsKandidatAndAnsweredQuestions,
  kartleggingIsKandidatAndReceivedQuestions,
  kartleggingssporsmalFerdigbehandlet,
  kartleggingssporsmalVurderingFerdigbehandlet,
} from "@/mocks/ismeroppfolging/mockIsmeroppfolging";
import { kartleggingssporsmalAnswered } from "@/mocks/meroppfolging-backend/merOppfolgingMock";
import {
  ARBEIDSTAKER_DEFAULT,
  BEHANDLENDE_ENHET_DEFAULT,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { renderWithRouter } from "../testRouterUtils";
import { appRoutePath } from "@/AppRouter";
import { screen } from "@testing-library/react";
import {
  clickButton,
  daysFromToday,
  getButton,
  queryButton,
} from "../testUtils";
import {
  stubDefaultIsmeroppfolging,
  stubVurderSvarError,
} from "../stubs/stubIsmeroppfolging";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { kontaktinformasjonMock } from "@/mocks/syfoperson/persondataMock";
import { generateUUID } from "@/utils/utils";
import { mockUnleashTogglesOffResponse } from "@/mocks/unleashMocks.ts";
import { unleashQueryKeys } from "@/data/unleash/unleashQueryHooks.ts";
import { ToggleNames } from "@/data/unleash/unleash_types.ts";

let queryClient: QueryClient;

const mockKartleggingssporsmalKandidat = (
  kartleggingssporsmalKandidatResponseDTO: KartleggingssporsmalKandidatResponseDTO | null,
  fnr: string
) => {
  queryClient.setQueryData(
    kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(fnr),
    () => [kartleggingssporsmalKandidatResponseDTO]
  );
};

const mockKartleggingssporsmalKandidater = (
  kartleggingssporsmalKandidatResponseDTOs: KartleggingssporsmalKandidatResponseDTO[],
  fnr: string
) => {
  queryClient.setQueryData(
    kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(fnr),
    () => kartleggingssporsmalKandidatResponseDTOs
  );
};

const mockKartleggingssporsmalSvar = (
  kartleggingssporsmalSvarResponseDTO: KartleggingssporsmalSvarResponseDTO | null,
  kandidatUuid: string
) => {
  queryClient.setQueryData(
    kartleggingssporsmalQueryKeys.kartleggingssporsmalSvar(kandidatUuid),
    () => kartleggingssporsmalSvarResponseDTO
  );
};

const mockEnabledToggles = (enabledToggles: ToggleNames[]) =>
  queryClient.setQueryData(
    unleashQueryKeys.toggles(
      BEHANDLENDE_ENHET_DEFAULT.enhetId,
      VEILEDER_IDENT_DEFAULT
    ),
    () => ({
      ...mockUnleashTogglesOffResponse,
      ...enabledToggles.reduce((accumulator, toggleName) => {
        return { ...accumulator, [toggleName]: true };
      }, {}),
    })
  );

const renderKartleggingssporsmal = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{
          valgtEnhet: BEHANDLENDE_ENHET_DEFAULT.enhetId,
          setValgtEnhet: () => void 0,
        }}
      >
        <KartleggingssporsmalSide />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    `${appRoutePath}/kartleggingssporsmal`,
    [`${appRoutePath}/kartleggingssporsmal`]
  );
};

describe("Kartleggingssporsmal", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      brukerQueryKeys.kontaktinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => kontaktinformasjonMock
    );
    mockEnabledToggles([]);
  });

  it("Sykmeldt is not kandidat", () => {
    mockKartleggingssporsmalKandidat(null, ARBEIDSTAKER_DEFAULT.personIdent);

    renderKartleggingssporsmal();

    expect(
      screen.getByText("Den sykmeldte har ikke mottatt kartleggingsspørsmål", {
        exact: false,
      })
    ).to.exist;
  });

  it("Sykmeldt is kandidat and has not answered questions", () => {
    mockKartleggingssporsmalKandidat(
      kartleggingIsKandidatAndReceivedQuestions,
      ARBEIDSTAKER_DEFAULT.personIdent
    );

    renderKartleggingssporsmal();

    expect(screen.queryByText("Den sykmeldte har ikke svart")).to.exist;
    expect(screen.queryByText("Spørsmålene ble sendt", { exact: false })).to
      .exist;
    expect(screen.queryByText("Slik ser spørsmålene ut for den sykmeldte")).to
      .exist;
    expect(
      screen.queryByText("Ved manglende svar vil vi automatisk sende", {
        exact: false,
      })
    ).to.exist;
    expect(
      screen.queryByText("Svarene fra den sykmeldte skal", {
        exact: false,
      })
    ).to.exist;

    expect(queryButton("Svarene er vurdert, fjern oppgaven")).to.not.exist;
  });

  it("Sykmeldt is kandidat, but was not varslet (kandidat pre-pilot)", () => {
    const kandidatNotVarslet = {
      ...kartleggingIsKandidatAndReceivedQuestions,
      varsletAt: null,
    };
    mockKartleggingssporsmalKandidat(
      kandidatNotVarslet,
      ARBEIDSTAKER_DEFAULT.personIdent
    );

    renderKartleggingssporsmal();

    expect(
      screen.getByText("Den sykmeldte har ikke mottatt kartleggingsspørsmål", {
        exact: false,
      })
    ).to.exist;
  });

  it("Sykmeldt is kandidat, is reservert, and has not answered questions", () => {
    mockKartleggingssporsmalKandidat(
      kartleggingIsKandidatAndReceivedQuestions,
      ARBEIDSTAKER_DEFAULT.personIdent
    );
    const kontaktinfo = {
      ...kontaktinformasjonMock,
      skalHaVarsel: false,
    };
    queryClient.setQueryData(
      brukerQueryKeys.kontaktinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => kontaktinfo
    );

    renderKartleggingssporsmal();

    expect(screen.getByText("Den sykmeldte har ikke svart")).to.exist;
    expect(screen.getByText("Spørsmålene ble sendt", { exact: false })).to
      .exist;
    expect(screen.getByText("Slik ser spørsmålene ut for den sykmeldte")).to
      .exist;
    expect(
      screen.getByText(
        "Den sykmeldte er ikke pålagt å svare. Det skal derfor ikke sendes forhåndsvarsel for brudd på folketrygdloven § 8-8 dersom det ikke kommer inn et svar."
      )
    ).to.exist;
    expect(screen.getByText("Brukeren er reservert fra digital kommunikasjon"))
      .to.exist;

    expect(queryButton("Svarene er vurdert, fjern oppgaven")).to.not.exist;
  });

  it("Sykmeldt is kandidat and has answered questions", () => {
    mockKartleggingssporsmalKandidat(
      kartleggingIsKandidatAndAnsweredQuestions,
      ARBEIDSTAKER_DEFAULT.personIdent
    );
    mockKartleggingssporsmalSvar(
      kartleggingssporsmalAnswered,
      kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
    );

    renderKartleggingssporsmal();

    expect(screen.queryByText("Den sykmeldte svarte", { exact: false })).to
      .exist;
    expect(screen.queryByText("Spørsmålene ble sendt", { exact: false })).to
      .exist;
    expect(screen.queryByText("Slik ser spørsmålene ut for den sykmeldte")).to
      .exist;
    expect(screen.getAllByRole("radiogroup").length).toBe(3);

    expect(
      screen.getAllByRole("radiogroup", {
        name: RegExp(
          "Hvor sannsynlig er det at du kommer tilbake i jobben du ble sykmeldt fra?"
        ),
      })[0]
    ).to.exist;
    expect(
      screen.getByRole("radio", {
        name: "Jeg er usikker",
        checked: true,
      })
    ).to.exist;

    expect(
      screen.getAllByRole("radiogroup", {
        name: RegExp(
          "Hvordan vil du beskrive samarbeidet og relasjonen mellom deg og arbeidsgiveren din?"
        ),
      })[0]
    ).to.exist;
    expect(
      screen.getByRole("radio", {
        name: "Jeg opplever samarbeidet og relasjonen som dårlig",
        checked: true,
      })
    ).to.exist;

    expect(
      screen.getAllByRole("radiogroup", {
        name: RegExp("Hvor lenge tror du at du kommer til å være sykmeldt?"),
      })[0]
    ).to.exist;
    expect(
      screen.getByRole("radio", {
        name: "Mindre enn seks måneder",
        checked: true,
      })
    ).to.exist;

    expect(
      screen.queryByText("Svarene fra den sykmeldte skal", {
        exact: false,
      })
    ).to.exist;
    expect(screen.queryByText("Utdrag fra sykefraværet")).to.exist;

    expect(getButton("Svarene er vurdert, fjern oppgaven")).to.exist;
  });

  it("Sykmeldt is ferdigbehandlet", () => {
    mockKartleggingssporsmalKandidat(
      kartleggingssporsmalFerdigbehandlet,
      ARBEIDSTAKER_DEFAULT.personIdent
    );
    mockKartleggingssporsmalSvar(
      kartleggingssporsmalAnswered,
      kartleggingssporsmalFerdigbehandlet.kandidatUuid
    );

    renderKartleggingssporsmal();

    expect(screen.queryByText("Den sykmeldte svarte", { exact: false })).to
      .exist;
    expect(screen.queryByText("Spørsmålene ble sendt", { exact: false })).to
      .exist;
    expect(screen.queryByText("Slik ser spørsmålene ut for den sykmeldte")).to
      .exist;

    expect(
      screen.queryByText(`Oppgaven er behandlet av ${VEILEDER_DEFAULT.ident}`)
    ).to.exist;

    expect(screen.queryByText(`Velg alternativet som passer vurderingen`)).to
      .not.exist;
  });

  it("Sykmeldt is ferdigbehandlet with vurdering", () => {
    mockEnabledToggles([ToggleNames.isVurderingssideKartleggingEnabled]);

    mockKartleggingssporsmalKandidat(
      kartleggingssporsmalVurderingFerdigbehandlet,
      ARBEIDSTAKER_DEFAULT.personIdent
    );
    mockKartleggingssporsmalSvar(
      kartleggingssporsmalAnswered,
      kartleggingssporsmalVurderingFerdigbehandlet.kandidatUuid
    );

    renderKartleggingssporsmal();

    expect(screen.queryByText("Den sykmeldte svarte", { exact: false })).to
      .exist;
    expect(screen.queryByText("Spørsmålene ble sendt", { exact: false })).to
      .exist;
    expect(screen.queryByText("Slik ser spørsmålene ut for den sykmeldte")).to
      .exist;

    expect(
      screen.queryByText(`Oppgaven er behandlet av ${VEILEDER_DEFAULT.ident}`)
    ).to.exist;

    expect(
      screen.queryByText(
        `Jeg vurderer at den sykmeldte ikke har behov for oppfølging`
      )
    ).to.exist;
  });

  describe("Evaluate answers to kartleggingsspørsmål", () => {
    it("API returning Ok will show success message", async () => {
      mockKartleggingssporsmalKandidat(
        kartleggingIsKandidatAndAnsweredQuestions,
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );
      stubDefaultIsmeroppfolging(false);

      renderKartleggingssporsmal();

      await clickButton("Svarene er vurdert, fjern oppgaven");
      expect(await screen.findByText("Oppgaven er behandlet av Z990000")).to
        .exist;
    });

    it("API returning error will show error message", async () => {
      mockKartleggingssporsmalKandidat(
        kartleggingIsKandidatAndAnsweredQuestions,
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );
      stubVurderSvarError();

      renderKartleggingssporsmal();

      await clickButton("Svarene er vurdert, fjern oppgaven");
      expect(
        await screen.findByText(
          "Det skjedde en uventet feil. Vennligst prøv igjen senere."
        )
      ).to.exist;
    });
  });

  describe("Evaluate answers to kartleggingsspørsmål with vurdering", () => {
    it("Submitting without choosing an option shows error message", async () => {
      mockEnabledToggles([ToggleNames.isVurderingssideKartleggingEnabled]);

      mockKartleggingssporsmalKandidat(
        kartleggingIsKandidatAndAnsweredQuestions,
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );
      stubVurderSvarError();

      renderKartleggingssporsmal();

      await clickButton("Lagre vurdering, fjern oppgaven");
      expect(await screen.findByText("Du må velge et alternativ")).to.exist;
    });

    it("API returning Ok will show success message", async () => {
      mockEnabledToggles([ToggleNames.isVurderingssideKartleggingEnabled]);

      mockKartleggingssporsmalKandidat(
        kartleggingIsKandidatAndAnsweredQuestions,
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );
      stubDefaultIsmeroppfolging(true);

      renderKartleggingssporsmal();

      await screen
        .getByLabelText(
          "Jeg vurderer at den sykmeldte har risiko for langtidsfravær og behov for oppfølging"
        )
        .click();
      await clickButton("Lagre vurdering, fjern oppgaven");
      expect(await screen.findByText("Oppgaven er behandlet av Z990000")).to
        .exist;
    });

    it("API returning error will show error message", async () => {
      mockEnabledToggles([ToggleNames.isVurderingssideKartleggingEnabled]);

      mockKartleggingssporsmalKandidat(
        kartleggingIsKandidatAndAnsweredQuestions,
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );
      stubVurderSvarError();

      renderKartleggingssporsmal();

      await screen
        .getByLabelText(
          "Jeg vurderer at den sykmeldte har risiko for langtidsfravær og behov for oppfølging"
        )
        .click();
      await clickButton("Lagre vurdering, fjern oppgaven");
      expect(
        await screen.findByText(
          "Det skjedde en uventet feil. Vennligst prøv igjen senere."
        )
      ).to.exist;
    });
  });

  describe("KartleggingssporsmalHistorikk", () => {
    const tidligereKandidatMedSvar: KartleggingssporsmalKandidatResponseDTO = {
      ...kartleggingssporsmalFerdigbehandlet,
      kandidatUuid: generateUUID(),
      svarAt: daysFromToday(-30),
      vurdering: {
        vurdertAt: daysFromToday(-25),
        vurdertBy: VEILEDER_DEFAULT.ident,
      },
    };

    const tidligereKandidatUtenSvar: KartleggingssporsmalKandidatResponseDTO = {
      ...kartleggingIsKandidatAndReceivedQuestions,
      kandidatUuid: generateUUID(),
      status: KandidatStatus.KANDIDAT,
      svarAt: null,
      vurdering: null,
    };

    it("renders nothing when there are no previous kandidater", () => {
      mockKartleggingssporsmalKandidater(
        [kartleggingIsKandidatAndAnsweredQuestions],
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );

      renderKartleggingssporsmal();

      expect(screen.queryByRole("heading", { level: 2, name: "Historikk" })).to
        .not.exist;
    });

    it("renders nothing when previous kandidater have not answered", () => {
      mockKartleggingssporsmalKandidater(
        [kartleggingIsKandidatAndAnsweredQuestions, tidligereKandidatUtenSvar],
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );

      renderKartleggingssporsmal();

      expect(screen.queryByRole("heading", { level: 2, name: "Historikk" })).to
        .not.exist;
    });

    it("renders historikk header when there are previous kandidater with svar", () => {
      mockKartleggingssporsmalKandidater(
        [kartleggingIsKandidatAndAnsweredQuestions, tidligereKandidatMedSvar],
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        tidligereKandidatMedSvar.kandidatUuid
      );

      renderKartleggingssporsmal();

      expect(screen.queryByRole("heading", { level: 2, name: "Historikk" })).to
        .exist;
      expect(screen.getByText("Tidligere svar på kartleggingsspørsmål")).to
        .exist;
    });

    it("renders accordion with svar date as header", () => {
      mockKartleggingssporsmalKandidater(
        [kartleggingIsKandidatAndAnsweredQuestions, tidligereKandidatMedSvar],
        ARBEIDSTAKER_DEFAULT.personIdent
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        kartleggingIsKandidatAndAnsweredQuestions.kandidatUuid
      );
      mockKartleggingssporsmalSvar(
        kartleggingssporsmalAnswered,
        tidligereKandidatMedSvar.kandidatUuid
      );

      renderKartleggingssporsmal();

      expect(
        screen.getAllByText("Sykmeldte svarte", { exact: false }).length
      ).toBeGreaterThanOrEqual(1);
    });
  });
});
