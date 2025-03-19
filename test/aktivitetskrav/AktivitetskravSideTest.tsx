import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { daysFromToday } from "../testUtils";
import { render, screen } from "@testing-library/react";
import { AktivitetskravSide } from "@/sider/aktivitetskrav/AktivitetskravSide";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createAktivitetskrav,
  forhandsvarselVurdering,
  generateOppfolgingstilfelle,
} from "../testDataUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { NotificationContext } from "@/context/notification/NotificationContext";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const noOppfolgingstilfelleAktivitetskravText =
  "Vi finner ingen aktiv sykmelding på denne personen. Du kan likevel vurdere aktivitetskravet hvis det er behov for det.";

const mockOppfolgingstilfellePerson = (
  oppfolgingstilfeller: OppfolgingstilfelleDTO[]
) => {
  const oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO = {
    personIdent: fnr,
    oppfolgingstilfelleList: oppfolgingstilfeller,
  };
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(fnr),
    () => oppfolgingstilfellePerson
  );
};

const mockAktivitetskrav = (aktivitetskrav: AktivitetskravDTO[]) => {
  queryClient.setQueryData(
    aktivitetskravQueryKeys.aktivitetskrav(fnr),
    () => aktivitetskrav
  );
};

const inactiveOppfolgingstilfelle = generateOppfolgingstilfelle(
  daysFromToday(-100),
  daysFromToday(-50)
);

