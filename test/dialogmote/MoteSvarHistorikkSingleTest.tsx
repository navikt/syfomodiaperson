import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { expect, describe, it, beforeEach } from "vitest";
import { MoteSvarHistorikkSingle } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkSingle.tsx";
import { createDialogmote } from "@/mocks/isdialogmote/dialogmoterMock";
import dayjs from "dayjs";

let queryClient: QueryClient;

const moteKunInnkalling: DialogmoteDTO = (() => {
  const base = createDialogmote(
    "test-1",
    DialogmoteStatus.INNKALT,
    dayjs().add(2, "days").toDate(),
  );
  return {
    ...base,
    arbeidstaker: {
      ...base.arbeidstaker,
      varselList: base.arbeidstaker.varselList.filter(
        (v) => v.varselType === MotedeltakerVarselType.INNKALT,
      ),
    },
    arbeidsgiver: {
      ...base.arbeidsgiver,
      varselList: base.arbeidsgiver.varselList.filter(
        (v) => v.varselType === MotedeltakerVarselType.INNKALT,
      ),
    },
  };
})();

const moteInnkallingOgToEndringer: DialogmoteDTO = createDialogmote(
  "test-2",
  DialogmoteStatus.INNKALT,
  dayjs().add(2, "days").toDate(),
);

const renderMoteSvarHistorikkSingle = (dialogmote: DialogmoteDTO) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MoteSvarHistorikkSingle dialogmote={dialogmote} />
    </QueryClientProvider>,
  );

describe("MoteSvarHistorikkSingle", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("møte med kun innkalling", () => {
    it("viser én seksjon for innkalling, ingen endringer", () => {
      renderMoteSvarHistorikkSingle(moteKunInnkalling);

      expect(screen.getAllByText(/Innkalling sendt .* - svar:/)).to.have.length(
        1,
      );
      expect(screen.queryByText(/Endret tid\/sted sendt .* - svar:/)).to.not
        .exist;
    });
  });

  describe("møte med innkalling og to endringer", () => {
    it("viser tre seksjoner: innkalling og to endringer", () => {
      renderMoteSvarHistorikkSingle(moteInnkallingOgToEndringer);

      expect(screen.getAllByText(/Innkalling sendt .* - svar:/)).to.have.length(
        1,
      );
      expect(
        screen.getAllByText(/Endret tid\/sted sendt .* - svar:/),
      ).to.have.length(2);
    });
  });
});
