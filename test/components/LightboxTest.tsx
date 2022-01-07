import { expect } from "chai";
import React from "react";
import Lightbox from "../../src/components/Lightbox";
import { render } from "@testing-library/react";

describe("Lightbox", () => {
  it("Skal vise children initielt", () => {
    const component = render(
      <Lightbox>
        <p>Innhold</p>
      </Lightbox>
    );
    expect(component.getByText("Innhold")).to.exist;
  });
});
