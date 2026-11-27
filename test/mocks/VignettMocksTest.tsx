import { beforeEach, describe, expect, it } from "vitest";
import {
  ISMEROPPFOLGING_ROOT,
  ISOPPFOLGINGSTILFELLE_ROOT,
  MEROPPFOLGING_BACKEND_V1_ROOT,
  SYFOPERSON_ROOT,
  SYFOSMREGISTER_ROOT,
  SYKEPENGEDAGER_INFORMASJON_ROOT,
} from "@/apiConstants";
import { getVignettHandlers } from "@/mocks/vignetter/vignettMocks";
import { mockServer } from "../setup";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import { newSMFormat2OldFormat } from "@/utils/sykmeldinger/sykmeldingParser";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen, within } from "@testing-library/react";
import handlers from "@/mocks/handlers";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { ENHET_GRUNERLOKKA } from "@/mocks/common/mockConstants";
import KartleggingssporsmalSide from "@/sider/kartleggingssporsmal/KartleggingssporsmalSide";
import { renderWithRouter } from "../testRouterUtils";

async function getKandidat(): Promise<KartleggingssporsmalKandidatResponseDTO> {
  const response = await fetch(
    `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater`,
  );
  return (await response.json())[0];
}

describe("Vignette mock scenarios", () => {
  beforeEach(() => {
    mockServer.resetHandlers();
  });

  it.each(["", "?vignett=ukjent", "?vignett=toString", "?vignett=__proto__"])(
    "leaves default handlers unchanged for %s",
    (search) => {
      const handlers = getVignettHandlers(search);

      expect(handlers).toEqual([]);
    },
  );

  it.each([
    {
      key: "kari",
      navn: "Kari Konsulent",
      currentCount: 4,
      historyCount: 4,
      gjentakende: false,
      hasUtbetaling: false,
    },
    {
      key: "sjur",
      navn: "Sjur Sjauer",
      currentCount: 3,
      historyCount: 2,
      gjentakende: false,
      hasUtbetaling: true,
    },
    {
      key: "synne",
      navn: "Synne Sykepleier",
      currentCount: 3,
      historyCount: 6,
      gjentakende: true,
      hasUtbetaling: false,
    },
  ])(
    "serves coherent person, answer and absence data for $key",
    async (scenario) => {
      mockServer.use(
        ...getVignettHandlers(`?vignett=${scenario.key}`),
        ...handlers,
      );

      const kandidat = await getKandidat();
      const [person, svar, tilfeller, sykmeldinger, utbetaling] =
        await Promise.all([
          fetch(`${SYFOPERSON_ROOT}/person/brukerinfo`).then((response) =>
            response.json(),
          ),
          fetch(
            `${MEROPPFOLGING_BACKEND_V1_ROOT}/kartleggingssporsmal/kandidat/${kandidat.kandidatUuid}/svar`,
          ).then((response) =>
            response.json(),
          ) as Promise<KartleggingssporsmalSvarResponseDTO>,
          fetch(
            `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`,
          ).then((response) => response.json()),
          fetch(`${SYFOSMREGISTER_ROOT}/sykmeldinger`).then((response) =>
            response.json(),
          ) as Promise<SykmeldingNewFormatDTO[]>,
          fetch(`${SYKEPENGEDAGER_INFORMASJON_ROOT}/sykepenger/maxdate`).then(
            (response) => response.json(),
          ),
        ]);

      expect(person.navn).toBe(scenario.navn);
      expect(erGyldigFodselsnummer(person.aktivPersonident)).toBe(true);
      expect(kandidat.personident).toBe(person.aktivPersonident);
      expect(kandidat.status).toBe(KandidatStatus.SVAR_MOTTATT);
      expect(kandidat.vurdering).toBeNull();
      expect(svar.fnr).toBe(kandidat.personident);
      expect(svar.kandidatId).toBe(kandidat.kandidatUuid);
      expect(svar.createdAt).toBe(kandidat.svarAt);
      expect(tilfeller.personIdent).toBe(kandidat.personident);
      expect(tilfeller.oppfolgingstilfelleList).toHaveLength(
        scenario.historyCount,
      );
      expect(tilfeller.hasGjentakendeSykefravar).toBe(scenario.gjentakende);
      expect(!!utbetaling.maxDate).toBe(scenario.hasUtbetaling);
      expect(sykmeldinger).toHaveLength(
        scenario.currentCount + scenario.historyCount - 1,
      );
      const parsed = sykmeldinger.map((sykmelding) =>
        newSMFormat2OldFormat(sykmelding, kandidat.personident),
      );
      expect(
        parsed.every((sykmelding) => !!sykmelding.diagnose.hoveddiagnose),
      ).toBe(true);
      expect(
        parsed.every(
          (sykmelding) => !sykmelding.meldingTilNav.navBoerTaTakISaken,
        ),
      ).toBe(true);
      const fritekst = svar.formSnapshot.fieldSnapshots.filter(
        (field) => field.fieldType === "TEXT",
      );
      expect(fritekst).toHaveLength(scenario.key === "sjur" ? 2 : 0);
      expect(fritekst.every((field) => field.value.trim().length > 0)).toBe(
        true,
      );

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      renderWithRouter(
        <QueryClientProvider client={queryClient}>
          <ValgtEnhetContext.Provider
            value={{
              valgtEnhet: ENHET_GRUNERLOKKA.nummer,
              setValgtEnhet: () => void 0,
            }}
          >
            <KartleggingssporsmalSide />
          </ValgtEnhetContext.Provider>
        </QueryClientProvider>,
        "/sykefravaer/kartleggingssporsmal",
        ["/sykefravaer/kartleggingssporsmal"],
      );

      expect(
        await screen.findByText(scenario.navn, { exact: false }),
      ).toBeDefined();
      expect(
        await screen.findByText("Ingen planer er delt med Nav"),
      ).toBeDefined();
      expect(
        await screen.findByRole("heading", {
          name: "Oppsummering av den sykmeldtes situasjon",
        }),
      ).toBeDefined();
      expect(
        within(
          screen.getByRole("radiogroup", {
            name: "Velg alternativet som passer",
          }),
        )
          .getAllByRole("radio")
          .every((radio) => !(radio as HTMLInputElement).checked),
      ).toBe(true);
      for (const field of fritekst) {
        expect(screen.getByText(field.value)).toBeDefined();
      }
    },
  );

  it("keeps a submitted assessment within its selected scenario", async () => {
    mockServer.use(...getVignettHandlers("?vignett=kari"));
    const kandidat = await getKandidat();

    await fetch(
      `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater/${kandidat.kandidatUuid}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vurderingAlternativ: "IKKE_RISIKO_FOR_LANGTIDSFRAVAR",
          vurderingFritekst: "",
        }),
      },
    );
    const assessed = await getKandidat();
    mockServer.use(...getVignettHandlers("?vignett=sjur"));
    const nextScenario = await getKandidat();
    mockServer.use(...getVignettHandlers("?vignett=kari"));
    const reloaded = await getKandidat();

    expect(assessed.status).toBe(KandidatStatus.FERDIGBEHANDLET);
    expect(nextScenario.status).toBe(KandidatStatus.SVAR_MOTTATT);
    expect(nextScenario.vurdering).toBeNull();
    expect(reloaded.status).toBe(KandidatStatus.SVAR_MOTTATT);
    expect(reloaded.vurdering).toBeNull();
  });
});
