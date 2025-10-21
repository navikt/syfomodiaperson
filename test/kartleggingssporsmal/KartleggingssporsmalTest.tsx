import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import KartleggingssporsmalSide from "@/sider/kartleggingssporsmal/KartleggingssporsmalSide";
import { kartleggingssporsmalQueryKeys } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import {
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarStatusResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { kartleggingIsKandidatAndReceivedQuestions } from "@/mocks/ismeroppfolging/mockIsmeroppfolging";
import {
  kartleggingssporsmalAnswered,
  kartleggingssporsmalNotAnswered,
} from "@/mocks/meroppfolging-backend/merOppfolgingMock";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { ValgtEnhetProvider } from "@/context/ValgtEnhetContext";
import { renderWithRouter } from "../testRouterUtils";
import { appRoutePath } from "@/routers/AppRouter";
import { screen } from "@testing-library/react";

let queryClient: QueryClient;

const mockKartleggingssporsmalKandidat = (
  kartleggingssporsmalKandidatResponseDTO: KartleggingssporsmalKandidatResponseDTO | null,
  fnr: string
) => {
  queryClient.setQueryData(
    kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(fnr),
    () => kartleggingssporsmalKandidatResponseDTO
  );
};

const mockKartleggingssporsmalSvar = (
  kartleggingssporsmalSvarStatusResponseDTO: KartleggingssporsmalSvarStatusResponseDTO,
  fnr: string
) => {
  queryClient.setQueryData(
    kartleggingssporsmalQueryKeys.kartleggingssporsmalSvar(fnr),
    () => kartleggingssporsmalSvarStatusResponseDTO
  );
};

const renderKartleggingssporsmal = () => {
  renderWithRouter(
    <ValgtEnhetProvider>
      <QueryClientProvider client={queryClient}>
        <KartleggingssporsmalSide />
      </QueryClientProvider>
    </ValgtEnhetProvider>,
    `${appRoutePath}/kartleggingssporsmal`,
    [`${appRoutePath}/kartleggingssporsmal`]
  );
};

describe("Kartleggingssporsmal", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
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
    mockKartleggingssporsmalSvar(
      kartleggingssporsmalNotAnswered,
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
      screen.queryByText("Svarene fra den sykmeldte skal være", {
        exact: false,
      })
    ).to.exist;
  });

  it("Sykmeldt is kandidat and has answered questions", () => {
    mockKartleggingssporsmalKandidat(
      kartleggingIsKandidatAndReceivedQuestions,
      ARBEIDSTAKER_DEFAULT.personIdent
    );
    mockKartleggingssporsmalSvar(
      kartleggingssporsmalAnswered,
      ARBEIDSTAKER_DEFAULT.personIdent
    );

    renderKartleggingssporsmal();

    expect(screen.queryByText("Svar mottatt", { exact: false })).to.exist;
    expect(screen.getAllByRole("group").length).toBe(3);

    expect(
      screen.getAllByRole("group", {
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
      screen.getAllByRole("group", {
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
      screen.getAllByRole("group", {
        name: RegExp("Hvor lenge tror du at du kommer til å være sykmeldt?"),
      })[0]
    ).to.exist;
    expect(
      screen.getByRole("radio", {
        name: "Mindre enn seks måneder",
        checked: true,
      })
    ).to.exist;
  });
});
