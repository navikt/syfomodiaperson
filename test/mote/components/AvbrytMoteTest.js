import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import AvbrytMote, {
  InnholdsviserContainer,
  mapStateToInnholdsviserProps,
} from "../../../src/mote/components/AvbrytMote";
import Epostmottakere from "../../../src/mote/components/Epostmottakere";
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

describe("AvbrytMote-", () => {
  let component;
  let mote;
  let navbruker;
  let ledetekster;

  beforeEach(() => {
    mote = getMote();
    ledetekster = {
      "mote.avbrytmote.overskrift": "Avbryt møte",
    };
    navbruker = {
      data: {
        kontaktinfo: {
          skalHaVarsel: true,
        },
      },
    };
  });

  it("Viser tittel", () => {
    component = shallow(
      <AvbrytMote navbruker={navbruker} mote={mote} ledetekster={ledetekster} />
    );
    expect(component.text()).to.contain("Avbryt møte");
  });

  it("Viser Epostmottakere når det er to mottakere", () => {
    component = shallow(<AvbrytMote mote={mote} navbruker={navbruker} />);
    expect(component.find(Epostmottakere)).to.have.length(1);
    expect(component.find(Epostmottakere).prop("mote")).to.deep.equal(mote);
  });

  it("Viser en InnholdsviserContainer", () => {
    component = shallow(
      <AvbrytMote navbruker={navbruker} mote={mote} ledetekster={ledetekster} />
    );
    expect(component.find(InnholdsviserContainer)).to.have.length(1);
  });

  describe("mapStateToInnholdsviserProps", () => {
    let state;

    beforeEach(() => {
      state = {
        epostinnhold: {
          data: {},
          henter: false,
          hentingFeilet: false,
        },
        navbruker: {
          data: {},
          henter: false,
          hentingFeilet: false,
        },
      };
    });

    it("Skal returnere epostinnhold, henter og hentingFeilet", () => {
      const res = mapStateToInnholdsviserProps(state);
      expect(res.epostinnhold).to.deep.equal({});
      expect(res.henter).to.be.equal(false);
      expect(res.hentingFeilet).to.be.equal(false);
    });

    it("Skal returnere hentingFeilet", () => {
      state.epostinnhold.hentingFeilet = true;
      const res = mapStateToInnholdsviserProps(state);
      expect(res.hentingFeilet).to.be.equal(true);
    });

    it("Skal returnere henter", () => {
      state.epostinnhold.henter = true;
      const res = mapStateToInnholdsviserProps(state);
      expect(res.henter).to.be.equal(true);
    });
  });
});
