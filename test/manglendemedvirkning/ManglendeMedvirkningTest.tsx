import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { renderWithRouter } from "../testRouterUtils";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import ManglendeMedvirkning from "@/sider/manglendemedvirkning/ManglendeMedvirkning";
import {
  createManglendeMedvirkningVurdering,
  defaultForhandsvarselVurdering,
} from "./manglendeMedvirkningTestData";
import { clickButton, getButton } from "../testUtils";

let queryClient: QueryClient;

const renderManglendeMedvirkning = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationProvider>
          <ManglendeMedvirkning />
        </NotificationProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    manglendeMedvirkningPath,
    [manglendeMedvirkningPath]
  );
};

function mockVurdering(vurderinger: VurderingResponseDTO[] = []) {
  queryClient.setQueryData(
    manglendeMedvirkningQueryKeys.manglendeMedvirkning(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => vurderinger
  );
}

describe("Manglendemedvirkning", () => {
  const nyVurderingButtonText = "Start ny vurdering";

  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  describe("Ny vurdering", () => {
    it("viser ny vurdering-knapp når ingen tidligere vurderinger", () => {
      mockVurdering([]);
      renderManglendeMedvirkning();

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(getButton(nyVurderingButtonText)).to.exist;
    });
    it("viser ny vurdering-knapp når forrige vurdering OPPFYLT", () => {
      const oppfyltVurdering = createManglendeMedvirkningVurdering(
        VurderingType.OPPFYLT
      );
      mockVurdering([oppfyltVurdering, defaultForhandsvarselVurdering]);
      renderManglendeMedvirkning();

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/oppfylt/)).to.exist;
      expect(getButton(nyVurderingButtonText)).to.exist;
    });
    it("viser ny vurdering-knapp når forrige vurdering STANS", () => {
      const stansVurdering = createManglendeMedvirkningVurdering(
        VurderingType.STANS
      );
      mockVurdering([stansVurdering, defaultForhandsvarselVurdering]);
      renderManglendeMedvirkning();

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/stans/)).to.exist;
      expect(getButton(nyVurderingButtonText)).to.exist;
    });
    it("viser ny vurdering-knapp når forrige vurdering IKKE AKTUELL", () => {
      const ikkeAktuellVurdering = createManglendeMedvirkningVurdering(
        VurderingType.IKKE_AKTUELL
      );
      mockVurdering([ikkeAktuellVurdering, defaultForhandsvarselVurdering]);
      renderManglendeMedvirkning();

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/ikke aktuell/)).to.exist;
      expect(getButton(nyVurderingButtonText)).to.exist;
    });
    it("viser ny vurdering-knapp når forrige vurdering UNNTAK", () => {
      const unntakVurdering = createManglendeMedvirkningVurdering(
        VurderingType.UNNTAK
      );
      mockVurdering([unntakVurdering]);
      renderManglendeMedvirkning();

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/unntak/)).to.exist;
      expect(getButton(nyVurderingButtonText)).to.exist;
    });

    it("viser forhandsvarsel-skjema etter klikk på ny vurdering-knapp uten tidligere vurderinger", async () => {
      mockVurdering();
      renderManglendeMedvirkning();

      await clickButton(nyVurderingButtonText);

      expect(screen.getByText("Send forhåndsvarsel")).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: "Begrunnelse (obligatorisk)",
        })
      ).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });

    it("viser forhandsvarsel-skjema etter klikk på ny vurdering-knapp når forrige vurdering OPPFYLT", async () => {
      const oppfyltVurdering = createManglendeMedvirkningVurdering(
        VurderingType.OPPFYLT
      );
      mockVurdering([oppfyltVurdering, defaultForhandsvarselVurdering]);
      renderManglendeMedvirkning();

      await clickButton(nyVurderingButtonText);

      expect(screen.getByText("Send forhåndsvarsel")).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: "Begrunnelse (obligatorisk)",
        })
      ).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });

    it("viser ikke ny vurdering-knapp når forhåndsvarsel sendt", () => {
      mockVurdering([defaultForhandsvarselVurdering]);
      renderManglendeMedvirkning();

      expect(screen.queryByRole("button", { name: nyVurderingButtonText })).to
        .not.exist;
    });
  });
});
