import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import HistorikkContainer from "@/sider/historikk/container/HistorikkContainer";
import { renderWithRouter } from "../testRouterUtils";
import { historikkPath } from "@/routers/AppRouter";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { historikkQueryKeys } from "@/data/historikk/historikkQueryHooks";
import { historikkmotebehovMock } from "@/mocks/syfomotebehov/historikkmotebehovMock";
import { historikkoppfolgingsplanMock } from "@/mocks/syfooppfolgingsplanservice/historikkoppfolgingsplanMock";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { aktivitetskravHistorikkMock } from "@/mocks/isaktivitetskrav/aktivitetskravHistorikkMock";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { mockArbeidsuforhetvurdering } from "@/mocks/isarbeidsuforhet/arbeidsuforhetMock";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";
import {
  createDialogmote,
  dialogmoterMock,
} from "@/mocks/isdialogmote/dialogmoterMock";
import { DialogmoteStatus } from "@/data/dialogmote/types/dialogmoteTypes";
import dayjs from "dayjs";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { defaultForhandsvarselVurdering } from "../manglendemedvirkning/manglendeMedvirkningTestData";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";
import { createVedtak } from "../frisktilarbeid/frisktilarbeidTestData";

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

describe("Historikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      historikkQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
      () => historikkmotebehovMock
    );
    queryClient.setQueryData(
      historikkQueryKeys.oppfolgingsplan(ARBEIDSTAKER_DEFAULT.personIdent),
      () => historikkoppfolgingsplanMock
    );
    queryClient.setQueryData(
      aktivitetskravQueryKeys.historikk(ARBEIDSTAKER_DEFAULT.personIdent),
      () => aktivitetskravHistorikkMock
    );
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
      () => mockArbeidsuforhetvurdering
    );
    queryClient.setQueryData(
      manglendeMedvirkningQueryKeys.manglendeMedvirkning(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => [defaultForhandsvarselVurdering]
    );
    queryClient.setQueryData(
      vedtakQueryKeys.vedtak(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [createVedtak(new Date())]
    );
    queryClient.setQueryData(
      dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
      () => dialogmoterMock
    );
  });

  it("viser select/dropdown med oppfolgingstilfeller", async () => {
    renderHistorikk();

    expect(await screen.findAllByText("Logg")).to.exist;
    expect(screen.getByLabelText("Sykefraværstilfelle")).to.exist;
    expect(screen.getByText("Sykefraværstilfelle")).to.exist;
    expect(
      screen.getByRole("option", { name: "21. februar – 10. desember 2024" })
    ).to.exist;
    expect(screen.getByRole("option", { name: "Utenfor sykefraværstilfelle" }))
      .to.exist;
  });

  describe("historikk for dialogmøter", () => {
    it("viser innkalt dialogmøte", async () => {
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [dialogmoterMock[0]]
      );
      renderHistorikk();

      expect(await screen.findAllByText("Logg")).to.exist;
      expect(
        screen.getByText("Det ble innkalt til dialogmøte", { exact: false })
      ).to.exist;
    });

    it("viser ferdigstilt dialogmøte", async () => {
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [
          createDialogmote(
            "3",
            DialogmoteStatus.FERDIGSTILT,
            dayjs().subtract(2, "days").toDate()
          ),
        ]
      );
      renderHistorikk();

      expect(await screen.findAllByText("Logg")).to.exist;
      expect(
        screen.getByText("Det ble skrevet referat for dialogmøtet avholdt", {
          exact: false,
        })
      ).to.exist;
    });

    it("viser avlyst dialogmøte", async () => {
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [
          createDialogmote(
            "3",
            DialogmoteStatus.AVLYST,
            dayjs().subtract(2, "days").toDate()
          ),
        ]
      );
      renderHistorikk();

      expect(await screen.findAllByText("Logg")).to.exist;
      expect(
        screen.getByText("ble avlyst av", {
          exact: false,
        })
      ).to.exist;
    });

    it("viser endret dialogmøte", async () => {
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [
          createDialogmote(
            "3",
            DialogmoteStatus.NYTT_TID_STED,
            dayjs().subtract(2, "days").toDate()
          ),
        ]
      );
      renderHistorikk();

      expect(await screen.findAllByText("Logg")).to.exist;
      expect(
        screen.getByText("Dialogmøtet ble endret til nytt tid eller sted av", {
          exact: false,
        })
      ).to.exist;
    });

    it("viser lukket dialogmøte", async () => {
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [
          createDialogmote(
            "3",
            DialogmoteStatus.LUKKET,
            dayjs().subtract(2, "days").toDate()
          ),
        ]
      );
      renderHistorikk();

      expect(await screen.findAllByText("Logg")).to.exist;
      expect(
        screen.getByText("ble manuelt lukket av systemet", {
          exact: false,
        })
      ).to.exist;
    });
  });
});
