import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { arbeidsuforhetQueryKeys } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import {
  Notification,
  NotificationContext,
} from "@/context/notification/NotificationContext";
import NyVurdering from "@/sider/arbeidsuforhet/NyVurdering";
import { clickButton } from "../testUtils";

let queryClient: QueryClient;

function renderNyVurdering(notification: Notification | undefined) {
  render(
    <QueryClientProvider client={queryClient}>
      <NotificationContext.Provider
        value={{ notification, setNotification: () => void 0 }}
      >
        <NyVurdering handleClick={() => void 0} />
      </NotificationContext.Provider>
    </QueryClientProvider>,
  );
}

describe("NyVurdering", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [],
    );
  });

  describe("uten notification", () => {
    beforeEach(() => {
      renderNyVurdering(undefined);
    });

    it("viser ikke varsel", () => {
      expect(screen.queryByRole("alert")).to.not.exist;
    });
  });

  describe("med success-notification", () => {
    beforeEach(() => {
      renderNyVurdering({ message: "Vurderingen er lagret" });
    });

    it("viser varsel med tittel", () => {
      expect(screen.getByRole("alert")).to.exist;
      expect(
        screen.getByRole("heading", {
          name: (name) => name.endsWith("Vurderingen er lagret"),
        }),
      ).to.exist;
    });

    it("skjuler varselet når det lukkes", async () => {
      await clickButton("Lukk");

      expect(screen.queryByRole("alert")).to.not.exist;
    });
  });

  describe("med announcement-notification med innhold", () => {
    beforeEach(() => {
      renderNyVurdering({
        message: "Husk å svare på oppgave i Gosys",
        content: "Svar på oppgaven i Gosys.",
        alertStatus: "announcement",
      });
    });

    it("viser tittel og innhold", () => {
      expect(
        screen.getByRole("heading", {
          name: (name) => name.endsWith("Husk å svare på oppgave i Gosys"),
        }),
      ).to.exist;
      expect(screen.getByText("Svar på oppgaven i Gosys.")).to.exist;
    });
  });
});
