import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { FriskmeldingTilArbeidsformidling } from "@/sider/frisktilarbeid/FriskmeldingTilArbeidsformidling";
import { expect } from "chai";
import { clickButton, getButton, getTextInput } from "../testUtils";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { createVedtak } from "./frisktilarbeidTestData";
import { addWeeks, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import dayjs from "dayjs";

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
        <FriskmeldingTilArbeidsformidling />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("FriskmeldingTilArbeidsformidling", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("uten vedtak", () => {
    it("viser forberedelser og knapp for å vurdere vedtak initielt", () => {
      renderFriskmeldingTilArbeidsformidling();

      expect(screen.getByRole("heading", { name: "Forberedelser" })).to.exist;
      expect(getButton("Vurder vedtak")).to.exist;
      expect(
        screen.queryByRole("textbox", { name: "Friskmeldingen gjelder fra" })
      ).to.not.exist;
      expect(screen.queryByRole("button", { name: "Fatt vedtak" })).to.not
        .exist;
    });

    it("viser forberedelser og skjema for å fatte vedtak etter å ha trykket på knapp for å vurdere vedtak", () => {
      renderFriskmeldingTilArbeidsformidling();

      clickButton("Vurder vedtak");

      expect(screen.getByRole("heading", { name: "Forberedelser" })).to.exist;

      expect(getTextInput("Friskmeldingen gjelder fra")).to.exist;
      expect(getTextInput("Til dato (automatisk justert 12 uker frem)")).to
        .exist;
      expect(screen.getByRole("group", { name: "Velg behandler" })).to.exist;
      expect(getTextInput("Begrunnelse")).to.exist;
      expect(screen.getByRole("button", { name: "Fatt vedtak" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });
  });

  describe("med vedtak", () => {
    it("viser alert og heading med vedtak-fom når vedtak starter etter i morgen", () => {
      const vedtakFom = addWeeks(new Date(), 1);
      const vedtak = createVedtak(vedtakFom);
      mockVedtak([vedtak]);

      renderFriskmeldingTilArbeidsformidling();

      expect(screen.getByRole("img", { name: "Suksess" })).to.exist;
      expect(
        screen.getByText(
          /Vedtaket om friskmelding til arbeidsformidling er nå fattet/
        )
      ).to.exist;
      expect(
        screen.getByRole("heading", {
          name: `Friskmelding til arbeidsformidling starter: ${tilLesbarDatoMedArUtenManedNavn(
            vedtakFom
          )}`,
        })
      ).to.exist;
      expect(screen.queryByRole("button", { name: "Avslutt oppgave" })).to.not
        .exist;
    });

    it("viser ikke alert når vedtak starter i morgen", () => {
      const vedtakFom = dayjs().add(1, "days").toDate();
      const vedtak = createVedtak(vedtakFom);
      mockVedtak([vedtak]);

      renderFriskmeldingTilArbeidsformidling();

      expect(screen.queryByRole("img", { name: "Suksess" })).to.not.exist;
    });

    it("viser avslutt oppgave når vedtak starter i morgen", () => {
      const vedtakFom = dayjs().add(1, "days").toDate();
      const vedtak = createVedtak(vedtakFom);
      mockVedtak([vedtak]);

      renderFriskmeldingTilArbeidsformidling();

      expect(getButton("Avslutt oppgave")).to.exist;
    });

    it("viser ikke alert når vedtak har startet", () => {
      const vedtak = createVedtak(new Date());
      mockVedtak([vedtak]);

      renderFriskmeldingTilArbeidsformidling();

      expect(screen.queryByRole("img", { name: "Suksess" })).to.not.exist;
    });

    it("viser avslutt oppgave når vedtak har startet", () => {
      const vedtak = createVedtak(new Date());
      mockVedtak([vedtak]);

      renderFriskmeldingTilArbeidsformidling();

      expect(getButton("Avslutt oppgave")).to.exist;
    });
  });
});
