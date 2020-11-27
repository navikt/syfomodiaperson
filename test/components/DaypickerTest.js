import chai from "chai";
import React from "react";
import { shallow } from "enzyme";
import chaiEnzyme from "chai-enzyme";
import sinon from "sinon";
import DayPicker from "react-day-picker";
import DaypickerComponent from "../../src/components/datovelger/DayPicker";

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("DaypickerComponent", () => {
  let component;
  let input;
  let meta;
  let clock;
  let dp;
  let onKeyUp;
  let onDayClick;
  const today = new Date("2017-01-16");

  beforeEach(() => {
    clock = sinon.useFakeTimers(today.getTime()); // 16. januar 2017
    input = {
      value: "",
    };
    meta = {
      touched: false,
      error: "",
    };
    onKeyUp = sinon.spy();
    onDayClick = sinon.spy();
    component = shallow(
      <DaypickerComponent
        input={input}
        meta={meta}
        onKeyUp={onKeyUp}
        onDayClick={onDayClick}
      />
    );
    dp = component.find(DayPicker);
  });

  afterEach(() => {
    clock.restore();
  });

  it("Skal ha en selectedDays-funksjon som returnere false (fordi dato ikke er satt)", () => {
    expect(component.instance().selectedDays(new Date())).to.be.equal(false);
  });

  it("Skal sette initialMonth til dagens måned", () => {
    expect(dp.prop("initialMonth")).to.deep.equal(new Date());
  });

  describe("Når dato er satt", () => {
    beforeEach(() => {
      input.value = "22.02.2017";
      component = shallow(
        <DaypickerComponent
          onKeyUp={onKeyUp}
          onDayClick={onDayClick}
          input={input}
          meta={meta}
        />
      );
      component.setState({ erApen: true });
    });

    it("Skal sette initialMonth til valgt måned", () => {
      expect(component.find(DayPicker).prop("initialMonth")).to.deep.equal(
        new Date("2017-02-22")
      );
    });

    it("Skal ha en selectedDays-funksjon som returnere true hvis innsendt dato er lik valgt dato", () => {
      expect(
        component.instance().selectedDays(new Date("2017-02-22"))
      ).to.be.equal(true);
    });

    it("Skal ha en selectedDays-funksjon som returnere true hvis innsendt dato ikke er lik valgt dato", () => {
      expect(
        component.instance().selectedDays(new Date("2017-02-21"))
      ).to.be.equal(false);
    });
  });

  describe("Når dato er satt til noe ugyldig", () => {
    beforeEach(() => {
      input.value = "22.02.201";
      component = shallow(
        <DaypickerComponent
          input={input}
          meta={meta}
          id="olsen"
          onKeyUp={onKeyUp}
          onDayClick={onDayClick}
        />
      );
      component.setState({ erApen: true });
    });

    it("Skal sette initialMonth til dagens måned", () => {
      expect(component.find(DayPicker).prop("initialMonth")).to.deep.equal(
        new Date()
      );
    });

    it("Skal ha en selectedDays-funksjon som returnerer false", () => {
      expect(
        component.instance().selectedDays(new Date("2017-02-22"))
      ).to.be.equal(false);
    });
  });

  describe("onDayClick", () => {
    beforeEach(() => {
      const tidligsteFom = new Date("2017-01-10");
      const senesteTom = new Date("2017-01-20");
      component = shallow(
        <DaypickerComponent
          input={input}
          meta={meta}
          onKeyUp={onKeyUp}
          onDayClick={onDayClick}
          tidligsteFom={tidligsteFom}
          senesteTom={senesteTom}
        />
      );
      dp = component.find(DayPicker);
    });

    it("Skal kalle på innsendt onDayClick hvis dag er aktiv", () => {
      dp.prop("onDayClick")(new Date("2017-01-12"));
      expect(onDayClick.called).to.be.equal(true);
    });

    it("Skal kalle på innsendt onDayClick hvis dag er aktiv og det ikke finnes tidligsteFom/senesteTom", () => {
      component = shallow(
        <DaypickerComponent
          input={input}
          meta={meta}
          onKeyUp={onKeyUp}
          onDayClick={onDayClick}
        />
      );
      dp = component.find(DayPicker);
      dp.prop("onDayClick")(new Date("2017-01-12"));
      expect(onDayClick.called).to.be.equal(true);
    });

    it("Skal ikke kalle på innsendt onDayClick hvis dag er deaktivert", () => {
      dp.prop("onDayClick")(new Date("2017-01-09"));
      expect(onDayClick.called).to.be.equal(false);
    });
  });

  describe("erDeaktivertDag", () => {
    beforeEach(() => {
      const tidligsteFom = new Date("2017-01-10");
      const senesteTom = new Date("2017-01-20");
      component = shallow(
        <DaypickerComponent
          input={input}
          meta={meta}
          id="olsen"
          tidligsteFom={tidligsteFom}
          senesteTom={senesteTom}
          onKeyUp={onKeyUp}
          onDayClick={onDayClick}
        />
      );
    });

    it("Skal returnere true hvis innsendt dato er før tidligsteFom", () => {
      expect(
        component.instance().erDeaktivertDag(new Date("2017-01-08"))
      ).to.be.equal(true);
    });

    it("Skal returnere true hvis innsendt dato er etter senesteTom", () => {
      expect(
        component.instance().erDeaktivertDag(new Date("2017-01-21"))
      ).to.be.equal(true);
    });

    it("Skal returnere false hvis innsendt dato er samme dag som tidligsteFom", () => {
      expect(
        component.instance().erDeaktivertDag(new Date("2017-01-10"))
      ).to.be.equal(false);
    });

    it("Skal returnere false hvis innsendt dato er samme dag som senesteTom", () => {
      expect(
        component.instance().erDeaktivertDag(new Date("2017-01-20"))
      ).to.be.equal(false);
    });

    it("Skal returnere false hvis innsendt dato er mellom tidligsteFom og senesteTom", () => {
      expect(
        component.instance().erDeaktivertDag(new Date("2017-01-11"))
      ).to.be.equal(false);
      expect(
        component.instance().erDeaktivertDag(new Date("2017-01-19"))
      ).to.be.equal(false);
    });

    it("Feil med tidssone", () => {
      const day = new Date(
        "Wed Jul 20 2016 12:00:00 GMT+0200 (Central Europe Daylight Time)"
      );
      const senesteTom = new Date(
        "Wed Jul 20 2016 02:00:00 GMT+0200 (Central Europe Daylight Time)"
      );
      component = shallow(
        <DaypickerComponent
          input={input}
          meta={meta}
          id="olsen"
          senesteTom={senesteTom}
          onKeyUp={onKeyUp}
          onDayClick={onDayClick}
        />
      );
      expect(component.instance().erDeaktivertDag(day)).to.be.equal(false);
    });

    describe("erDeaktivertDag med bare tidligsteFom", () => {
      beforeEach(() => {
        const tidligsteFom = new Date("2017-01-10");
        component = shallow(
          <DaypickerComponent
            input={input}
            meta={meta}
            id="olsen"
            tidligsteFom={tidligsteFom}
            onKeyUp={onKeyUp}
            onDayClick={onDayClick}
          />
        );
      });

      it("Skal returnere true hvis innsendt dato er før tidligsteFom", () => {
        expect(
          component.instance().erDeaktivertDag(new Date("2017-01-08"))
        ).to.be.equal(true);
      });

      it("Skal returnere false hvis innsendt dato er samme dag som tidligsteFom", () => {
        expect(
          component.instance().erDeaktivertDag(new Date("2017-01-10"))
        ).to.be.equal(false);
      });

      it("Skal returnere false hvis innsendt dato er etter tidligsteFom", () => {
        expect(
          component.instance().erDeaktivertDag(new Date("2017-01-11"))
        ).to.be.equal(false);
      });
    });

    describe("erDeaktivertDag med bare senesteTom", () => {
      beforeEach(() => {
        const senesteTom = new Date("2017-01-20");
        component = shallow(
          <DaypickerComponent
            input={input}
            meta={meta}
            id="olsen"
            senesteTom={senesteTom}
            onKeyUp={onKeyUp}
            onDayClick={onDayClick}
          />
        );
      });

      it("Skal returnere true hvis innsendt dato er etter senesteTom", () => {
        expect(
          component.instance().erDeaktivertDag(new Date("2017-01-21"))
        ).to.be.equal(true);
      });

      it("Skal returnere false hvis innsendt dato er samme dag som senesteTom", () => {
        expect(
          component.instance().erDeaktivertDag(new Date("2017-01-20"))
        ).to.be.equal(false);
      });

      it("Skal returnere false hvis innsendt dato er før senesteTom", () => {
        expect(
          component.instance().erDeaktivertDag(new Date("2017-01-11"))
        ).to.be.equal(false);
      });
    });
  });
});
