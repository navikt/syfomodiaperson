import React from "react";
import { expect } from "chai";

import Feilmelding from "../../src/components/Feilmelding";
import { render } from "@testing-library/react";

describe("Feilmelding", () => {
  it("Skal vise en standard feilmelding", () => {
    const component = render(<Feilmelding />);
    expect(
      component.getByRole("heading", { name: "Beklager, det oppstod en feil" })
    ).to.exist;
    expect(component.getByText("Vennligst prøv igjen litt senere.")).to.exist;
  });

  it("Skal vise innsendt tittel/melding", () => {
    const m = { __html: "<p>melding</p>" };
    const component = render(<Feilmelding tittel="tittel" melding={m} />);
    expect(component.getByRole("heading", { name: "tittel" })).to.exist;
    expect(component.getByText("melding")).to.exist;
  });
});
