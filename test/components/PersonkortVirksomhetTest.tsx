import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { delay, http, HttpResponse } from "msw";
import { PersonKortVirksomhet } from "@/components/personkort/ledere/PersonKortVirksomhet";
import { PersonkortLedere } from "@/components/personkort/ledere/PersonkortLedere";
import {
  EregVirksomhetDTO,
  EregOrganisasjonResponseDTO,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import { virksomhetQueryKeys } from "@/data/virksomhet/virksomhetQueryHooks";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { bransjeQueryKeys } from "@/data/virksomhet/ssbQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "@/mocks/common/mockConstants";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { mockNaringskode } from "@/mocks/syfoperson/mockNaringskode";
import { mockSektorkode } from "@/mocks/syfoperson/mockSektorkode";
import { EREG_ROOT, SYFOPERSON_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { queryHookWrapper } from "../data/queryHookTestUtils";
import { testQueryClient } from "../testQueryClient";

describe("Personkort virksomhetsinformasjon", () => {
  let queryClient: QueryClient;
  const orgnummer = VIRKSOMHET_PONTYPANDY.virksomhetsnummer;

  beforeEach(() => {
    queryClient = testQueryClient();
    queryClient.setDefaultOptions({ queries: { retry: false } });
    mockServer.use(mockNaringskode);
  });

  function setVirksomhet(naringskoder: string[], nummer = orgnummer) {
    const virksomhet: EregVirksomhetDTO = {
      type: "Virksomhet",
      organisasjonsnummer: nummer,
      navn: { navnelinje1: `Virksomhet ${nummer}` },
      organisasjonDetaljer: {
        naeringer: naringskoder.map((naeringskode) => ({
          naeringskode,
          bruksperiode: { fom: "2025-09-01T00:00:00.000Z" },
        })),
      },
    };
    queryClient.setQueryData(
      virksomhetQueryKeys.virksomhet(nummer, true),
      virksomhet,
    );
  }

  function renderVirksomhet() {
    return render(
      <PersonKortVirksomhet
        virksomhetsnummer={orgnummer}
        virksomhetsnavn="Navn fra sykmeldingen"
        sykmeldinger={[]}
      />,
      { wrapper: queryHookWrapper(queryClient) },
    );
  }

  it("shows a single bransje directly without expansion and preserves existing content", async () => {
    setVirksomhet(["62.200"]);

    renderVirksomhet();

    expect(await screen.findByText("IKT-virksomhet")).toBeDefined();
    expect(screen.getByText(`Virksomhet ${orgnummer}`)).toBeDefined();
    expect(screen.getByText("Forskuttering ikke oppgitt")).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "Forskuttering" }),
    ).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
    expect(
      screen
        .getByRole("link", { name: "Les mer om bransjer" })
        .getAttribute("href"),
    ).toBe("https://dataportal.ssb.no/classifications/6/codes");
  });

  it("shows multiple bransjer as a list", async () => {
    setVirksomhet(["62.200", "70.200"]);

    renderVirksomhet();

    expect(await screen.findByText("IKT-virksomhet")).toBeDefined();
    expect(
      within(screen.getByRole("list")).getAllByRole("listitem"),
    ).toHaveLength(2);
  });

  it("copies the unformatted organisation number", async () => {
    const user = userEvent.setup();
    setVirksomhet([]);

    renderVirksomhet();
    await user.click(
      screen.getByRole("button", { name: "Kopier organisasjonsnummer" }),
    );

    expect(await navigator.clipboard.readText()).toBe(orgnummer);
  });

  it("omits the bransje section when Ereg has no applicable naringer", () => {
    setVirksomhet([]);

    renderVirksomhet();

    expect(screen.queryByText("Bransje")).toBeNull();
    expect(screen.queryByText("Laster bransje")).toBeNull();
  });

  it("keeps the existing virksomhetsnavn when Ereg lookup fails", async () => {
    mockServer.use(
      http.get(
        `*${EREG_ROOT}/organisasjon/${orgnummer}`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderVirksomhet();

    expect(await screen.findByText("Klarte ikke hente bransje")).toBeDefined();
    expect(screen.getByText("Navn fra sykmeldingen")).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "Forskuttering" }),
    ).toBeDefined();
  });

  it("shows loading and then the bransje without blocking other content", async () => {
    setVirksomhet(["62.200"]);
    mockServer.use(
      http.get(`*${SYFOPERSON_ROOT}/naringskode/62.200`, async () => {
        await delay(30);
        return HttpResponse.json({
          standard: 2025,
          hierarki: [{ code: "K", name: "IKT-virksomhet", parentCode: null }],
        });
      }),
    );

    renderVirksomhet();

    expect(screen.getByText("Laster bransje")).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "Forskuttering" }),
    ).toBeDefined();
    expect(await screen.findByText("IKT-virksomhet")).toBeDefined();
  });

  it("preserves available bransjer when another classification lookup fails", async () => {
    setVirksomhet(["62.200", "70.200"]);
    mockServer.use(
      http.get(
        `*${SYFOPERSON_ROOT}/naringskode/70.200`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderVirksomhet();

    expect(await screen.findByText("Klarte ikke hente bransje")).toBeDefined();
    expect(screen.getByText("IKT-virksomhet")).toBeDefined();
  });

  it("uses the full bransje name when no short name is available", () => {
    setVirksomhet(["62.200"]);
    queryClient.setQueryData(bransjeQueryKeys.bransje("62.200", 2025), {
      standard: 2025,
      hierarki: [{ code: "K", name: "Fullt bransjenavn", parentCode: null }],
    });

    renderVirksomhet();

    expect(screen.getByText("Fullt bransjenavn")).toBeDefined();
  });

  describe("sektor", () => {
    const parentNummer = "900000001";

    function setParent(type: "JuridiskEnhet" | "Organisasjonsledd") {
      setVirksomhet(["62.200"]);
      const virksomhet = queryClient.getQueryData<EregVirksomhetDTO>(
        virksomhetQueryKeys.virksomhet(orgnummer, true),
      );
      queryClient.setQueryData(
        virksomhetQueryKeys.virksomhet(orgnummer, true),
        {
          ...virksomhet,
          inngaarIJuridiskEnheter: [{ organisasjonsnummer: parentNummer }],
          ...(type === "Organisasjonsledd" && {
            bestaarAvOrganisasjonsledd: [
              {
                organisasjonsledd: { type, organisasjonsnummer: parentNummer },
              },
            ],
          }),
        },
      );
      const parent: EregOrganisasjonResponseDTO =
        type === "Organisasjonsledd"
          ? {
              type,
              organisasjonsnummer: parentNummer,
              organisasjonsleddDetaljer: { sektorkode: "6100" },
            }
          : {
              type,
              organisasjonsnummer: parentNummer,
              juridiskEnhetDetaljer: { sektorkode: "2100" },
            };
      const requests: string[] = [];
      mockServer.use(
        http.get(
          `*${EREG_ROOT}/organisasjon/${parentNummer}`,
          ({ request }) => {
            requests.push(new URL(request.url).search);
            return HttpResponse.json(parent);
          },
        ),
        mockSektorkode,
      );
      return requests;
    }

    it.each(["JuridiskEnhet", "Organisasjonsledd"] as const)(
      "fetches the nearest %s without hierarchy and displays its exact sector name",
      async (type) => {
        const requests = setParent(type);

        renderVirksomhet();

        expect(
          await screen.findByText(
            type === "Organisasjonsledd"
              ? "Statsforvaltningen"
              : "Private aksjeselskaper mv.",
          ),
        ).toBeDefined();
        expect(requests).toEqual([""]);
        expect(await screen.findByText("IKT-virksomhet")).toBeDefined();
        expect(
          queryClient.getQueryData(
            virksomhetQueryKeys.virksomhet(orgnummer, true),
          ),
        ).not.toHaveProperty("overordnetEnhet");
      },
    );

    it("uses a juridisk enhet's own sector without fetching a parent", async () => {
      setVirksomhet([]);
      queryClient.setQueryData(
        virksomhetQueryKeys.virksomhet(orgnummer, true),
        {
          type: "JuridiskEnhet",
          organisasjonsnummer: orgnummer,
          juridiskEnhetDetaljer: { sektorkode: "6100" },
        },
      );
      mockServer.use(mockSektorkode);

      renderVirksomhet();

      expect(await screen.findByText("Statsforvaltningen")).toBeDefined();
    });

    it("keeps the code visible while loading and when the sector lookup fails", async () => {
      setParent("JuridiskEnhet");
      mockServer.use(
        http.get(`*${SYFOPERSON_ROOT}/sektorkode/2100`, async () => {
          await delay(30);
          return new HttpResponse(null, { status: 500 });
        }),
      );

      renderVirksomhet();

      expect(await screen.findByText("2100")).toBeDefined();
      expect(screen.getByText("Laster sektornavn")).toBeDefined();
      expect(
        await screen.findByText("Klarte ikke hente sektornavn"),
      ).toBeDefined();
      expect(screen.getByText("2100")).toBeDefined();
    });

    it("preserves company information when the parent lookup fails", async () => {
      setParent("JuridiskEnhet");
      mockServer.use(
        http.get(
          `*${EREG_ROOT}/organisasjon/${parentNummer}`,
          () => new HttpResponse(null, { status: 500 }),
        ),
      );

      renderVirksomhet();

      expect(
        await screen.findByText("Klarte ikke hente sektornavn"),
      ).toBeDefined();
      expect(await screen.findByText("IKT-virksomhet")).toBeDefined();
      expect(screen.getByText(`Virksomhet ${orgnummer}`)).toBeDefined();
    });

    it("requests hierarchy for the company and falls back to the code when no matching name exists", async () => {
      const requests: string[] = [];
      mockServer.use(
        http.get(`*${EREG_ROOT}/organisasjon/${orgnummer}`, ({ request }) => {
          requests.push(new URL(request.url).search);
          return HttpResponse.json({
            type: "Virksomhet",
            organisasjonsnummer: orgnummer,
            inngaarIJuridiskEnheter: [{ organisasjonsnummer: parentNummer }],
          });
        }),
        http.get(`*${EREG_ROOT}/organisasjon/${parentNummer}`, () =>
          HttpResponse.json({
            type: "JuridiskEnhet",
            organisasjonsnummer: parentNummer,
            juridiskEnhetDetaljer: { sektorkode: "2100" },
          }),
        ),
        http.get(`*${SYFOPERSON_ROOT}/sektorkode/2100`, () =>
          HttpResponse.json({
            standard: 2012,
            hierarki: [
              {
                code: "INNL",
                name: "Innenlandske sektorer",
                parentCode: null,
                level: 1,
              },
            ],
          }),
        ),
      );

      renderVirksomhet();

      expect(await screen.findByText("2100")).toBeDefined();
      expect(requests).toEqual(["?inkluderHierarki=true"]);
      expect(screen.queryByText("Innenlandske sektorer")).toBeNull();
    });

    it("omits sector and makes no lookup when there is no sector code", () => {
      setVirksomhet([]);
      const handler = vi.fn(() => HttpResponse.json({}));
      mockServer.use(http.get(`*${SYFOPERSON_ROOT}/sektorkode/*`, handler));

      renderVirksomhet();

      expect(screen.queryByRole("heading", { name: "Sektor" })).toBeNull();
      expect(handler).not.toHaveBeenCalled();
    });
  });

  it.each([true, false])(
    "shows virksomheter from sykmeldinger without a leader (has other leaders: %s)",
    async (hasOtherLeaders) => {
      queryClient.setQueryData(
        ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
        hasOtherLeaders ? structuredClone(LEDERE_DEFAULT) : [],
      );
      const sykmelding = structuredClone(sykmeldingerMock[0]);
      sykmelding.sykmeldingStatus.arbeidsgiver = {
        orgnummer: VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer,
        juridiskOrgnummer: VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer,
        orgNavn: VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnavn,
      };
      queryClient.setQueryData(
        sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
        [sykmelding],
      );
      setVirksomhet(
        ["62.200"],
        VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer,
      );
      setVirksomhet(["70.200"]);

      render(<PersonkortLedere />, { wrapper: queryHookWrapper(queryClient) });

      expect(await screen.findByText("IKT-virksomhet")).toBeDefined();
      expect(screen.getByText("Sykmeldt nå")).toBeDefined();
      if (hasOtherLeaders) {
        expect(
          await screen.findByText("Faglig, vitenskap., teknisk tjenesteyting"),
        ).toBeDefined();
        const virksomhetCard = within(
          screen.getByRole("region", {
            name: `Virksomhet ${orgnummer}`,
          }),
        );
        expect(virksomhetCard.getByRole("table")).toBeDefined();
        expect(
          virksomhetCard.getByRole("heading", {
            name: "Nærmeste leder",
            level: 4,
          }),
        ).toBeDefined();
        expect(
          virksomhetCard.getByRole("heading", {
            name: "Forskuttering",
            level: 4,
          }),
        ).toBeDefined();
        expect(
          virksomhetCard.getByRole("heading", { name: "Bransje", level: 4 }),
        ).toBeDefined();
        expect(
          virksomhetCard.queryByRole("heading", {
            name: "Organisasjonsnummer",
            level: 4,
          }),
        ).toBeNull();
        const virksomhetWithoutLeaderCard = within(
          screen.getByRole("region", {
            name: `Virksomhet ${VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer}`,
          }),
        );
        expect(virksomhetWithoutLeaderCard.queryByRole("table")).toBeNull();
        expect(
          virksomhetWithoutLeaderCard.queryByRole("heading", {
            name: "Nærmeste leder",
          }),
        ).toBeNull();
        expect(
          virksomhetWithoutLeaderCard.getByRole("heading", {
            name: "Sykmeldingsstatus",
            level: 4,
          }),
        ).toBeDefined();
        expect(
          screen.getByText("Arbeidsgiver forskutterer ikke"),
        ).toBeDefined();
      } else {
        expect(screen.getByText(/Nærmeste leder mangler/)).toBeDefined();
        expect(screen.queryByRole("table")).toBeNull();
      }
    },
  );
});
