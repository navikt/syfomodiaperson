import { render, screen } from "@testing-library/react";
import GlobalNavigasjon from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  queryClientWithAktivBruker,
  queryClientWithMockData,
} from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import {
  personoppgaverMock,
  personOppgaveUbehandletBehandlerdialogAvvistMelding,
  personOppgaveUbehandletBehandlerdialogSvar,
  personOppgaveUbehandletBehandlerdialogUbesvartMelding,
} from "@/mocks/ispersonoppgave/personoppgaveMock";
import { arbeidsuforhetQueryKeys } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import {
  createForhandsvarsel,
  createVurdering,
} from "../arbeidsuforhet/arbeidsuforhetTestData";
import { addDays, addWeeks } from "@/utils/datoUtils";
import { VurderingType } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { senOppfolgingKandidatQueryKeys } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { unleashQueryKeys } from "@/data/unleash/unleashQueryHooks";
import { mockUnleashResponse } from "@/mocks/unleashMocks";
import {
  ferdigbehandletKandidatMock,
  senOppfolgingKandidatMock,
} from "@/mocks/ismeroppfolging/mockIsmeroppfolging";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { defaultVedtak } from "@/mocks/isfrisktilarbeid/mockIsfrisktilarbeid";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  aktivitetskrav,
  expiredForhandsvarselAktivitetskrav,
  forhandsvarselAktivitetskrav,
} from "../aktivitetskrav/vurdering/vurderingTestUtils";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import {
  defaultForhandsvarselVurdering,
  defaultForhandsvarselVurderingAfterDeadline,
} from "../manglendemedvirkning/manglendeMedvirkningTestData";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient: QueryClient;

const mockUnleashWithFeatureToggles = () => {
  queryClient.setQueryData(
    unleashQueryKeys.toggles(navEnhet.id, ""),
    () => mockUnleashResponse
  );
};

