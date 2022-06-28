import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "react-query";
import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import VedtakContainer from "@/components/vedtak/container/VedtakContainer";
import { ARBEIDSTAKER_DEFAULT_FULL_NAME } from "../../mock/common/mockConstants";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { queryClientWithMockData } from "../testQueryClient";

const queryClient = queryClientWithMockData();

describe("VedtakContainer", () => {
  it("viser spinnsyn-lenke til vedtak", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: "", setValgtEnhet: () => void 0 }}
        >
          <MemoryRouter>
            <VedtakContainer />
          </MemoryRouter>
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    );

    const link = screen.getByRole("link", {
      name: `Se vedtakene slik ${ARBEIDSTAKER_DEFAULT_FULL_NAME} ser dem på nav.no`,
    });
    expect(link.getAttribute("href")).to.contain("spinnsyn-frontend-interne");
    expect(link.getAttribute("href")).to.contain("/syk/sykepenger");
  });
});
