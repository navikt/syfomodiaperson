import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";
import DropdownInnholdsviser from "../../../src/mote/components/DropdownInnholdsviser";
import AppSpinner from "../../../src/components/AppSpinner";

const getMote = (mote) => {
  return Object.assign(
    {},
    {
      status: "OPPRETTET",
      opprettetTidspunkt: new Date("2017-02-22T15:18:24.323"),
      bekreftetTidspunkt: new Date("2017-02-22T15:18:24.323"),
      bekreftetAlternativ: {
        id: 1,
        tid: new Date("2017-03-07T15:18:24.323"),
        created: new Date("2017-02-22T15:18:24.323"),
        sted: "Testveien 2",
        valgt: false,
      },
      deltakere: [
        {
          hendelser: [],
          deltakerUuid: "uuid1",
          navn: "Are Arbeidsgiver",
          orgnummer: "012345678",
          epost: "are.arbeidsgiver@nav.no",
          type: "Arbeidsgiver",
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
          type: "Bruker",
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
  let component;
  let mote;
  let hentEpostinnhold;
  let hentArbeidsgiverEpostinnhold;
  let epostinnhold;
  let arbeidsgiverepostinnhold;

  beforeEach(() => {
    mote = getMote();
    hentEpostinnhold = sinon.spy();
    hentArbeidsgiverEpostinnhold = sinon.spy();
    epostinnhold = {
      emne: "Mitt emne, arbeidstaker",
      innhold: "<p>Mitt innhold, arbeidstaker</p>",
    };
    arbeidsgiverepostinnhold = {
      emne: "Mitt emne, arbeidsgiver",
      innhold: "<p>Mitt innhold arbeidsgiver</p>",
    };
  });

  it("Skal hente epostinnhold for arbeidstaker", () => {
    component = shallow(
      <DropdownInnholdsviser
        hentEpostinnhold={hentEpostinnhold}
        mote={mote}
        type="Bruker"
      />
    );
    component.instance().componentDidMount();
    expect(hentEpostinnhold.calledWith("uuid2", 1)).to.be.equal(true);
  });

  it("Viser AppSpinner når epostinnhold hentes for arbeidstaker", () => {
    component = shallow(
      <DropdownInnholdsviser
        hentEpostinnhold={hentEpostinnhold}
        mote={mote}
        henter
        type="Bruker"
      />
    );
    expect(component.find(AppSpinner)).to.have.length(1);
  });

  it("Viser epostinnhold dersom epostinnhold er hentet for arbeidstaker", () => {
    component = shallow(
      <DropdownInnholdsviser
        hentEpostinnhold={hentEpostinnhold}
        mote={mote}
        epostinnhold={epostinnhold}
        type="Bruker"
      />
    );
    expect(component.html()).to.contain("Mitt emne, arbeidstaker");
    expect(component.html()).to.contain("Mitt innhold, arbeidstaker");
  });

  it("Skal hente epostinnhold for arbeidsgiver", () => {
    component = shallow(
      <DropdownInnholdsviser
        hentArbeidsgiverEpostinnhold={hentArbeidsgiverEpostinnhold}
        mote={mote}
        type="Arbeidsgiver"
      />
    );
    component.instance().componentDidMount();
    expect(hentArbeidsgiverEpostinnhold.calledWith("uuid1", 1)).to.be.equal(
      true
    );
  });

  it("Viser AppSpinner når epostinnhold hentes for arbeidsgiver", () => {
    component = shallow(
      <DropdownInnholdsviser
        hentArbeidsgiverEpostinnhold={hentArbeidsgiverEpostinnhold}
        mote={mote}
        henter
        type="Arbeidsgiver"
      />
    );
    expect(component.find(AppSpinner)).to.have.length(1);
  });

  it("Viser epostinnhold dersom epostinnhold er hentet for arbeidsgiver", () => {
    component = shallow(
      <DropdownInnholdsviser
        hentArbeidsgiverEpostinnhold={hentArbeidsgiverEpostinnhold}
        mote={mote}
        arbeidsgiverepostinnhold={arbeidsgiverepostinnhold}
        type="Arbeidsgiver"
      />
    );
    expect(component.html()).to.contain("Mitt emne, arbeidsgiver");
    expect(component.html()).to.contain("Mitt innhold arbeidsgiver");
  });
});
