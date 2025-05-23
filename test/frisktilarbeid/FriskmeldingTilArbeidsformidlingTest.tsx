import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { FriskmeldingTilArbeidsformidling } from "@/sider/frisktilarbeid/FriskmeldingTilArbeidsformidling";
import { beforeEach, describe, expect, it } from "vitest";
import { clickButton, getButton } from "../testUtils";
import {
  VedtakResponseDTO,
  VilkarResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { createVedtak } from "./frisktilarbeidTestData";
import dayjs from "dayjs";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { defaultVilkar } from "@/mocks/isfrisktilarbeid/mockIsfrisktilarbeid";

let queryClient: QueryClient;

const mockVedtak = (vedtak: VedtakResponseDTO[]) => {
  queryClient.setQueryData(
    vedtakQueryKeys.vedtak(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vedtak
  );
};

const renderFriskmeldingTilArbeidsformidling = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <FriskmeldingTilArbeidsformidling />
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("FriskmeldingTilArbeidsformidling", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser mulighet for å fjerne oppgaven fra oversikten når vedtak har startet", () => {
    const vedtak = createVedtak(new Date());
    mockVedtak([vedtak]);

    renderFriskmeldingTilArbeidsformidling();

    expect(getButton("Fjern oppgaven fra oversikten")).to.exist;
  });

  it("viser ferdigbehandlet vedtak når det finnes", () => {
    const vedtak = createVedtak(
      dayjs().subtract(13, "weeks").toDate(),
      dayjs().subtract(14, "weeks").toDate()
    );
    mockVedtak([vedtak]);

    renderFriskmeldingTilArbeidsformidling();

    expect(screen.getByText("Start nytt vedtak")).to.exist;
    expect(
      screen.getByText("Forrige vedtak på denne personen ble fattet", {
        exact: false,
      })
    ).to.exist;
  });

  it("viser aktivt vedtak når det finnes", () => {
    const vedtak = createVedtak(
      dayjs().subtract(1, "days").toDate(),
      dayjs().toDate()
    );
    mockVedtak([vedtak]);

    renderFriskmeldingTilArbeidsformidling();

    expect(screen.getByText("Aktivt vedtak")).to.exist;
  });

  it("viser nytt vedtak skjema når bruker trykker 'Nytt vedtak' når ferdigbehandlet vedtak finnes og vedtak sin til og med dato har passert", async () => {
    const vedtak = createVedtak(
      dayjs().subtract(12, "weeks").subtract(1, "day").toDate(),
      dayjs().toDate()
    );
    queryClient.setQueryData(
      vedtakQueryKeys.vilkar(ARBEIDSTAKER_DEFAULT.personIdent),
      () => defaultVilkar
    );
    mockVedtak([vedtak]);

    renderFriskmeldingTilArbeidsformidling();
    await clickButton("Nytt vedtak");

    expect(await screen.findByRole("heading", { name: "Fatt vedtak" })).to
      .exist;
    expect(await screen.findByText("Friskmeldingen gjelder fra")).to.exist;
    expect(
      await screen.findByRole("button", {
        hidden: true,
        name: "Fatt vedtak",
      })
    );
  });

  it("viser alert for manglende arbeidssokerregistrering hvis person ikke arbeidssoker", () => {
    const vilkar: VilkarResponseDTO = {
      isArbeidssoker: false,
    };
    queryClient.setQueryData(
      vedtakQueryKeys.vilkar(ARBEIDSTAKER_DEFAULT.personIdent),
      () => vilkar
    );

    renderFriskmeldingTilArbeidsformidling();

    expect(
      screen.getByText(
        "Her kan du fatte et nytt vedtak for § 8-5 friskmelding til arbeidsformidling. Husk å sjekke at alle nødvendige forutsetninger er oppfylt før ordningen starter."
      )
    ).to.exist;
    expect(
      screen.getByText(
        "Den sykemeldte er ikke registrert som arbeidssøker. Dette må gjøres før et nytt vedtak kan fattes."
      )
    ).to.exist;
  });

  it("viser alert om at det ikke er mulig å starte nytt vedtak ettersom det finnes et eksisterende aktivt vedtak", () => {
    const vedtak = createVedtak(
      dayjs().subtract(12, "weeks").toDate(),
      dayjs().toDate()
    );
    queryClient.setQueryData(
      vedtakQueryKeys.vilkar(ARBEIDSTAKER_DEFAULT.personIdent),
      () => defaultVilkar
    );
    mockVedtak([vedtak]);
    renderFriskmeldingTilArbeidsformidling();

    expect(screen.getByText("Aktivt vedtak")).to.exist;
    expect(
      screen.getByText(
        "Tidligst mulig tidspunkt for å fatte et nytt vedtak er dagen etter forrige vedtak er avsluttet."
      )
    ).to.exist;
  });
});
