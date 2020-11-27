import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import Lightbox from "../../src/components/Lightbox";

describe("Lightbox", () => {
  it("Skal vise children", () => {
    const component = shallow(
      <Lightbox>
        <p>Innhold</p>
      </Lightbox>
    );
    expect(component.contains(<p>Innhold</p>)).to.be.equal(true);
  });

  it("Skal ha initiell state = erApen === true", () => {
    const component = shallow(
      <Lightbox>
        <p>Innhold</p>
      </Lightbox>
    );
    expect(component.state().erApen).to.be.equal(true);
  });
});
