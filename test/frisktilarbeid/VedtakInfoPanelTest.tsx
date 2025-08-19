import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import VedtakInfoPanel from "@/sider/frisktilarbeid/VedtakInfoPanel";
import { createVedtak } from "./frisktilarbeidTestData";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import dayjs from "dayjs";

const getVedtakWith = (
  overrides: Partial<VedtakResponseDTO>
): VedtakResponseDTO => ({
  ...(createVedtak(new Date()) as VedtakResponseDTO),
  ...overrides,
});

describe("VedtakInfoPanel", () => {
  it("viser aktivt vedtak heading når tom er i dag eller fremtid", () => {
    const vedtak = getVedtakWith({
      hasGosysOppgave: true,
      isJournalfort: true,
    });

    render(<VedtakInfoPanel vedtak={vedtak} />);

    expect(screen.getByRole("heading", { name: /Aktivt vedtak/ })).to.exist;
  });

  it("viser tidligere vedtak heading når vedtak er utløpt", () => {
    const twentyWeeksAgo = dayjs().subtract(20, "week").toDate();
    const expiredVedtak = createVedtak(twentyWeeksAgo) as VedtakResponseDTO;
    const overridden: VedtakResponseDTO = {
      ...expiredVedtak,
      hasGosysOppgave: true,
      isJournalfort: true,
    };

    render(<VedtakInfoPanel vedtak={overridden} />);

    expect(screen.getByRole("heading", { name: /Tidligere vedtak/ })).to.exist;
  });

  it("viser grønne ikoner når både gosysOppgave og journalfort er true", () => {
    const vedtak = getVedtakWith({
      hasGosysOppgave: true,
      isJournalfort: true,
    });

    render(<VedtakInfoPanel vedtak={vedtak} />);

    expect(screen.getByTestId("gosys-icon-true")).to.exist;
    expect(screen.queryByTestId("gosys-icon-false")).to.not.exist;
    expect(screen.getByTestId("journal-icon-true")).to.exist;
    expect(screen.queryByTestId("journal-icon-false")).to.not.exist;
  });

  it("viser røde ikoner når både gosysOppgave og journalfort er false", () => {
    const vedtak = getVedtakWith({
      hasGosysOppgave: false,
      isJournalfort: false,
    });

    render(<VedtakInfoPanel vedtak={vedtak} />);

    expect(screen.getByTestId("gosys-icon-false")).to.exist;
    expect(screen.queryByTestId("gosys-icon-true")).to.not.exist;
    expect(screen.getByTestId("journal-icon-false")).to.exist;
    expect(screen.queryByTestId("journal-icon-true")).to.not.exist;
  });
});
