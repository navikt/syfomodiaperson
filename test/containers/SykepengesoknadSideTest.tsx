import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "@/mocks/istilgangskontroll/tilgangtilbrukerMock";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { sykepengesoknaderQueryKeys } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { renderWithRouter } from "../testRouterUtils";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";
import SykepengesoknadSide from "@/sider/sykepengsoknader/container/SykepengesoknadSide";
import { soknaderMock } from "@/mocks/sykepengesoknad/soknaderMock";

const NAERINGSDRIVENDESOKNAD_ID = "faadf7c1-3aac-4758-8673-e9cee1316a3c";
const OPPHOLD_UTLAND_ID = "e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient: any;

describe("SykepengesoknadSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );
    queryClient.setQueryData(
      tilgangQueryKeys.tilgang(fnr),
      () => tilgangBrukerMock
    );
    queryClient.setQueryData(sykmeldingerQueryKeys.sykmeldinger(fnr), () => []);
  });

  describe("Visning av sykepengesøknad for arbeidstakere", () => {
    it("Skal vise SendtSoknadArbeidstakerNy", () => {
      queryClient.setQueryData(
        sykepengesoknaderQueryKeys.sykepengesoknader(fnr),
        () => soknaderMock
      );
      renderWithRouter(
        <QueryClientProvider client={queryClient}>
          <SykepengesoknadSide />
        </QueryClientProvider>,
        "/sykefravaer/sykepengesoknader/:sykepengesoknadId",
        [`/sykefravaer/sykepengesoknader/${OPPHOLD_UTLAND_ID}`]
      );

      expect(
        screen.getByRole("heading", {
          name: "Søknad om sykepenger under opphold utenfor Norge",
        })
      ).to.exist;
    });
  });

  describe("Håndtering av feil", () => {
    it("Skal vise feilmelding hvis søknaden er en selvstendig-søknad og henting av selvstendig-søknader feiler", () => {
      queryClient.setQueryData(
        sykepengesoknaderQueryKeys.sykepengesoknader(fnr),
        () => []
      );

      renderWithRouter(
        <QueryClientProvider client={queryClient}>
          <SykepengesoknadSide />
        </QueryClientProvider>,
        "/sykefravaer/sykepengesoknader/:sykepengesoknadId",
        [`/sykefravaer/sykepengesoknader/${NAERINGSDRIVENDESOKNAD_ID}`]
      );

      expect(
        screen.getByRole("heading", {
          name: "Beklager, det oppstod en feil",
        })
      ).to.exist;
    });
  });
});
