import { expect } from "chai";
import { mount, shallow } from "enzyme";
import React from "react";
import sinon from "sinon";
import { Radio } from "nav-frontend-skjema";
import Innholdsviser, {
  Innholdsvelger,
} from "../../../src/mote/components/Innholdsviser";
import AppSpinner from "../../../src/components/AppSpinner";
import { ARBEIDSGIVER, BRUKER } from "../../../src/konstanter";

const getMote = (mote) => {
  return Object.assign(
    {},
    {
      status: "OPPRETTET",
      opprettetTidspunkt: new Date("2017-02-22T15:18:24.323"),
      bekreftetTidspunkt: null,
      deltakere: [
        {
          hendelser: [],
          deltakerUuid: "uuid1",
          navn: "Are Arbeidsgiver",
          orgnummer: "012345678",
          epost: "are.arbeidsgiver@nav.no",
          type: ARBEIDSGIVER,
          svartidspunkt: null,
          svar: [
            {
              id: 1,
              tid: new Date("2017-03-07T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: new Date("2017-03-09T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
          ],
        },
        {
          hendelser: [],
          deltakerUuid: "uuid2",
          navn: "Sygve Sykmeldt",
          orgnummer: null,
          epost: null,
          type: BRUKER,
          svartidspunkt: null,
          svar: [
            {
              id: 1,
              tid: new Date("2017-03-07T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: new Date("2017-03-09T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
          ],
        },
      ],
      bekreftetAlternativ: null,
      alternativer: [
        {
          id: 1,
          tid: new Date("2017-03-07T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 2,
          tid: new Date("2017-02-25T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
    mote
  );
};

describe("Innholdsviser", () => {
  let mote;
  let hentEpostinnhold;
  let epostinnhold;
  let component;
  const arbeidstaker = {
    kontaktinfo: {
      skalHaVarsel: true,
    },
  };

  beforeEach(() => {
    mote = getMote();
    hentEpostinnhold = sinon.spy();
    epostinnhold = {
      emne: "Mitt emne",
      innhold: "<p>Mitt innhold</p>",
    };
  });

  it("Skal hente epostinnhold", () => {
    component = shallow(
      <Innholdsviser
        arbeidstaker={arbeidstaker}
        hentEpostinnhold={hentEpostinnhold}
        mote={mote}
      />
    );
    component.instance().componentDidMount();
    expect(hentEpostinnhold.calledWith("uuid1")).to.be.equal(true);
  });

  it("Viser AppSpinner når epostinnhold hentes", () => {
    component = shallow(
      <Innholdsviser
        arbeidstaker={arbeidstaker}
        hentEpostinnhold={hentEpostinnhold}
        mote={mote}
        henter
      />
    );
    expect(component.find(AppSpinner)).to.have.length(1);
  });

  it("Viser epostinnhold dersom epostinnhold er hentet", () => {
    component = shallow(
      <Innholdsviser
        arbeidstaker={arbeidstaker}
        hentEpostinnhold={hentEpostinnhold}
        mote={mote}
        epostinnhold={epostinnhold}
      />
    );
    expect(component.html()).to.contain("Mitt emne");
    expect(component.html()).to.contain("Mitt innhold");
  });

  it("Viser Innholdsvelger", () => {
    component = shallow(
      <Innholdsviser
        arbeidstaker={arbeidstaker}
        hentEpostinnhold={hentEpostinnhold}
        mote={mote}
        epostinnhold={epostinnhold}
      />
    );
    expect(component.find(Innholdsvelger)).to.have.length(1);
  });

  it("Skal hente epostinnhold når man klikker på en radioknapp i innholdsvelgeren", () => {
    component = mount(
      <Innholdsviser
        arbeidstaker={arbeidstaker}
        hentEpostinnhold={hentEpostinnhold}
        mote={mote}
        epostinnhold={epostinnhold}
      />
    );
    component.find("input#epostinnhold-til-arbeidstaker").simulate("change");
    expect(hentEpostinnhold.calledWith("uuid2")).to.be.equal(true);
  });

  describe("Innholdsvelger", () => {
    let onChange;

    beforeEach(() => {
      onChange = sinon.spy();
      component = shallow(
        <Innholdsvelger
          arbeidstaker={arbeidstaker}
          onChange={onChange}
          valgtDeltaker={BRUKER}
        />
      );
    });

    it("Skal vise to radioknapper", () => {
      expect(component.find(Radio)).to.have.length(2);
    });

    it("Skal kalle på onChange med valgt deltakertype når man klikker på en radioknapp", () => {
      component.find(Radio).at(0).simulate("change");
      expect(onChange.calledWith(ARBEIDSGIVER)).to.be.equal(true);

      component.find(Radio).at(1).simulate("change");
      expect(onChange.calledWith(BRUKER)).to.be.equal(true);
    });
  });
});
