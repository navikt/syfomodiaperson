import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
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
import {
  addDays,
  addWeeks,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { renderWithRouter } from "../testRouterUtils";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import ManglendeMedvirkning from "@/sider/manglendemedvirkning/ManglendeMedvirkning";
import { generateUUID } from "@/utils/uuidUtils";
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
  });

  describe("ForhandsvarselSendt", () => {
    it("viser ikke ny vurdering-knapp når forhåndsvarsel sendt", () => {
      mockVurdering([defaultForhandsvarselVurdering]);
      renderManglendeMedvirkning();

      expect(screen.queryByRole("button", { name: nyVurderingButtonText })).to
        .not.exist;
    });
    it("viser ForhandsvarselBeforeDeadline når svarfrist ikke utgått", () => {
      mockVurdering([defaultForhandsvarselVurdering]);
      renderManglendeMedvirkning();

      expect(
        screen.getByText(
          `Forhåndsvarselet er sendt ${tilLesbarDatoMedArUtenManedNavn(
            new Date()
          )}.`
        )
      ).to.exist;
      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
      expect(screen.getByText("Fristen går ut:")).to.exist;
      expect(
        screen.getByText(
          "Dersom du har mottatt nye opplysninger og vurdert at bruker likevel oppfyller § 8-8, klikker du på Oppfylt-knappen."
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Velg Ikke aktuell-knappen dersom personen har blitt friskmeldt etter at forhåndsvarselet ble sendt ut, eller av andre årsaker ikke er aktuell."
        )
      ).to.exist;
      expect(screen.getByText("Du kan ikke stanse før fristen er gått ut.")).to
        .exist;
      expect(screen.getByRole("img", { name: "klokkeikon" })).to.exist;
      expect(
        screen.getByRole("button", { name: "Innstilling om stans" })
      ).to.have.property("disabled", true);
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Ikke aktuell" })).to.exist;
    });

    it("viser ForhandsvarselAfterDeadline når svarfrist er utgått", () => {
      const createdAt = addWeeks(new Date(), -3);
      const svarfrist = addDays(new Date(), -1);
      const forhandsvarselAfterFrist: VurderingResponseDTO = {
        ...defaultForhandsvarselVurdering,
        createdAt: createdAt,
        varsel: {
          uuid: generateUUID(),
          createdAt: createdAt,
          svarfrist: svarfrist,
        },
      };
      mockVurdering([forhandsvarselAfterFrist]);
      renderManglendeMedvirkning();

      expect(screen.getByText("Fristen er gått ut")).to.exist;
      expect(screen.getByText("Fristen var:")).to.exist;
      expect(screen.getByText(tilLesbarDatoMedArUtenManedNavn(svarfrist))).to
        .exist;
      expect(screen.getByRole("img", { name: "bjelleikon" })).to.exist;
      expect(
        screen.getByText(
          `Fristen for forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
            createdAt
          )} er gått ut. Trykk på Innstilling om stans-knappen hvis vilkårene i § 8-8 ikke er oppfylt og rett til videre sykepenger skal stanses.`
        )
      ).to.exist;
      expect(
        screen.getByText(
          "Velg Ikke aktuell-knappen dersom personen har blitt friskmeldt etter at forhåndsvarselet ble sendt ut, eller av andre årsaker ikke er aktuell."
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Innstilling om stans" })).to
        .exist;
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Ikke aktuell" })).to.exist;
    });
  });
});
