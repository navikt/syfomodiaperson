import { expect } from "chai";
import React from "react";
import Brodsmuler, {
  Brodsmule,
} from "../../src/components/speiling/Brodsmuler";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getButton } from "../testUtils";

describe("Brodsmuler", () => {
  it("Skal vise Ditt NAV og ingen linker dersom ingen brødsmuler sendes inn", () => {
    render(<Brodsmuler brodsmuler={[]} />);

    expect(screen.getByText("Ditt NAV")).to.exist;
    expect(screen.queryByRole("link")).to.not.exist;
  });

  it("Skal vise Ditt NAV og én brødsmule dersom én brødsmule sendes inn", () => {
    const brodsmuler: Brodsmule[] = [
      {
        tittel: "Sykmelding",
      },
    ];
    render(<Brodsmuler brodsmuler={brodsmuler} />);

    expect(screen.getByText("Du er her:")).to.exist;
    expect(getBrodsmule("Ditt NAV")).to.exist;
    expect(getBrodsmule("Sykmelding")).to.exist;
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
    render(
      <BrowserRouter>
        <Brodsmuler brodsmuler={brodsmuler} />
      </BrowserRouter>
    );

    expect(getBrodsmule("Brødsmule 2")).to.exist;
    expect(getBrodsmule("Brødsmule 3")).to.exist;
    expect(getBrodsmule("Brødsmule 4")).to.exist;
  });

  describe("Dersom det er flere enn tre brødsmuler", () => {
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

    it("Skal vise en lenke med teksten ...", () => {
      render(
        <BrowserRouter>
          <Brodsmuler brodsmuler={brodsmuler} />
        </BrowserRouter>
      );
      expect(screen.getByText("...", { selector: ".js-toggle" })).to.exist;
      expect(getButton("Vis hele brødsmulestien")).to.exist;
    });

    it("Skal vise de to siste brødsmulene", () => {
      render(
        <BrowserRouter>
          <Brodsmuler brodsmuler={brodsmuler} />
        </BrowserRouter>
      );
      expect(getBrodsmule("Brødsmule 1")).to.not.exist;
      expect(getBrodsmule("Brødsmule 2")).to.not.exist;
      expect(getBrodsmule("Brødsmule 3")).to.not.exist;
      expect(getBrodsmule("Brødsmule 4")).to.exist;
      expect(getBrodsmule("Brødsmule 5")).to.exist;
    });

    it("Skal vise alle dersom man klikker på ...", () => {
      render(
        <BrowserRouter>
          <Brodsmuler brodsmuler={brodsmuler} />
        </BrowserRouter>
      );
      userEvent.click(screen.getByRole("button"));
      expect(getBrodsmule("Brødsmule 1")).to.exist;
      expect(getBrodsmule("Brødsmule 2")).to.exist;
      expect(getBrodsmule("Brødsmule 3")).to.exist;
      expect(getBrodsmule("Brødsmule 4")).to.exist;
      expect(getBrodsmule("Brødsmule 5")).to.exist;
    });
  });
});

const getBrodsmule = (text: string): HTMLElement | null =>
  screen.queryByText(text, { selector: ".brodsmule" });
