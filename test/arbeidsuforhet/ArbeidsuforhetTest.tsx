import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { screen } from "@testing-library/react";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { addWeeks } from "@/utils/datoUtils";
import {
  createForhandsvarsel,
  createVurdering,
} from "./arbeidsuforhetTestData";
import { Arbeidsuforhet } from "@/sider/arbeidsuforhet/Arbeidsuforhet";
import { renderWithRouter } from "../testRouterUtils";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { mockSykmeldinger } from "../mockdata/sykmeldinger/mockSykmeldinger";
import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";
import dayjs from "dayjs";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const mockSykmeldingerQuery = (sykmeldinger: SykmeldingNewFormatDTO[]) => {
  queryClient.setQueryData(
    sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
    () => sykmeldinger
  );
};

const renderArbeidsuforhetSide = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <Arbeidsuforhet />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    arbeidsuforhetPath,
    [arbeidsuforhetPath]
  );
};

describe("ArbeidsuforhetSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Show correct info", () => {
    it("show forhandsvarsel form if no there are no existing vurderinger", () => {
      const vurderinger = [];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.getByText("Send forhåndsvarsel")).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
      expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
      expect(
        screen.queryByText(
          "Du har gitt avslag i modia og oppgaven er fjernet fra oversikten."
        )
      ).to.not.exist;
    });

    it("show forhandsvarsel form if latest arbeidsuforhet status is oppfylt", () => {
      const oppfyltVurdering = createVurdering({
        type: VurderingType.OPPFYLT,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [oppfyltVurdering];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.getByText("Send forhåndsvarsel")).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
      expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
      expect(
        screen.queryByText(
          "Du har gitt avslag i modia og oppgaven er fjernet fra oversikten."
        )
      ).to.not.exist;
    });

    it("show forhandsvarsel form if latest arbeidsuforhet status is avslag but there's a newer sykmelding", () => {
      const avslag = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [avslag];
      mockArbeidsuforhetVurderinger(vurderinger);
      const sykmelding: SykmeldingNewFormatDTO = {
        ...mockSykmeldinger[0],
        sykmeldingsperioder: [
          {
            fom: addWeeks(new Date(), 1).toString(),
            tom: addWeeks(new Date(), 3).toString(),
            type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
            reisetilskudd: false,
          },
        ],
      };
      mockSykmeldingerQuery([sykmelding]);

      renderArbeidsuforhetSide();

      expect(screen.getByText("Send forhåndsvarsel")).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
      expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
      expect(
        screen.queryByText(
          "Du har gitt avslag i modia og oppgaven er fjernet fra oversikten."
        )
      ).to.not.exist;
    });

    it("show sent forhandsvarsel page if status is forhandsvarsel and frist is not utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
      expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
      expect(
        screen.queryByText(
          "Du har gitt avslag i modia og oppgaven er fjernet fra oversikten."
        )
      ).to.not.exist;
    });

    it("show sent forhandsvarsel page if status is forhandsvarsel and frist is utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), -3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
      expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
      expect(screen.getByText("Fristen er gått ut")).to.exist;
      expect(
        screen.queryByText(
          "Du har gitt avslag i modia og oppgaven er fjernet fra oversikten."
        )
      ).to.not.exist;
    });

    it("show avslag page if status is avslag and there are no sykmeldinger", () => {
      const avslag = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [avslag];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
      expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
      expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
      expect(
        screen.getByText(
          "Du har gitt avslag i modia og oppgaven er fjernet fra oversikten."
        )
      ).to.exist;
    });

    it("show avslag page if status is avslag and sykmelding starts at the same time as avslag was made", () => {
      const today = dayjs();
      const avslag = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "begrunnelse",
        createdAt: today.toDate(),
      });
      const vurderinger = [avslag];
      mockArbeidsuforhetVurderinger(vurderinger);
      const sykmelding: SykmeldingNewFormatDTO = {
        ...mockSykmeldinger[0],
        sykmeldingsperioder: [
          {
            fom: today.toString(),
            tom: addWeeks(new Date(), 3).toString(),
            type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
            reisetilskudd: false,
          },
        ],
      };
      mockSykmeldingerQuery([sykmelding]);

      renderArbeidsuforhetSide();

      expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
      expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
      expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
      expect(
        screen.getByText(
          "Du har gitt avslag i modia og oppgaven er fjernet fra oversikten."
        )
      ).to.exist;
    });
  });
});