const renderAktivitetskravSide = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationContext.Provider
          value={{ notification: undefined, setNotification: () => void 0 }}
        >
          <AktivitetskravSide />
        </NotificationContext.Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("AktivitetskravSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Start ny vurdering", () => {
    it("Vises når person ikke har aktivitetskrav", () => {
      mockAktivitetskrav([]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
      expect(screen.queryByRole("img", { name: "Advarsel" })).to.not.exist;
      expect(screen.queryByText(noOppfolgingstilfelleAktivitetskravText)).to.not
        .exist;
    });
    it("Vises med advarsel når person har inaktivt oppfølgingstilfelle uten aktivitetskrav", () => {
      mockOppfolgingstilfellePerson([inactiveOppfolgingstilfelle]);
      mockAktivitetskrav([]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
      expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
      expect(screen.getByText(noOppfolgingstilfelleAktivitetskravText)).to
        .exist;
    });
    it("Vises med advarsel når person har verken oppfølgingstilfelle eller aktivitetskrav", () => {
      mockOppfolgingstilfellePerson([]);
      mockAktivitetskrav([]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
      expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
      expect(screen.getByText(noOppfolgingstilfelleAktivitetskravText)).to
        .exist;
    });
    it("Vises når person har aktivitetskrav LUKKET", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.LUKKET),
      ]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
    });
    it("Vises når person har aktivitetskrav IKKE_OPPFYLT", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.IKKE_OPPFYLT
        ),
      ]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
    });
    it("Vises når person har aktivitetskrav IKKE_AKTUELL", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.IKKE_AKTUELL
        ),
      ]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
    });
    it("Vises når person har aktivitetskrav UNNTAK", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.UNNTAK),
      ]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
    });
    it("Vises når person har aktivitetskrav OPPFYLT", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.OPPFYLT),
      ]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
    });
    it("Vises når person har aktivitetskrav AUTOMATISK_OPPFYLT", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.AUTOMATISK_OPPFYLT
        ),
      ]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
    });
    it("Vises når person har aktivitetskrav INNSTILLING_OM_STANS", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.INNSTILLING_OM_STANS
        ),
      ]);

      renderAktivitetskravSide();

      expect(
        screen.queryByRole("heading", { name: "Vurdere aktivitetskravet" })
      ).to.not.exist;
      expect(
        screen.getByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.exist;
    });
    it("Vises ikke når person har aktivitetskrav AVVENT", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.AVVENT),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(
        screen.queryByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.not.exist;
    });
    it("Vises ikke når person har aktivitetskrav FORHANDSVARSEL", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.FORHANDSVARSEL
        ),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(
        screen.queryByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.not.exist;
    });
    it("Vises ikke når person har aktivitetskrav NY", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.NY),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(
        screen.queryByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.not.exist;
    });
    it("Vises ikke når person har aktivitetskrav NY_VURDERING", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.NY_VURDERING
        ),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(
        screen.queryByRole("heading", {
          name: "Start ny aktivitetskrav-vurdering",
        })
      ).to.not.exist;
    });
  });

  describe("Vurder aktivitetskravet", () => {
    it("Vises når person har aktivitetskrav (NY)", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.NY),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
    });
    it("Vises når person har aktivitetskrav (NY_VURDERING)", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.NY_VURDERING
        ),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
    });
    it("Vises når person har aktivitetskrav (AVVENT)", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.AVVENT),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
    });
    it("Vises når person har aktivitetskrav (FORHANDSVARSEL)", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.FORHANDSVARSEL
        ),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
    });
    it("Vises med advarsel når person har inaktivt oppfølgingstilfelle", () => {
      mockOppfolgingstilfellePerson([
        generateOppfolgingstilfelle(daysFromToday(-30), daysFromToday(-20)),
      ]);
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(-25), AktivitetskravStatus.NY),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
      expect(screen.getByText(noOppfolgingstilfelleAktivitetskravText)).to
        .exist;
    });
  });

  describe("Visning av varsel om at forhåndsvarsel ikke ble sendt ut til sykmeldt", () => {
    describe("Varsel skal vises for forhåndsvarsler opprettet i perioden 27.02.25 kl. 12:00 - 10.03.25 kl. 00:00", () => {
      it("Forhåndsvarsel opprettet 27.02.25 kl. 12:00 ved starten av perioden", () => {
        mockAktivitetskrav([
          createAktivitetskrav(
            new Date(),
            AktivitetskravStatus.FORHANDSVARSEL,
            [
              {
                ...forhandsvarselVurdering,
                createdAt: new Date("2025-02-27T12:00:00Z"),
              },
            ]
          ),
        ]);

        renderAktivitetskravSide();

        expect(
          screen.getByText(
            "Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars",
            { exact: false }
          )
        ).to.exist;
      });

      it("Forhåndsvarsel opprettet 05.03.25 kl. 12:00 innenfor periode", () => {
        mockAktivitetskrav([
          createAktivitetskrav(
            new Date(),
            AktivitetskravStatus.FORHANDSVARSEL,
            [
              {
                ...forhandsvarselVurdering,
                createdAt: new Date("2025-03-05T12:00:00Z"),
              },
            ]
          ),
        ]);

        renderAktivitetskravSide();

        expect(
          screen.getByText(
            "Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars",
            { exact: false }
          )
        ).to.exist;
      });

      it("Forhåndsvarsel opprettet 10.03.25 kl. 00:00 ved slutten av perioden", () => {
        mockAktivitetskrav([
          createAktivitetskrav(
            new Date(),
            AktivitetskravStatus.FORHANDSVARSEL,
            [
              {
                ...forhandsvarselVurdering,
                createdAt: new Date("2025-03-10T00:00:00Z"),
              },
            ]
          ),
        ]);

        renderAktivitetskravSide();

        expect(
          screen.getByText(
            "Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars",
            { exact: false }
          )
        ).to.exist;
      });
    });

    describe("Varsel skal ikke vises for forhåndsvarsler opprettet utenfor perioden 27.02.25 kl. 12:00 - 10.03.25 kl. 00:00", () => {
      it("Forhåndsvarsel opprettet 27.02.25 kl. 11:59 rett før starten av perioden", () => {
        mockAktivitetskrav([
          createAktivitetskrav(
            new Date(),
            AktivitetskravStatus.FORHANDSVARSEL,
            [
              {
                ...forhandsvarselVurdering,
                createdAt: new Date("2025-02-27T11:59:00Z"),
              },
            ]
          ),
        ]);

        renderAktivitetskravSide();

        expect(
          screen.queryByText(
            "Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars",
            { exact: false }
          )
        ).to.not.exist;
      });

      it("Forhåndsvarsel opprettet 10.03.25 kl. 00:01 rett etter slutten av perioden", () => {
        mockAktivitetskrav([
          createAktivitetskrav(
            new Date(),
            AktivitetskravStatus.FORHANDSVARSEL,
            [
              {
                ...forhandsvarselVurdering,
                createdAt: new Date("2025-03-10T00:01:00Z"),
              },
            ]
          ),
        ]);

        renderAktivitetskravSide();

        expect(
          screen.queryByText(
            "Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars",
            { exact: false }
          )
        ).to.not.exist;
      });
    });
  });
});
