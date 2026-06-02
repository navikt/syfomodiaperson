import { render, screen, within } from "@testing-library/react";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import { queryClientWithMockData } from "../testQueryClient";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

import { addDays, addWeeks, tilDatoMedManedNavn } from "@/utils/datoUtils";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";
import { oppfolgingsplanQueryKeys } from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { oppfolgingsplanerLPSMock } from "@/mocks/lps-oppfolgingsplan-mottak/oppfolgingsplanLPSMock";
import dayjs from "dayjs";
import {
  createOppfolgingstilfelleFromSykmelding,
  setSykmeldingDataFromOppfolgingstilfelle,
} from "../utils/oppfolgingstilfelleUtils";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { OppfolgingsplanV2DTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { OppfolgingsplanDTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";

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

function createV1Oppfolgingsplan(
  id: number,
  virksomhetsnummer: string,
  fom: Date,
  tom: Date,
  deltMedNAV: boolean
): OppfolgingsplanDTO {
  return {
    id,
    uuid: `v1-${id}`,
    sistEndretAvAktoerId: "1902690001002",
    sistEndretDato: new Date(),
    status: "AKTIV",
    virksomhet: {
      navn: virksomhetsnummer,
      virksomhetsnummer,
    },
    godkjentPlan: {
      opprettetTidspunkt: new Date(fom),
      gyldighetstidspunkt: {
        fom: new Date(fom),
        tom: new Date(tom),
        evalueres: new Date(tom),
      },
      tvungenGodkjenning: false,
      deltMedNAVTidspunkt: new Date(fom),
      deltMedNAV,
      deltMedFastlegeTidspunkt: undefined,
      deltMedFastlege: false,
      dokumentUuid: `dokument-${id}`,
    },
  };
}

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

  it("Viser oppfolgingsplan V2 innenfor oppfolgingstilfelle", () => {
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    const tilfelle = oppfolgingstilfeller[0];
    const planInnenforTilfelle: OppfolgingsplanV2DTO = {
      uuid: "test-uuid-v2",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      opprettet: new Date().toISOString(),
      deltMedNavTidspunkt: new Date().toISOString(),
      sistEndret: new Date().toISOString(),
      evalueringsdato: addDays(new Date(), 7).toString(),
    };
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerV2(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [planInnenforTilfelle]
    );

    renderUtdragFraSykefravaeret(tilfelle);

    expect(
      screen.getByRole("link", {
        name: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      })
    ).to.exist;
    expect(screen.queryByText("Ingen planer er delt med Nav")).to.not.exist;
  });

  it("Viser ikke oppfolgingsplan V2 når den er utenfor oppfolgingstilfellet", () => {
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    const tilfelle = oppfolgingstilfeller[0];
    const planUtenforTilfelle: OppfolgingsplanV2DTO = {
      uuid: "test-uuid-v2-old",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      opprettet: addWeeks(new Date(), -4).toISOString(),
      deltMedNavTidspunkt: addWeeks(new Date(), -4).toISOString(),
      sistEndret: addWeeks(new Date(), -4).toISOString(),
      evalueringsdato: addWeeks(new Date(), -2).toString(),
    };
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerV2(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [planUtenforTilfelle]
    );

    renderUtdragFraSykefravaeret(tilfelle);

    expect(screen.getByText("Ingen planer er delt med Nav")).to.exist;
    expect(
      screen.queryByRole("link", {
        name: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      })
    ).to.not.exist;
  });

  it("Filtrerer oppfolgingsplan V1 på valgt oppfolgingstilfelle og deltMedNAV", () => {
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    const tilfelle = oppfolgingstilfeller[0];
    const planInnenforTilfelle = createV1Oppfolgingsplan(
      1,
      "123456789",
      addDays(new Date(tilfelle.start), 1),
      addDays(new Date(tilfelle.end), -1),
      true
    );
    const planUtenforTilfelle = createV1Oppfolgingsplan(
      2,
      "223456789",
      addWeeks(new Date(tilfelle.start), -6),
      addWeeks(new Date(tilfelle.start), -4),
      true
    );
    const planIkkeDeltMedNAV = createV1Oppfolgingsplan(
      3,
      "323456789",
      addDays(new Date(tilfelle.start), 1),
      addDays(new Date(tilfelle.end), -1),
      false
    );
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplaner(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [planInnenforTilfelle, planUtenforTilfelle, planIkkeDeltMedNAV]
    );

    renderUtdragFraSykefravaeret(tilfelle);

    expect(
      screen.getByRole("link", { name: planInnenforTilfelle.virksomhet.navn })
    ).to.exist;
    expect(
      screen.queryByRole("link", { name: planUtenforTilfelle.virksomhet.navn })
    ).to.not.exist;
    expect(
      screen.queryByRole("link", { name: planIkkeDeltMedNAV.virksomhet.navn })
    ).to.not.exist;
  });
});
