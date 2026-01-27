import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import HistorikkContainer from "@/sider/historikk/container/HistorikkContainer";
import { renderWithRouter } from "../testRouterUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
  VEILEDER_TILDELING_HISTORIKK_ANNEN,
  VEILEDER_TILDELING_HISTORIKK_DEFAULT,
  VEILEDER_TILDELING_HISTORIKK_SYSTEM,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_ENTERPRISE,
} from "@/mocks/common/mockConstants";
import { historikkQueryKeys } from "@/data/historikk/historikkQueryHooks";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { arbeidsuforhetQueryKeys } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";
import { historikkPath } from "@/AppRouter";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import {
  currentOppfolgingstilfelle,
  oppfolgingstilfellePersonMock,
} from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { veilederBrukerKnytningQueryKeys } from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import {
  MeldingDTO,
  MeldingResponseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { defaultMelding } from "@/mocks/isbehandlerdialog/behandlerdialogMock";
import { senOppfolgingKandidatQueryKeys } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import {
  OnskerOppfolging,
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { generateUUID } from "@/utils/utils";
import { dialogmoteStatusEndringMock } from "@/mocks/isdialogmote/dialogmoterMock";
import { dialogmoterQueryKeys } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { oppfolgingsplanQueryKeys } from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { getDefaultOppfolgingsplanLPS } from "@/mocks/lps-oppfolgingsplan-mottak/oppfolgingsplanLPSMock";
import { oppfolgingsoppgaverQueryKeys } from "@/data/oppfolgingsoppgave/useOppfolgingsoppgaver";
import {
  DATO_INNENFOR_OPPFOLGINGSTILFELLE,
  historikkOppfolgingsoppgaveAktivMock,
  historikkOppfolgingsoppgaveFjernetMock,
} from "@/mocks/oppfolgingsoppgave/historikkOppfolgingsoppgaveMock";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  addDays,
  addWeeks,
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { motebehovMock } from "@/mocks/syfomotebehov/motebehovMock";
import { oppfolgingsplanForesporselQueryKeys } from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanForesporselHooks";
import { mockForesporseler } from "@/mocks/isoppfolgingsplan/oppfolgingsplanForesporselMocks";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { tildeltOppfolgingsenhetHistorikk } from "@/mocks/syfobehandlendeenhet/mockSyfobehandlendeenhet";
import { kartleggingssporsmalQueryKeys } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";

let queryClient: QueryClient;

const renderHistorikk = () =>
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <HistorikkContainer />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    historikkPath,
    [historikkPath]
  );

function setupTestdataHistorikk() {
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => oppfolgingstilfellePersonMock
  );
  queryClient.setQueryData(
    motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    historikkQueryKeys.oppfolgingsplan(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  queryClient.setQueryData(
    aktivitetskravQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  queryClient.setQueryData(
    vedtakQueryKeys.vedtak(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    dialogmotekandidatQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    veilederBrukerKnytningQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    behandlerdialogQueryKeys.behandlerdialog(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  queryClient.setQueryData(
    dialogmoterQueryKeys.statusendringHistorikk(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  queryClient.setQueryData(
    oppfolgingsoppgaverQueryKeys.oppfolgingsoppgaver(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  queryClient.setQueryData(
    oppfolgingsplanForesporselQueryKeys.foresporsel(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
  queryClient.setQueryData(
    behandlendeEnhetQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );
  queryClient.setQueryData(
    kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => []
  );
}

describe("Historikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    setupTestdataHistorikk();
  });

  it("viser tilbakemelding når ingen historikk", async () => {
    renderHistorikk();

    expect(await screen.findAllByText("Historikk")).to.exist;
    expect(screen.getByText("Denne personen har ingen oppfølgingshistorikk")).to
      .exist;
    expect(
      screen.getByText(
        "Når en sykmeldt blir fulgt opp vil oppfølgingen bli loggført her slik at du får oversikt over hva som har skjedd og hvem som har vært involvert i oppfølgingen."
      )
    ).to.exist;
  });

  it("viser lenke til tiltakshistorikk", async () => {
    queryClient.setQueryData(
      ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
      () => LEDERE_DEFAULT
    );
    renderHistorikk();

    expect(await screen.findAllByText("Historikk")).to.exist;
    expect(
      screen.getByRole("link", { name: "Åpne tiltakshistorikk Ekstern lenke" })
    ).to.exist;
  });

  it("viser select/dropdown med oppfolgingstilfeller når person har hendelser", async () => {
    queryClient.setQueryData(
      ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
      () => LEDERE_DEFAULT
    );
    renderHistorikk();

    const lastOppfolgingstilfelle =
      oppfolgingstilfellePersonMock.oppfolgingstilfelleList[
        oppfolgingstilfellePersonMock.oppfolgingstilfelleList.length - 1
      ];
    const dropdownOptionText = tilLesbarPeriodeMedArstall(
      lastOppfolgingstilfelle.start,
      lastOppfolgingstilfelle.end
    );

    expect(await screen.findAllByText("Historikk")).to.exist;
    expect(screen.getByLabelText("Velg sykefraværstilfelle")).to.exist;
    expect(screen.getByRole("option", { name: dropdownOptionText })).to.exist;
    expect(
      screen.queryByRole("option", { name: "Utenfor sykefraværstilfelle" })
    ).to.not.exist;
  });

  it("viser select/dropdown med valg om hendelser utenfor oppfolgingstilfelle", async () => {
    queryClient.setQueryData(
      aktivitetskravQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          tidspunkt: new Date(),
          status: AktivitetskravStatus.NY,
          vurdertAv: null,
        },
        {
          tidspunkt: addWeeks(new Date(), -100),
          status: AktivitetskravStatus.OPPFYLT,
          vurdertAv: VEILEDER_IDENT_DEFAULT,
        },
      ]
    );
    renderHistorikk();

    const lastOppfolgingstilfelle =
      oppfolgingstilfellePersonMock.oppfolgingstilfelleList[
        oppfolgingstilfellePersonMock.oppfolgingstilfelleList.length - 1
      ];
    const dropdownOptionText = tilLesbarPeriodeMedArstall(
      lastOppfolgingstilfelle.start,
      lastOppfolgingstilfelle.end
    );

    expect(await screen.findAllByText("Historikk")).to.exist;
    expect(screen.getByRole("option", { name: dropdownOptionText })).to.exist;
    expect(screen.getByRole("option", { name: "Utenfor sykefraværstilfelle" }))
      .to.exist;
  });

  describe("Veiledertilknytning", () => {
    it("viser veiledertilordninghistorikk", async () => {
      queryClient.setQueryData(
        veilederBrukerKnytningQueryKeys.historikk(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => VEILEDER_TILDELING_HISTORIKK_DEFAULT
      );
      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getByText("Z990000 på enhet 0315 ble satt som veileder")).to
        .exist;
    });
    it("viser veiledertilordninghistorikk satt av annen", async () => {
      queryClient.setQueryData(
        veilederBrukerKnytningQueryKeys.historikk(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => VEILEDER_TILDELING_HISTORIKK_ANNEN
      );
      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.getByText("Z970000 satt Z990000 på enhet 0315 som veileder")
      ).to.exist;
    });
    it("viser veiledertilordninghistorikk satt av systemet", async () => {
      queryClient.setQueryData(
        veilederBrukerKnytningQueryKeys.historikk(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => VEILEDER_TILDELING_HISTORIKK_SYSTEM
      );
      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getByText("Z990000 på enhet 0315 ble satt som veileder")).to
        .exist;
    });
  });

  describe("Dialog med behandler", () => {
    const defaultMeldingIPeriode: MeldingDTO = {
      ...defaultMelding,
      tidspunkt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
    };

    it("Innkommende false - Veileder som avsender", async () => {
      const meldingResponseDTO: MeldingResponseDTO = {
        conversations: {
          ["conversationRef123"]: [
            {
              ...defaultMeldingIPeriode,
              innkommende: false,
              behandlerNavn: null,
              veilederIdent: "Z10000",
            },
          ],
        },
      };

      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseDTO
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getByText("Avsender: Z10000 - Tilleggsopplysninger L8")).to
        .exist;
    });

    it("Innkommende false, veilederIdent mangler - Info om navn på veileder mangler", async () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => {
          return {
            conversations: {
              ["conversationRef123"]: [
                {
                  ...defaultMeldingIPeriode,
                  innkommende: false,
                  behandlerNavn: null,
                  veilederIdent: null,
                },
              ],
            },
          };
        }
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.getByText(
          "Avsender: Mangler ident på veileder - Tilleggsopplysninger L8"
        )
      ).to.exist;
    });

    it("Innkommende false, både veilederIdent og behandlerNavn satt - Veileder som avsender", async () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => {
          return {
            conversations: {
              ["conversationRef123"]: [
                {
                  ...defaultMeldingIPeriode,
                  innkommende: false,
                  behandlerNavn: "Ola Nordmann",
                  veilederIdent: "Z10000",
                },
              ],
            },
          };
        }
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getByText("Avsender: Z10000 - Tilleggsopplysninger L8")).to
        .exist;
    });

    it("Innkommende true - Behandler som avsender", async () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => {
          return {
            conversations: {
              ["conversationRef123"]: [
                {
                  ...defaultMeldingIPeriode,
                  innkommende: true,
                  behandlerNavn: "Ola Nordmann",
                  veilederIdent: null,
                },
              ],
            },
          };
        }
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.getByText("Avsender: Ola Nordmann - Tilleggsopplysninger L8")
      ).to.exist;
    });

    it("Innkommende true, behandlerNavn mangler - Info om navn på behandler mangler", async () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => {
          return {
            conversations: {
              ["conversationRef123"]: [
                {
                  ...defaultMeldingIPeriode,
                  innkommende: true,
                  behandlerNavn: null,
                  veilederIdent: null,
                },
              ],
            },
          };
        }
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.getByText(
          "Avsender: Mangler navn på behandler - Tilleggsopplysninger L8"
        )
      ).to.exist;
    });

    it("Innkommende true, både veilederIdent og behandlerNavn satt - Behandler som avsender", async () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => {
          return {
            conversations: {
              ["conversationRef123"]: [
                {
                  ...defaultMeldingIPeriode,
                  innkommende: true,
                  behandlerNavn: "Ola Nordmann",
                  veilederIdent: "Z10000",
                },
              ],
            },
          };
        }
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.getByText("Avsender: Ola Nordmann - Tilleggsopplysninger L8")
      ).to.exist;
    });

    it("To samtaler - Antall meldinger 3", async () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => {
          return {
            conversations: {
              ["conversationRef123"]: [
                {
                  ...defaultMeldingIPeriode,
                  uuid: "1",
                  conversationRef: "conversationRef123",
                },
              ],
              ["conversationRef567"]: [
                {
                  ...defaultMeldingIPeriode,
                  uuid: "2",
                  conversationRef: "conversationRef567",
                },
                {
                  ...defaultMeldingIPeriode,
                  uuid: "3",
                  conversationRef: "conversationRef567",
                },
              ],
            },
          };
        }
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.queryAllByText("Avsender:", { exact: false }).length).toBe(
        3
      );
    });

    it("Ingen samtaler - Antall meldinger 0", async () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => {
          return {
            conversations: {},
          };
        }
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.queryAllByText("Avsender:", { exact: false }).length).toBe(
        0
      );
    });

    it("MeldingResponseDTO undefined - Antall meldinger 0", async () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        undefined
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.queryAllByText("Avsender:", { exact: false }).length).toBe(
        0
      );
    });
  });

  describe("Sen oppfølging", () => {
    const senOppfolgingKandidatDefault: SenOppfolgingKandidatResponseDTO = {
      uuid: generateUUID(),
      createdAt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
      personident: ARBEIDSTAKER_DEFAULT.personIdent,
      status: SenOppfolgingStatus.KANDIDAT,
      varselAt: undefined,
      svar: undefined,
      vurderinger: [],
    };

    const svar = {
      svar: {
        svarAt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
        onskerOppfolging: OnskerOppfolging.JA,
      },
    };

    const varsel = {
      varselAt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
    };

    const ferdigbehandlet = {
      status: SenOppfolgingStatus.FERDIGBEHANDLET,
      vurderinger: [
        {
          uuid: generateUUID(),
          createdAt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
          type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
          veilederident: VEILEDER_IDENT_DEFAULT,
        },
      ],
    };

    it("Ingen kandidater - 0 rader i oversikten", async () => {
      queryClient.setQueryData(
        senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => []
      );
      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.queryByText("Svar mottatt fra den sykmeldte")).to.be.null;
      expect(screen.queryByText("Varsel sendt ut til den sykmeldte")).to.be
        .null;
      expect(screen.queryByText("Ferdigbehandlet av: ", { exact: false })).to.be
        .null;
    });

    it("Sykemeldt har svart og er varslet og veileder har ferdigbehandlet - 3 rader i oversikten", async () => {
      queryClient.setQueryData(
        senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...senOppfolgingKandidatDefault,
            ...svar,
            ...varsel,
            ...ferdigbehandlet,
          },
        ]
      );
      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getByText("Svar mottatt fra den sykmeldte")).to.exist;
      expect(screen.getByText("Varsel sendt ut til den sykmeldte")).to.exist;
      expect(screen.getByText("Ferdigbehandlet av: Z990000")).to.exist;
    });

    it("To kandidater hvor sykemeldt har svart og er varslet og veileder har ferdigbehandlet - 6 rader i oversikten", async () => {
      queryClient.setQueryData(
        senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...senOppfolgingKandidatDefault,
            ...svar,
            ...varsel,
            ...ferdigbehandlet,
          },
          {
            ...senOppfolgingKandidatDefault,
            ...svar,
            ...varsel,
            ...ferdigbehandlet,
          },
        ]
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.queryAllByText("Svar mottatt fra den sykmeldte").length
      ).toBe(2);
      expect(
        screen.queryAllByText("Varsel sendt ut til den sykmeldte").length
      ).toBe(2);
      expect(screen.queryAllByText("Ferdigbehandlet av: Z990000").length).toBe(
        2
      );
    });
  });

  describe("DialogmoteStatusEndring", () => {
    it("viser dialogmoteStatusEndringer", async () => {
      queryClient.setQueryData(
        dialogmoterQueryKeys.statusendringHistorikk(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => dialogmoteStatusEndringMock
      );
      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.getAllByText("Z970000 kalte inn til et dialogmøte")
      ).to.have.length(2);
      expect(
        screen.getByText(
          "Z990000 endret tid eller sted for dialogmøtet opprettet av Z990000"
        )
      ).to.exist;
      expect(
        screen.getByText("Z970000 avlyste dialogmøtet opprettet av Z990000")
      ).to.exist;
      expect(screen.getByText("Z990000 kalte inn til et dialogmøte")).to.exist;
      expect(
        screen.getByText(
          "Z990000 skrev referat fra dialogmøtet opprettet av Z970000"
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Dialogmøtet innkalt av Z970000 ble lukket av systemet"
        )
      ).to.exist;
    });
  });

  describe("Oppfølgingsplaner", () => {
    it("viser mottatte oppfølgingsplaner", () => {
      const oppfolgingsplanHistorikkMock = {
        tekst: "Oppfølgingsplanen ble delt med Nav av TEST.",
        tidspunkt: new Date().toJSON(),
      };
      queryClient.setQueryData(
        historikkQueryKeys.oppfolgingsplan(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [oppfolgingsplanHistorikkMock]
      );
      const defaultOppfolgingsplanLPS = getDefaultOppfolgingsplanLPS(
        new Date()
      );
      queryClient.setQueryData(
        oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [defaultOppfolgingsplanLPS]
      );
      renderHistorikk();

      expect(screen.getByText("Oppfølgingsplanen ble delt med Nav av TEST.")).to
        .exist;
      expect(
        screen.getByText(
          `Oppfølgingsplanen ble delt med Nav av ${defaultOppfolgingsplanLPS.virksomhetsnummer}.`
        )
      ).to.exist;
      expect(screen.getByText("Oppfølgingsplan")).to.exist;
      expect(screen.getByText("Oppfølgingsplan LPS")).to.exist;
    });
  });

  describe("Oppfølgingsoppgave", () => {
    const expandableToggleText = "Vis mer";

    it("Ingen oppfølgingsoppgaver", async () => {
      queryClient.setQueryData(
        oppfolgingsoppgaverQueryKeys.oppfolgingsoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => []
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.queryAllByRole("row", { name: RegExp("Oppfølgingsoppgave") })
      ).to.be.empty;
    });

    it("Opprettet oppfølgingsoppgave med endring", async () => {
      queryClient.setQueryData(
        oppfolgingsoppgaverQueryKeys.oppfolgingsoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [historikkOppfolgingsoppgaveAktivMock]
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${expandableToggleText} ${tilLesbarDatoMedArstall(
              addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 1)
            )} Z990000 endret oppfølgingsoppgave \\(Vurder annen ytelse\\)`
          ),
        })
      ).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${expandableToggleText} ${tilLesbarDatoMedArstall(
              DATO_INNENFOR_OPPFOLGINGSTILFELLE
            )} Z990000 opprettet oppfølgingsoppgave \\(Vurder annen ytelse\\)`
          ),
        })
      ).to.exist;
    });

    it("Fjernet oppfølginsoppgave inkludert endring", async () => {
      queryClient.setQueryData(
        oppfolgingsoppgaverQueryKeys.oppfolgingsoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [historikkOppfolgingsoppgaveFjernetMock]
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${tilLesbarDatoMedArstall(
              addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -1)
            )} Z990000 fjernet oppfølgingsoppgaven \\(Ta kontakt med arbeidsgiver\\)`
          ),
        })
      ).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${expandableToggleText} ${tilLesbarDatoMedArstall(
              addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -2)
            )} Z990000 endret oppfølgingsoppgave \\(Ta kontakt med arbeidsgiver\\)`
          ),
        })
      ).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${expandableToggleText} ${tilLesbarDatoMedArstall(
              addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -3)
            )} Z990000 endret oppfølgingsoppgave \\(Ta kontakt med arbeidsgiver\\)`
          ),
        })
      ).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${expandableToggleText} ${tilLesbarDatoMedArstall(
              addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -4)
            )} Z990000 endret oppfølgingsoppgave \\(Ta kontakt med arbeidsgiver\\)`
          ),
        })
      ).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${expandableToggleText} ${tilLesbarDatoMedArstall(
              addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -5)
            )} Z990000 opprettet oppfølgingsoppgave \\(Ta kontakt med arbeidsgiver\\)`
          ),
        })
      ).to.exist;
    });
  });

  describe("Aktivitetskrav", () => {
    it("viser aktivitetskrav", async () => {
      queryClient.setQueryData(
        aktivitetskravQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [
          {
            tidspunkt: new Date(),
            status: AktivitetskravStatus.NY,
            vurdertAv: null,
          },
          {
            tidspunkt: new Date(),
            status: AktivitetskravStatus.OPPFYLT,
            vurdertAv: VEILEDER_IDENT_DEFAULT,
          },
        ]
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getAllByText("Aktivitetskrav")).to.have.length(2);
      expect(
        screen.getByText("Samuel Sam Jones ble kandidat til aktivitetskravet")
      ).to.exist;
      expect(
        screen.getByText(
          `${VEILEDER_IDENT_DEFAULT} vurderte at aktivitetskravet var oppfylt`
        )
      ).to.exist;
    });
  });

  describe("Møtebehov", () => {
    it("viser meldte møtebehov", async () => {
      queryClient.setQueryData(
        motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
        () => motebehovMock
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getAllByText("Dialogmøte")).to.have.length(4); // Tre behov, og én behandling
      expect(
        screen.getByText(
          "Den sykmeldte svarte ja på ønske om dialogmøte. Svaret var: Jeg svarer på møtebehov ved 17 uker"
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Are Arbeidsgiver (Arbeidsgiver) svarte nei på ønske om dialogmøte. Svaret var: Jeg liker ikke møte!!"
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Den sykmeldte meldte behov for dialogmøte. Begrunnelse: Møter er bra!"
        )
      ).to.exist;
      expect(screen.getByText("Z990000 vurderte behovet for dialogmøte")).to
        .exist;
    });
  });

  describe("Forespørsel om oppfølgingsplan", () => {
    it("viser forespørseler om oppfølgingsplan", async () => {
      queryClient.setQueryData(
        oppfolgingsplanForesporselQueryKeys.foresporsel(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => mockForesporseler
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getAllByText("Forespørsel oppfølgingsplan")).to.have.length(
        2
      );
      expect(
        screen.getByText(
          `Z990000 ba om oppfølgingsplan fra ${VIRKSOMHET_ENTERPRISE.virksomhetsnummer}.`
        )
      ).to.exist;
      expect(
        screen.getByText(
          `Z990000 ba om oppfølgingsplan fra ${VIRKSOMHET_BRANNOGBIL.virksomhetsnummer}.`
        )
      ).to.exist;
    });
  });

  describe("Tildelt oppfølgingenhet", () => {
    it("Viser tildelte oppfølgingsenheter", async () => {
      queryClient.setQueryData(
        behandlendeEnhetQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
        () => tildeltOppfolgingsenhetHistorikk
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getAllByText("Oppfølgingsenhet")).to.have.length(3);
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${tilLesbarDatoMedArstall(
              addDays(currentOppfolgingstilfelle.start, 5)
            )} Z990000 tildelte sykmeldt tilbake til geografisk kontortilhørighet`
          ),
        })
      ).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${tilLesbarDatoMedArstall(
              addDays(currentOppfolgingstilfelle.start, 3)
            )} Z990000 tildelte sykmeldt til NAV Grünerløkka \\(0315\\)`
          ),
        })
      ).to.exist;
      expect(
        screen.getByRole("row", {
          name: new RegExp(
            `${tilLesbarDatoMedArstall(
              addDays(currentOppfolgingstilfelle.start, 10)
            )} Systemet tildelte sykmeldt tilbake til geografisk kontortilhørighet`
          ),
        })
      ).to.exist;
    });
  });

  describe("Kartleggingsspørsmål", () => {
    const kartleggingssporsmalKandidatDefault: KartleggingssporsmalKandidatResponseDTO =
      {
        kandidatUuid: generateUUID(),
        personident: ARBEIDSTAKER_DEFAULT.personIdent,
        varsletAt: null,
        svarAt: null,
        status: KandidatStatus.KANDIDAT,
        statusAt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
        vurdering: null,
        createdAt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
      };

    it("Ingen kandidater - 0 rader i oversikten", async () => {
      queryClient.setQueryData(
        kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => []
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.queryByText("ble kandidat til kartleggingsspørsmål")).to.be
        .null;
      expect(screen.queryByText("ble varslet om kartleggingsspørsmål")).to.be
        .null;
      expect(screen.queryByText("svarte på kartleggingsspørsmål")).to.be.null;
    });

    it("Kandidat opprettet - 1 rad i oversikten", async () => {
      queryClient.setQueryData(
        kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [kartleggingssporsmalKandidatDefault]
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getByText(/ble kandidat til kartleggingsspørsmål/)).to
        .exist;
    });

    it("Kandidat varslet og svart og vurdert - 4 rader i oversikten", async () => {
      const varsletAt = addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 1);
      const svarAt = addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 2);
      const vurdertAt = addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 3);

      queryClient.setQueryData(
        kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...kartleggingssporsmalKandidatDefault,
            varsletAt: varsletAt,
            svarAt: svarAt,
            status: KandidatStatus.FERDIGBEHANDLET,
            vurdering: {
              vurdertAt: vurdertAt,
              vurdertBy: VEILEDER_IDENT_DEFAULT,
            },
          },
        ]
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(screen.getByText(/ble kandidat til kartleggingsspørsmål/)).to
        .exist;
      expect(screen.getByText(/ble varslet om kartleggingsspørsmål/)).to.exist;
      expect(screen.getByText(/svarte på kartleggingsspørsmål/)).to.exist;
      expect(
        screen.getByText(
          `Kartleggingsspørsmålene ble vurdert av ${VEILEDER_IDENT_DEFAULT}`
        )
      ).to.exist;
    });

    it("To kandidater med svar - 6 rader i oversikten", async () => {
      const varsletAt = addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 1);
      const svarAt = addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 2);

      queryClient.setQueryData(
        kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...kartleggingssporsmalKandidatDefault,
            kandidatUuid: generateUUID(),
            varsletAt: varsletAt,
            svarAt: svarAt,
            status: KandidatStatus.SVAR_MOTTATT,
          },
          {
            ...kartleggingssporsmalKandidatDefault,
            kandidatUuid: generateUUID(),
            varsletAt: varsletAt,
            svarAt: svarAt,
            status: KandidatStatus.SVAR_MOTTATT,
          },
        ]
      );

      renderHistorikk();

      expect(await screen.findAllByText("Historikk")).to.exist;
      expect(
        screen.queryAllByText(/ble kandidat til kartleggingsspørsmål/).length
      ).toBe(2);
      expect(
        screen.queryAllByText(/ble varslet om kartleggingsspørsmål/).length
      ).toBe(2);
      expect(
        screen.queryAllByText(/svarte på kartleggingsspørsmål/).length
      ).toBe(2);
    });
  });
});
