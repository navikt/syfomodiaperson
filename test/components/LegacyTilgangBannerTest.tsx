import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LegacyTilgangBanner from "../../src/components/LegacyTilgangBanner";

describe("LegacyTilgangBanner", () => {
  it("viser advarsel om at tilgangen snart utgår", () => {
    render(<LegacyTilgangBanner />);

    expect(
      screen.getByText(
        "Din tilgang til Modia er basert på en eldre tilgangsordning som snart vil bli avviklet."
      )
    ).to.exist;
  });

  it("viser rollene brukeren må be om tilgang til", () => {
    render(<LegacyTilgangBanner />);

    expect(screen.getByText("0000-CA-MODIA-SYFO-VEILEDER")).to.exist;
    expect(screen.getByText("0000-CA-MODIA-SYFO-LESETILGANG")).to.exist;
  });

  it("nevner Mine Tilganger", () => {
    render(<LegacyTilgangBanner />);

    expect(screen.getByText(/Mine Tilganger/)).to.exist;
  });
});
