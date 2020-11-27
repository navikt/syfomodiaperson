import React from "react";
import { expect } from "chai";
import { render } from "enzyme";

import Feilmelding from "../../src/components/Feilmelding";

describe("Feilmelding", () => {
  it("Skal vise en standard feilmelding", () => {
    const component = render(<Feilmelding />);
    expect(component.find("h3").text()).to.equal(
      "Beklager, det oppstod en feil"
    );
    expect(component.find("p").text()).to.equal(
      "Vennligst prøv igjen litt senere."
    );
  });

  it("Skal vise innsendt tittel/melding", () => {
    const m = { __html: "<p>melding</p>" };
    const component = render(<Feilmelding tittel="tittel" melding={m} />);
    expect(component.find("h3").text()).to.equal("tittel");
    expect(component.find("p").text()).to.equal("melding");
  });
});
