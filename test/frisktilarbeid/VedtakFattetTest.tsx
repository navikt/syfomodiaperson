import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import React from "react";
import { VedtakFattet } from "@/sider/frisktilarbeid/VedtakFattet";
import {
  InfotrygdStatus,
  VedtakResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { beforeEach, describe, expect, it } from "vitest";
import { createVedtak } from "./frisktilarbeidTestData";
import { queryClientWithMockData } from "../testQueryClient";

let queryClient: QueryClient;

const renderVedtakFattet = (vedtak: VedtakResponseDTO) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <VedtakFattet vedtak={vedtak} />
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("VedtakFattet", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser ingen alert hvis infotrygd-status er ok", () => {
    const vedtakOK: VedtakResponseDTO = createVedtak(new Date());

    renderVedtakFattet(vedtakOK);

    expect(screen.queryByRole("img", { name: "Advarsel" })).to.not.exist;
    expect(screen.queryByText(/Overføring til Infotrygd feilet/)).to.not.exist;
  });
  it("viser advarsel-alert hvis infotrygd-status ikke ok", () => {
    const vedtakIkkeOk: VedtakResponseDTO = {
      ...createVedtak(new Date()),
      infotrygdStatus: InfotrygdStatus.KVITTERING_MANGLER,
    };

    renderVedtakFattet(vedtakIkkeOk);

    expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
    expect(screen.getByText(/Overføring til Infotrygd feilet/)).to.exist;
  });
});
