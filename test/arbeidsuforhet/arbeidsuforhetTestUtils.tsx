import { renderWithRouter } from "../testRouterUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { NotificationContext } from "@/context/notification/NotificationContext";
import React from "react";
import type { MemoryRouterProps } from "react-router-dom";

export const renderArbeidsuforhetSide = (
  queryClient: QueryClient,
  element: React.ReactNode,
  path: string,
  initialEntries?: MemoryRouterProps["initialEntries"],
) =>
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationContext.Provider
          value={{ notification: undefined, setNotification: () => void 0 }}
        >
          {element}
        </NotificationContext.Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    path,
    initialEntries,
  );
