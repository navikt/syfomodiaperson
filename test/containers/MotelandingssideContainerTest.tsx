import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import Motelandingsside from "@/sider/dialogmoter/Motelandingsside";
import { QueryClientProvider } from "@tanstack/react-query";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { stubTilgangApi } from "../stubs/stubIstilgangskontroll";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "@/mocks/istilgangskontroll/tilgangtilbrukerMock";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { MemoryRouter } from "react-router-dom";
import { brukerQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { dialogmoteunntakQueryKeys } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";
import {
  MotebehovInnmelder,
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
} from "@/data/motebehov/types/motebehovTypes";
import { defaultFormValue } from "@/mocks/syfomotebehov/motebehovMock";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient: any;

const motebehovData: MotebehovVeilederDTO[] = [
  {
    id: "33333333-ee10-44b6-bddf-54d049ef25f2",
    opprettetDato: new Date(),
    virksomhetsnummer: "000999000",
    behandletTidspunkt: new Date(),
    behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
    opprettetAvNavn: VEILEDER_IDENT_DEFAULT.toString(),
    arbeidstakerFnr: ARBEIDSTAKER_DEFAULT.personIdent,
    innmelderType: MotebehovInnmelder.ARBEIDSTAKER,
    skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
    formValues: {
      ...defaultFormValue,
    },
  },
];

const renderMotelandingsside = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: "", setValgtEnhet: () => void 0 }}
      >
        <MemoryRouter>
          <Motelandingsside />
        </MemoryRouter>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("MotelandingssideSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );
    queryClient.setQueryData(dialogmoterQueryKeys.dialogmoter(fnr), () => []);
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplaner(fnr),
      () => []
    );
    queryClient.setQueryData(
      motebehovQueryKeys.motebehov(fnr),
      () => motebehovData
    );
    queryClient.setQueryData(ledereQueryKeys.ledere(fnr), () => LEDERE_DEFAULT);
    queryClient.setQueryData(dialogmoteunntakQueryKeys.unntak(fnr), () => []);
  });

  it("Skal vise AppSpinner når henter data", () => {
    stubTilgangApi();
    renderMotelandingsside();

    expect(screen.getByLabelText("Vent litt mens siden laster")).to.exist;
  });

  it("Skal vise AppSpinner når henter tilgang", async () => {
    stubTilgangApi();
    renderMotelandingsside();

    expect(await screen.findByLabelText("Vent litt mens siden laster")).to
      .exist;
  });

  it("Skal vise feilmelding hvis ikke tilgang", async () => {
    stubTilgangApi({
      erGodkjent: false,
      erAvslatt: true,
    });
    renderMotelandingsside();

    expect(
      await screen.findByRole("heading", {
        name: "Du har ikke tilgang til denne tjenesten",
      })
    ).to.exist;
  });

  it("Skal vise Planlegg nytt dialogmøte når det ikke finnes møter", () => {
    queryClient.setQueryData(
      tilgangQueryKeys.tilgang(fnr),
      () => tilgangBrukerMock
    );
    renderMotelandingsside();

    expect(
      screen.getByRole("heading", {
        name: "Planlegg nytt dialogmøte",
      })
    ).to.exist;
  });
});
