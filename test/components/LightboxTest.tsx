import { expect } from "chai";
import React from "react";
import Lightbox from "../../src/components/Lightbox";
import { render, screen } from "@testing-library/react";

describe("Lightbox", () => {
  it("Skal vise children initielt", () => {
    render(
      <Lightbox>
        <p>Innhold</p>
      </Lightbox>
    );

    expect(screen.getByText("Innhold")).to.exist;
  });
});
