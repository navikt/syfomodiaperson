import { expect } from "chai";
import React from "react";
import Brodsmuler, {
  Brodsmule,
} from "../../src/components/speiling/Brodsmuler";
import { BrowserRouter } from "react-router-dom";
import { render, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Brodsmuler", () => {
  let component;

  it("Skal vise Ditt NAV og ingen linker dersom ingen brødsmuler sendes inn", () => {
    component = render(<Brodsmuler brodsmuler={[]} />);
    expect(component.getByText("Ditt NAV")).to.exist;
    expect(component.queryByRole("link")).to.not.exist;
  });

  it("Skal vise Ditt NAV og én brødsmule dersom én brødsmule sendes inn", () => {
    const brodsmuler: Brodsmule[] = [
      {
        tittel: "Sykmelding",
      },
    ];
    component = render(<Brodsmuler brodsmuler={brodsmuler} />);
    expect(component.getByText("Du er her:")).to.exist;
    expect(getBrodsmule(component, "Ditt NAV")).to.exist;
    expect(getBrodsmule(component, "Sykmelding")).to.exist;
  });

  it("Skal vise alle brødsmuler dersom det er tre brødsmuler", () => {
    const brodsmuler: Brodsmule[] = [
      {
        tittel: "Brødsmule 2",
      },
      {
        tittel: "Brødsmule 3",
      },
      {
        tittel: "Brødsmule 4",
      },
    ];
    component = render(
      <BrowserRouter>
        <Brodsmuler brodsmuler={brodsmuler} />
      </BrowserRouter>
    );
    expect(getBrodsmule(component, "Brødsmule 2")).to.exist;
    expect(getBrodsmule(component, "Brødsmule 3")).to.exist;
    expect(getBrodsmule(component, "Brødsmule 4")).to.exist;
  });

  describe("Dersom det er flere enn tre brødsmuler", () => {
    beforeEach(() => {
      const brodsmuler: Brodsmule[] = [
        {
          tittel: "Brødsmule 1",
        },
        {
          tittel: "Brødsmule 2",
        },
        {
          tittel: "Brødsmule 3",
        },
        {
          tittel: "Brødsmule 4",
        },
        {
          tittel: "Brødsmule 5",
        },
      ];
      component = render(
        <BrowserRouter>
          <Brodsmuler brodsmuler={brodsmuler} />
        </BrowserRouter>
      );
    });

    it("Skal vise en lenke med teksten ...", () => {
      expect(component.getByText("...", { selector: ".js-toggle" })).to.exist;
      expect(component.getByRole("button", { name: "Vis hele brødsmulestien" }))
        .to.exist;
    });

    it("Skal vise de to siste brødsmulene", () => {
      expect(getBrodsmule(component, "Brødsmule 1")).to.not.exist;
      expect(getBrodsmule(component, "Brødsmule 2")).to.not.exist;
      expect(getBrodsmule(component, "Brødsmule 3")).to.not.exist;
      expect(getBrodsmule(component, "Brødsmule 4")).to.exist;
      expect(getBrodsmule(component, "Brødsmule 5")).to.exist;
    });

    it("Skal vise alle dersom man klikker på ...", () => {
      userEvent.click(component.getByRole("button"));
      expect(getBrodsmule(component, "Brødsmule 1")).to.exist;
      expect(getBrodsmule(component, "Brødsmule 2")).to.exist;
      expect(getBrodsmule(component, "Brødsmule 3")).to.exist;
      expect(getBrodsmule(component, "Brødsmule 4")).to.exist;
      expect(getBrodsmule(component, "Brødsmule 5")).to.exist;
    });
  });
});

const getBrodsmule = (
  component: RenderResult,
  text: string
): HTMLElement | null =>
  component.queryByText(text, { selector: ".brodsmule" });
