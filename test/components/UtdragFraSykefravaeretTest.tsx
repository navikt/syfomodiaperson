import { render, screen, within } from "@testing-library/react";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
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
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import {
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT,
} from "@/apiConstants";

let queryClient: QueryClient;

const renderUtdragFraSykefravaeret = (
  oppfolgingstilfelle?: OppfolgingstilfelleDTO,
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <UtdragFraSykefravaeret
        selectedOppfolgingstilfelle={oppfolgingstilfelle}
      />
    </QueryClientProvider>,
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

  it("Viser sykmeldinger med sykmelder og arbeidsgiver", () => {
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    setSykmeldingDataFromOppfolgingstilfelle(
      [sykmeldingNow],
      oppfolgingstilfeller,
      queryClient,
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
      queryClient,
    );
    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    const sykmeldingExpansionCards = screen.getAllByRole("region");
    expect(sykmeldingExpansionCards.length).to.equal(2);

    expect(within(sykmeldingExpansionCards[1]).getByText("Ikke tatt i bruk")).to
      .exist;
  });

  it("Viser sykmelding uten arbeidsgiver tag", () => {
    const sykmeldingUtenArbeidsgiver = sykmeldingerMock.filter(
      (sykmelding) => sykmelding.id === "8361e922-2c92-4aa8-811d-e53ca958dc6a",
    );
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding(
      sykmeldingUtenArbeidsgiver,
    );
    setSykmeldingDataFromOppfolgingstilfelle(
      sykmeldingUtenArbeidsgiver,
      oppfolgingstilfeller,
      queryClient,
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
        ARBEIDSTAKER_DEFAULT.personIdent,
      ),
      () => [oppfolgingsplanerLPSMock(oppfolgingsplanCreatedAt)[0]],
    );
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    expect(screen.getByText("Virksomhet: 110110110.", { exact: false })).to
      .exist;
    const planLink = screen.getByRole("link", { name: "Åpne planen" });
    expect(planLink.parentElement?.className).toContain("grid-cols-subgrid");
    expect(
      screen.getByText(
        `Innsendt ${tilDatoMedManedNavn(
          dayjs(oppfolgingsplanCreatedAt).subtract(1, "days").toDate(),
        )}.`,
      ),
    ).to.exist;
  });

  it("Viser ikke oppfolgingsplan fra LPS når den er utenfor oppfolgingstilfellet", () => {
    const oppfolgingsplanCreatedAt = addWeeks(new Date(), -4);
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
        ARBEIDSTAKER_DEFAULT.personIdent,
      ),
      () => [oppfolgingsplanerLPSMock(oppfolgingsplanCreatedAt)[0]],
    );
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    expect(screen.getByText("Ingen planer er delt med Nav")).to.exist;
    expect(screen.queryByRole("link", { name: "Åpne planen" })).to.not.exist;
    expect(
      screen.queryByText(
        `Innsendt ${tilDatoMedManedNavn(
          dayjs(oppfolgingsplanCreatedAt).subtract(1, "days").toDate(),
        )}.`,
      ),
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
        ARBEIDSTAKER_DEFAULT.personIdent,
      ),
      () => [planInnenforTilfelle],
    );

    renderUtdragFraSykefravaeret(tilfelle);

    expect(
      screen.getByText(
        `Virksomhet: ${VIRKSOMHET_PONTYPANDY.virksomhetsnummer}.`,
        { exact: false },
      ),
    ).to.exist;
    const planLink = screen.getByRole("link", { name: "Åpne planen" });
    expect(planLink.parentElement?.className).toContain("grid-cols-subgrid");
    expect(screen.getByText("Delt med Nav", { exact: false })).to.exist;
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
        ARBEIDSTAKER_DEFAULT.personIdent,
      ),
      () => [planUtenforTilfelle],
    );

    renderUtdragFraSykefravaeret(tilfelle);

    expect(screen.getByText("Ingen planer er delt med Nav")).to.exist;
    expect(
      screen.queryByRole("link", {
        name: "Åpne planen",
      }),
    ).to.not.exist;
  });

  it("Plasserer lenker for V2 og LPS i samme gridkolonne", () => {
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding([
      sykmeldingNow,
    ]);
    const lpsPlan = oppfolgingsplanerLPSMock(new Date())[0];
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerV2(
        ARBEIDSTAKER_DEFAULT.personIdent,
      ),
      () => [
        {
          uuid: "test-uuid-v2",
          fnr: ARBEIDSTAKER_DEFAULT.personIdent,
          virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
          opprettet: new Date().toISOString(),
          deltMedNavTidspunkt: new Date().toISOString(),
          sistEndret: new Date().toISOString(),
          evalueringsdato: addDays(new Date(), 7).toISOString(),
        } satisfies OppfolgingsplanV2DTO,
      ],
    );
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
        ARBEIDSTAKER_DEFAULT.personIdent,
      ),
      () => [lpsPlan],
    );

    renderUtdragFraSykefravaeret(oppfolgingstilfeller[0]);

    const [planV2Link, lpsLink] = screen.getAllByRole("link", {
      name: "Åpne planen",
    });
    expect(planV2Link.getAttribute("href")).toBe(
      `${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/oppfolgingsplaner/test-uuid-v2`,
    );
    expect(lpsLink.getAttribute("href")).toBe(
      `${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/${lpsPlan.uuid}`,
    );
    const planV2Row = planV2Link.parentElement?.parentElement;
    const lpsRow = lpsLink.parentElement?.parentElement;
    expect(planV2Row?.parentElement).toBe(lpsRow?.parentElement);
    expect(planV2Row?.parentElement?.className).toContain(
      "grid-cols-[max-content_max-content]",
    );
    expect(planV2Row?.className).toContain("grid-cols-subgrid");
    expect(lpsRow?.className).toContain("grid-cols-subgrid");
  });

  describe("Siste oppfølgingstilfelle (isLatestTilfelle = true)", () => {
    beforeEach(() => {
      queryClient.setQueryData(
        oppfolgingsplanQueryKeys.oppfolgingsplanerV2(
          ARBEIDSTAKER_DEFAULT.personIdent,
        ),
        () => [],
      );
      queryClient.setQueryData(
        oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
          ARBEIDSTAKER_DEFAULT.personIdent,
        ),
        () => [],
      );
    });
    it("Viser LPS-plan opprettet etter tilfelle-slutt når valgt tilfelle er siste", () => {
      const tilfelle = createOppfolgingstilfelleFromSykmelding([
        sykmeldingNow,
      ])[0];
      setSykmeldingDataFromOppfolgingstilfelle(
        [sykmeldingNow],
        [tilfelle],
        queryClient,
      );

      const planEtterTilfelleSlutt: OppfolgingsplanLPS = {
        uuid: "lps-etter-slutt",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        opprettet: addWeeks(new Date(tilfelle.end), 2).toISOString(),
        sistEndret: addWeeks(new Date(tilfelle.end), 2).toISOString(),
      };
      queryClient.setQueryData(
        oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
          ARBEIDSTAKER_DEFAULT.personIdent,
        ),
        () => [planEtterTilfelleSlutt],
      );

      renderUtdragFraSykefravaeret(tilfelle);

      expect(
        screen.getByText(
          `Virksomhet: ${VIRKSOMHET_PONTYPANDY.virksomhetsnummer}.`,
          { exact: false },
        ),
      ).to.exist;
      expect(screen.getByRole("link", { name: "Åpne planen" })).to.exist;
      expect(screen.queryByText("Ingen planer er delt med Nav")).to.not.exist;
    });

    it("Viser ikke LPS-plan opprettet før tilfelle-start selv om det er siste tilfelle", () => {
      const tilfelle = createOppfolgingstilfelleFromSykmelding([
        sykmeldingNow,
      ])[0];
      setSykmeldingDataFromOppfolgingstilfelle(
        [sykmeldingNow],
        [tilfelle],
        queryClient,
      );

      const planForTilfelleStart: OppfolgingsplanLPS = {
        uuid: "lps-for-start",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        opprettet: addWeeks(new Date(tilfelle.start), -2).toISOString(),
        sistEndret: addWeeks(new Date(tilfelle.start), -2).toISOString(),
      };
      queryClient.setQueryData(
        oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
          ARBEIDSTAKER_DEFAULT.personIdent,
        ),
        () => [planForTilfelleStart],
      );

      renderUtdragFraSykefravaeret(tilfelle);

      expect(screen.getByText("Ingen planer er delt med Nav")).to.exist;
    });

    it("Viser V2-plan opprettet etter tilfelle-slutt når valgt tilfelle er siste", () => {
      const tilfelle = createOppfolgingstilfelleFromSykmelding([
        sykmeldingNow,
      ])[0];
      setSykmeldingDataFromOppfolgingstilfelle(
        [sykmeldingNow],
        [tilfelle],
        queryClient,
      );

      const planEtterTilfelleSlutt: OppfolgingsplanV2DTO = {
        uuid: "v2-etter-slutt",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        opprettet: addWeeks(new Date(tilfelle.end), 2).toISOString(),
        deltMedNavTidspunkt: addWeeks(new Date(tilfelle.end), 2).toISOString(),
        sistEndret: addWeeks(new Date(tilfelle.end), 2).toISOString(),
        evalueringsdato: addWeeks(new Date(tilfelle.end), 6).toISOString(),
      };
      queryClient.setQueryData(
        oppfolgingsplanQueryKeys.oppfolgingsplanerV2(
          ARBEIDSTAKER_DEFAULT.personIdent,
        ),
        () => [planEtterTilfelleSlutt],
      );

      renderUtdragFraSykefravaeret(tilfelle);

      expect(
        screen.getByText(
          `Virksomhet: ${VIRKSOMHET_PONTYPANDY.virksomhetsnummer}.`,
          { exact: false },
        ),
      ).to.exist;
      expect(
        screen.getByRole("link", {
          name: "Åpne planen",
        }),
      ).to.exist;
      expect(screen.queryByText("Ingen planer er delt med Nav")).to.not.exist;
    });
  });
});
