import { render, screen, within } from "@testing-library/react";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VIRKSOMHET_BRANNOGBIL,
} from "@/mocks/common/mockConstants";
import { queryClientWithMockData } from "../testQueryClient";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

import { addDays, addWeeks, tilDatoMedManedNavn } from "@/utils/datoUtils";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { oppfolgingsplanerLPSMock } from "@/mocks/lps-oppfolgingsplan-mottak/oppfolgingsplanLPSMock";
import dayjs from "dayjs";
import {
  createOppfolgingstilfelleFromSykmelding,
  setSykmeldingDataFromOppfolgingstilfelle,
} from "../utils/oppfolgingstilfelleUtils";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";

let queryClient: QueryClient;

const renderUtdragFraSykefravaeret = (
  oppfolgingstilfelle?: OppfolgingstilfelleDTO
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <UtdragFraSykefravaeret
        selectedOppfolgingstilfelle={oppfolgingstilfelle}
      />
    </QueryClientProvider>
  );
};
const url = "syfomodiaperson.intern.dev.nav.no";

const sykmeldingNow = {
  ...sykmeldingerMock[0],
  sykmeldingsperioder: [
    {
      fom: addDays(new Date(), -10).toString(),
      tom: addDays(new Date(), 10).toString(),
      type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
      reisetilskudd: false,
    },
  ],
};

const sykmeldingIkkeTattIBruk = {
  ...sykmeldingNow,
  sykmeldingStatus: {
    statusEvent: "APEN",
    timestamp: "2020-01-29T09:38:05.414834Z",
    arbeidsgiver: {
      orgnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
      juridiskOrgnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
      orgNavn: VIRKSOMHET_BRANNOGBIL.virksomhetsnavn,
    },
    sporsmalOgSvarListe: null,
  },
};

describe("UtdragFraSykefravaeret", () => {
  beforeAll(() => {
    queryClient = queryClientWithMockData();
    vi.stubGlobal("location", {
      host: url,
      href: url,
    });
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("viser spinnsyn-lenke til vedtak", () => {
    renderUtdragFraSykefravaeret();

    expect(screen.getByRole("heading", { name: "Vedtak" })).to.exist;
    const link = screen.getByRole("link", {
      name: `Se vedtakene slik ${ARBEIDSTAKER_DEFAULT_FULL_NAME} ser dem på nav.no Ekstern lenke`,
    });
    expect(link.getAttribute("href")).to.contain("spinnsyn-frontend-interne");
    expect(link.getAttribute("href")).to.contain("/syk/sykepenger");
  });

  it("Viser sykmeldinger med sykmelder og arbeidsgiver", () => {
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    setSykmeldingDataFromOppfolgingstilfelle(
      [sykmeldingNow],
      oppfolgingstilfeller,
      queryClient
    );
    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    const firstExpansionCard = screen.getAllByRole("region")[0];
    expect(within(firstExpansionCard).getByText("Sykmelder:")).to.exist;
    expect(within(firstExpansionCard).getByText("Lego Las Legesen")).to.exist;
    expect(within(firstExpansionCard).getByText("Arbeidsgiver:")).to.exist;
    expect(within(firstExpansionCard).getByText("Virksomhet uten leder AS")).to
      .exist;
  });

  it("Viser sykmeldinger som både er sendt og ikke tatt i bruk", () => {
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
      sykmeldingIkkeTattIBruk,
    ]);
    setSykmeldingDataFromOppfolgingstilfelle(
      [sykmeldingNow, sykmeldingIkkeTattIBruk],
      oppfolgingstilfeller,
      queryClient
    );
    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    const sykmeldingExpansionCards = screen.getAllByRole("region");
    expect(sykmeldingExpansionCards.length).to.equal(2);

    expect(within(sykmeldingExpansionCards[1]).getByText("Ikke tatt i bruk")).to
      .exist;
  });

  it("Viser sykmelding uten arbeidsgiver tag", () => {
    const sykmeldingUtenArbeidsgiver = sykmeldingerMock.filter(
      (sykmelding) => sykmelding.id === "8361e922-2c92-4aa8-811d-e53ca958dc6a"
    );
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding(
      sykmeldingUtenArbeidsgiver
    );
    setSykmeldingDataFromOppfolgingstilfelle(
      sykmeldingUtenArbeidsgiver,
      oppfolgingstilfeller,
      queryClient
    );
    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    const sykmeldingExpansionCards = screen.getAllByRole("region");
    expect(sykmeldingExpansionCards.length).to.equal(1);

    expect(within(sykmeldingExpansionCards[0]).getByText("Uten arbeidsgiver"))
      .to.exist;
  });

  it("Viser oppfolgingsplan fra LPS innenfor oppfolgingstilfelle", () => {
    const oppfolgingsplanCreatedAt = new Date();
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [oppfolgingsplanerLPSMock(oppfolgingsplanCreatedAt)[0]]
    );
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    expect(screen.getByText("110110110 (pdf)")).to.exist;
    expect(
      screen.getByText(
        `innsendt ${tilDatoMedManedNavn(
          dayjs(oppfolgingsplanCreatedAt).subtract(1, "days").toDate()
        )} (LPS)`
      )
    ).to.exist;
  });

  it("Viser ikke oppfolgingsplan fra LPS når den er utenfor oppfolgingstilfellet", () => {
    const oppfolgingsplanCreatedAt = addWeeks(new Date(), -4);
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [oppfolgingsplanerLPSMock(oppfolgingsplanCreatedAt)[0]]
    );
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    expect(screen.getByText("Ingen planer er delt med Nav")).to.exist;
    expect(screen.queryByText("110110110 (pdf)")).to.not.exist;
    expect(
      screen.queryByText(
        `innsendt ${tilDatoMedManedNavn(
          dayjs(oppfolgingsplanCreatedAt).subtract(1, "days").toDate()
        )} (LPS)`
      )
    ).to.not.exist;
  });
});
