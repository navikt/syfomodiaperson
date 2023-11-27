import { render, screen, within } from "@testing-library/react";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect } from "chai";
import { ARBEIDSTAKER_DEFAULT_FULL_NAME } from "../../mock/common/mockConstants";
import { queryClientWithMockData } from "../testQueryClient";

let queryClient: QueryClient;

const renderUtdragFraSykefravaeret = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <UtdragFraSykefravaeret />
    </QueryClientProvider>
  );
};

describe("UtdragFraSykefravaeret", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  it("viser spinnsyn-lenke til vedtak", () => {
    renderUtdragFraSykefravaeret();

    expect(screen.getByRole("heading", { name: "Vedtak" })).to.exist;
    const link = screen.getByRole("link", {
      name: `Se vedtakene slik ${ARBEIDSTAKER_DEFAULT_FULL_NAME} ser dem på nav.no`,
    });
    expect(link.getAttribute("href")).to.contain("spinnsyn-frontend-interne");
    expect(link.getAttribute("href")).to.contain("/syk/sykepenger");
  });

  it("Viser sykmeldinger med sykmelder og arbeidsgiver", () => {
    renderUtdragFraSykefravaeret();

    const firstExpansionCard = screen.getAllByRole("region")[0];
    expect(within(firstExpansionCard).getByText("Sykmelder:")).to.exist;
    expect(within(firstExpansionCard).getByText("Lego Las Legesen")).to.exist;
    expect(within(firstExpansionCard).getByText("Arbeidsgiver:")).to.exist;
    expect(within(firstExpansionCard).getByText("BRANN OG BIL AS")).to.exist;
  });
});
