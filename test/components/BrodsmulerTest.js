import chai from "chai";
import React from "react";
import { mount, shallow } from "enzyme";
import chaiEnzyme from "chai-enzyme";
import Brodsmuler from "../../src/components/Brodsmuler";

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Brodsmuler", () => {
  let component;

  it("Skal vise Ditt NAV dersom ingen brødsmuler sendes inn", () => {
    const brodsmuler = [];
    component = shallow(<Brodsmuler brodsmuler={brodsmuler} />);
    expect(component).to.contain("Ditt NAV");
    expect(component.find("a")).to.have.length(0);
  });

  it("Skal vise Ditt NAV og én brødsmule dersom én brødsmule sendes inn", () => {
    const brodsmuler = [
      {
        tittel: "Sykmelding",
        erKlikkbar: true,
      },
    ];
    component = mount(<Brodsmuler brodsmuler={brodsmuler} />);
    expect(component.find(".js-smuletekst").length).to.equal(1);
    expect(component.find(".js-smule").length).to.equal(1);
  });

  it("Skal ta hensyn til erKlikkbar-flagget", () => {
    const brodsmuler = [
      {
        tittel: "Dine sykmeldinger",
        erKlikkbar: true,
        sti: "/dine-sykmeldinger",
      },
      {
        tittel: "Din sykmelding",
        erKlikkbar: false,
      },
    ];
    component = mount(<Brodsmuler brodsmuler={brodsmuler} />);
    expect(component.find("a").length).to.equal(1);
  });

  it("Skal vise alle brødsmuler dersom det er tre brødsmuler", () => {
    const brodsmuler = [
      {
        tittel: "Brødsmule 2",
        erKlikkbar: true,
        sti: "/brodsmule2",
      },
      {
        tittel: "Brødsmule 3",
        erKlikkbar: true,
        sti: "/brodsmule3",
      },
      {
        tittel: "Brødsmule 4",
      },
    ];
    component = mount(<Brodsmuler brodsmuler={brodsmuler} />);
    expect(component.find("a").length).to.equal(2);
  });

  describe("Dersom det er flere enn tre brødsmuler", () => {
    beforeEach(() => {
      const brodsmuler = [
        {
          tittel: "Brødsmule 1",
          erKlikkbar: true,
          sti: "/dine-sykmeldinger",
        },
        {
          tittel: "Brødsmule 2",
          erKlikkbar: true,
          sti: "/brodsmule",
        },
        {
          tittel: "Brødsmule 3",
          erKlikkbar: true,
          sti: "/brodsmule",
        },
        {
          tittel: "Brødsmule 4",
          erKlikkbar: true,
          sti: "/brodsmule",
        },
        {
          tittel: "Brødsmule 5",
          erKlikkbar: false,
        },
      ];
      component = mount(<Brodsmuler brodsmuler={brodsmuler} />);
    });

    it("Skal vise en lenke med teksten ...", () => {
      expect(component.find(".js-toggle").text()).to.equal("...");
    });

    it("Skal vise de to siste brødsmulene", () => {
      expect(component.find("a.js-smule")).to.have.length(1);
      expect(component.find("span.brodsmule")).to.have.length(2);
    });

    it("Skal vise alle dersom man klikker på ...", () => {
      component.find(".js-toggle").simulate("click");
      expect(component.find("a.js-smule")).to.have.length(4);
      expect(component.find(".js-toggle")).to.have.length(0);
    });
  });
});
