import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createRef } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../../../testQueryClient";
import { oppfolgingsplanQueryKeys } from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
} from "@/mocks/common/mockConstants";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import {
  behandlendeEnhetMockResponse,
  ingenTildeltOppfolgingsenhet,
} from "@/mocks/syfobehandlendeenhet/behandlendeEnhetMock";
import { getButton, queryButton } from "../../../testUtils";
import { diskresjonskodeQueryKeys } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { egenansattQueryKeys } from "@/data/egenansatt/egenansattQueryHooks";
import OppfolgingsenhetInnhold from "@/components/oppfolgingsenhet/OppfolgingsenhetInnhold";

let queryClient: QueryClient;

const renderOppfolgingsenhetInnhold = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <OppfolgingsenhetInnhold modalRef={createRef<HTMLDialogElement>()} />
    </QueryClientProvider>
  );

describe("Tildele", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplaner(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => []
    );
    queryClient.setQueryData(
      ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [LEDERE_DEFAULT[0]]
    );
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => behandlendeEnhetMockResponse
    );
    queryClient.setQueryData(
      diskresjonskodeQueryKeys.diskresjonskode(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => undefined
    );
    queryClient.setQueryData(
      egenansattQueryKeys.egenansatt(ARBEIDSTAKER_DEFAULT.personIdent),
      () => undefined
    );
  });

  it("Ikke tildelt oppfølgingsenhet", async () => {
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => ingenTildeltOppfolgingsenhet
    );

    renderOppfolgingsenhetInnhold();

    expect(screen.getByText("Oppfølgingsenhet")).to.exist;
    expect(screen.getByText("NAV Grünerløkka (0315)")).to.exist;
    expect(screen.getByText("Kontortilhørighet: NAV Grünerløkka (0315)")).to
      .exist;
    expect(screen.queryByText("Endret:")).to.not.exist;

    expect(getButton("Endre")).to.exist;
  });

  it("Tildelt oppfølgingsenhet", async () => {
    renderOppfolgingsenhetInnhold();

    expect(screen.getByText("Oppfølgingsenhet")).to.exist;
    expect(screen.getByText("NAV Oppfølging utland (0393)")).to.exist;
    expect(screen.getByText("Kontortilhørighet: NAV Grünerløkka (0315)")).to
      .exist;
    expect(screen.getByText("Endret: 15.10.2024")).to.exist;

    expect(getButton("Endre")).to.exist;
  });

  it("Vis varsel hvis syfobehandlendeenhet returnerer noContent (finner ikke geografisk enhet)", async () => {
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => ""
    );

    renderOppfolgingsenhetInnhold();

    expect(screen.getByText("Henting av kontortilhørighet feilet")).to.exist;
  });

  describe("kanTildeleOppfolgingsenhet", async () => {
    it.each([
      [undefined, undefined],
      [false, undefined],
    ])(
      "Kan tildele oppfølgingsenhet når isEgenAnsatt: %s og diskresjonskode: %s",
      async (isEgenAnsatt, diskresjonskode) => {
        queryClient.setQueryData(
          diskresjonskodeQueryKeys.diskresjonskode(
            ARBEIDSTAKER_DEFAULT.personIdent
          ),
          () => diskresjonskode
        );
        queryClient.setQueryData(
          egenansattQueryKeys.egenansatt(ARBEIDSTAKER_DEFAULT.personIdent),
          () => isEgenAnsatt
        );

        renderOppfolgingsenhetInnhold();

        expect(queryButton("Endre")).to.exist;
      }
    );

    it.each([
      [undefined, "6"],
      [undefined, "7"],
      [false, "6"],
      [false, "7"],
      [true, undefined],
      [true, "6"],
      [true, "7"],
    ])(
      "Kan ikke tildele oppfølgingsenhet når isEgenAnsatt: %s og diskresjonskode: %s",
      async (isEgenAnsatt, diskresjonskode) => {
        queryClient.setQueryData(
          diskresjonskodeQueryKeys.diskresjonskode(
            ARBEIDSTAKER_DEFAULT.personIdent
          ),
          () => diskresjonskode
        );
        queryClient.setQueryData(
          egenansattQueryKeys.egenansatt(ARBEIDSTAKER_DEFAULT.personIdent),
          () => isEgenAnsatt
        );

        renderOppfolgingsenhetInnhold();

        expect(queryButton("Endre")).to.not.exist;
      }
    );
  });
});