const renderGlobalNavigasjon = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <GlobalNavigasjon aktivtMenypunkt={Menypunkter.NOKKELINFORMASJON} />
        </ValgtEnhetContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("GlobalNavigasjon", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplaner(fnr),
      () => []
    );
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(fnr),
      () => []
    );
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => []
    );
  });
  it("viser linker for alle menypunkter uten toggle", () => {
    renderGlobalNavigasjon();
    const navnMenypunkter = [
      "Nøkkelinformasjon",
      "Sykmeldinger",
      "Søknader om sykepenger",
      "Dialog med behandler",
      "Oppfølgingsplaner",
      "Dialogmøter",
      "§ 8-8 Aktivitetskrav",
      "§ 8-8 Manglende medvirkning",
      "§ 8-4 Arbeidsuførhet",
      "§ 8-5 Friskmelding til arbeidsformidling",
      "Snart slutt på sykepengene",
      "Historikk",
      "Vedtak",
    ];

    const linker = screen.getAllByRole("link");
    linker.forEach((link, index) => {
      expect(link.textContent).to.equal(navnMenypunkter[index]);
    });
  });
  it("viser aktivt menypunkt", () => {
    renderGlobalNavigasjon();

    const currentMenypunkt = screen.getByRole("listitem", {
      current: true,
    });
    expect(currentMenypunkt.textContent).to.equal("Nøkkelinformasjon");
  });
  it("viser rød prikk for menypunkt Dialogmøter når ubehandlet oppgave dialogmøte-svar", () => {
    queryClient.setQueryData(personoppgaverQueryKeys.personoppgaver(fnr), () =>
      personoppgaverMock()
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialogmøter 1" })).to.exist;
  });

  it("viser én rød prikk for menypunkt Dialog med behandler når ubehandlet oppgave behandlerdialog-svar", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [personOppgaveUbehandletBehandlerdialogSvar]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 1" })).to
      .exist;
  });

  it("viser én rød prikk for menypunkt Dialog med behandler når ubehandlet oppgave ubesvart melding", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [personOppgaveUbehandletBehandlerdialogUbesvartMelding]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 1" })).to
      .exist;
  });

  it("viser én rød prikk for menypunkt Dialog med behandler når ubehandlet oppgave avvist melding", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [personOppgaveUbehandletBehandlerdialogAvvistMelding]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 1" })).to
      .exist;
  });

  it("viser tre røde prikker for menypunkt Dialog med behandler når ubehandlet oppgave ubesvart melding, ubehandlet behandlerdialog-svar og ubehandlet avvist melding", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [
        personOppgaveUbehandletBehandlerdialogSvar,
        personOppgaveUbehandletBehandlerdialogUbesvartMelding,
        personOppgaveUbehandletBehandlerdialogAvvistMelding,
      ]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 3" })).to
      .exist;
  });

  it("viser rød prikk for menypunkt Aktivitetskrav når nytt aktivitetskrav", () => {
    queryClient.setQueryData(aktivitetskravQueryKeys.aktivitetskrav(fnr), [
      aktivitetskrav,
    ]);

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-8 Aktivitetskrav 1" })).to
      .exist;
  });

  it("viser rød prikk for menypunkt Aktivitetskrav når utløpt forhåndsvarsel", () => {
    queryClient.setQueryData(aktivitetskravQueryKeys.aktivitetskrav(fnr), [
      expiredForhandsvarselAktivitetskrav,
    ]);

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-8 Aktivitetskrav 1" })).to
      .exist;
  });

  it("viser ikke rød prikk for menypunkt Aktivitetskrav når ikke-utløpt forhåndsvarsel", () => {
    queryClient.setQueryData(aktivitetskravQueryKeys.aktivitetskrav(fnr), [
      forhandsvarselAktivitetskrav,
    ]);

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-8 Aktivitetskrav" })).to.exist;
  });

  it("viser rød prikk for menypunkt Arbeidsuforhet når siste vurdering er utløpt forhåndsvarsel", () => {
    const expiredForhandsvarsel = createForhandsvarsel({
      createdAt: new Date(),
      svarfrist: addWeeks(new Date(), -3),
    });
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => [expiredForhandsvarsel]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-4 Arbeidsuførhet 1" })).to
      .exist;
  });

  it("viser ikke rød prikk for menypunkt Arbeidsuforhet når siste vurdering er ikke-utløpt forhåndsvarsel", () => {
    const notExpiredForhandsvarsel = createForhandsvarsel({
      createdAt: new Date(),
      svarfrist: addWeeks(new Date(), 5),
    });
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => [notExpiredForhandsvarsel]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-4 Arbeidsuførhet" })).to.exist;
  });

  it("viser ikke rød prikk for menypunkt Arbeidsuforhet når siste vurdering er oppfylt", () => {
    const oppfyltVurdering = createVurdering({
      type: VurderingType.OPPFYLT,
      begrunnelse: "begrunnelse",
      createdAt: new Date(),
    });
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => [oppfyltVurdering]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-4 Arbeidsuførhet" })).to.exist;
  });

  it("viser ikke rød prikk for menypunkt Arbeidsuforhet når siste vurdering er avslag", () => {
    const avslagVurdering = createVurdering({
      type: VurderingType.AVSLAG,
      begrunnelse: "begrunnelse",
      createdAt: new Date(),
    });
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => [avslagVurdering]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-4 Arbeidsuførhet" })).to.exist;
  });

  it("viser ikke rød prikk for menypunkt Arbeidsuforhet når ingen vurdering", () => {
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => []
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-4 Arbeidsuførhet" })).to.exist;
  });

  it('viser en rød prikk for menypunkt "Snart slutt på sykepengene" når kandidat med svar', () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(
      senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(fnr),
      () => [senOppfolgingKandidatMock]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Snart slutt på sykepengene 1" }))
      .to.exist;
  });

  it('viser en rød prikk for menypunkt "Snart slutt på sykepengene" når kandidat varslet for minst ti dager siden uten svar', () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(
      senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(fnr),
      () => [
        {
          ...senOppfolgingKandidatMock,
          varselAt: addDays(new Date(), -10),
          svar: undefined,
        },
      ]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Snart slutt på sykepengene 1" }))
      .to.exist;
  });

  it('viser ikke en rød prikk for menypunkt "Snart slutt på sykepengene" når kandidat varslet i dag uten svar', () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(
      senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(fnr),
      () => [
        {
          ...senOppfolgingKandidatMock,
          varselAt: new Date(),
          svar: undefined,
        },
      ]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Snart slutt på sykepengene" })).to
      .exist;
  });

  it('viser ikke en rød prikk for menypunkt "Snart slutt på sykepengene" når kandidat er ferdigbehandlet', () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(
      senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(fnr),
      () => [ferdigbehandletKandidatMock]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Snart slutt på sykepengene" })).to
      .exist;
  });

  it("viser ikke en rød prikk for menypunkt Snart slutt på sykepengene når kandidat uten svar", () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(
      senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(fnr),
      () => [
        {
          ...senOppfolgingKandidatMock,
          svar: undefined,
        },
      ]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Snart slutt på sykepengene" })).to
      .exist;
  });

  it('viser en rød prikk for menypunkt "Friskmelding til arbeidsformidling" når ikke ferdigbehandlet', () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(vedtakQueryKeys.vedtak(fnr), () => [
      defaultVedtak,
    ]);
    renderGlobalNavigasjon();

    expect(
      screen.getByRole("link", {
        name: "§ 8-5 Friskmelding til arbeidsformidling 1",
      })
    ).to.exist;
  });

  it('viser ikke en rød prikk for menypunkt "Friskmelding til arbeidsformidling" når ferdigbehandlet', () => {
    mockUnleashWithFeatureToggles();
    const ferdigbehandletVedtak: VedtakResponseDTO = {
      ...defaultVedtak,
      ferdigbehandletAt: new Date(),
      ferdigbehandletBy: "Z999999",
    };
    queryClient.setQueryData(vedtakQueryKeys.vedtak(fnr), () => [
      ferdigbehandletVedtak,
    ]);
    renderGlobalNavigasjon();

    expect(
      screen.getByRole("link", {
        name: "§ 8-5 Friskmelding til arbeidsformidling",
      })
    ).to.exist;
  });

  it('viser ikke en rød prikk for menypunkt "Friskmelding til arbeidsformidling" når bare ett av ferdigbehandletfeltene finnes', () => {
    mockUnleashWithFeatureToggles();
    const ferdigbehandletVedtak: VedtakResponseDTO = {
      ...defaultVedtak,
      ferdigbehandletAt: new Date(),
    };
    queryClient.setQueryData(vedtakQueryKeys.vedtak(fnr), () => [
      ferdigbehandletVedtak,
    ]);
    renderGlobalNavigasjon();

    expect(
      screen.getByRole("link", {
        name: "§ 8-5 Friskmelding til arbeidsformidling",
      })
    ).to.exist;
  });

  it('viser ikke en rød prikk for menypunkt "Friskmelding til arbeidsformidling" når ingen vedtak', () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(vedtakQueryKeys.vedtak(fnr), () => []);
    renderGlobalNavigasjon();

    expect(
      screen.getByRole("link", {
        name: "§ 8-5 Friskmelding til arbeidsformidling",
      })
    ).to.exist;
  });

  it('viser en rød prikk for menypunkt "Manglende Medvirkning" når forhåndsvarselet er utgått', () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(
      manglendeMedvirkningQueryKeys.manglendeMedvirkning(fnr),
      () => [defaultForhandsvarselVurderingAfterDeadline]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-8 Manglende medvirkning 1" }))
      .to.exist;
  });

  it('viser ikke en rød prikk for menypunkt "Manglende Medvirkning" når forhåndsvarselet ikke er utgått', () => {
    mockUnleashWithFeatureToggles();
    queryClient.setQueryData(
      manglendeMedvirkningQueryKeys.manglendeMedvirkning(fnr),
      () => [defaultForhandsvarselVurdering]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "§ 8-8 Manglende medvirkning" })).to
      .exist;
  });
});
