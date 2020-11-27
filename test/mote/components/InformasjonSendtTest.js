import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import { Utvidbar } from "@navikt/digisyfo-npm";
import { ARBEIDSGIVER, BRUKER } from "../../../src/konstanter";
import InformasjonSendt, {
  InnholdsviserContainer,
} from "../../../src/mote/components/InformasjonSendt";

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

describe("InformasjonSendt", () => {
  let ledetekster;
  let mote;
  let component;
  const arbeidstaker = {
    kontaktinfo: {
      skalHaVarsel: true,
    },
  };

  beforeEach(() => {
    mote = getMote();
    ledetekster = {};
  });

  it("Viser to InnholdsviserContainere", () => {
    component = shallow(
      <InformasjonSendt
        arbeidstaker={arbeidstaker}
        mote={mote}
        ledetekster={ledetekster}
      />
    );
    expect(component.find(InnholdsviserContainer)).to.have.length(2);
  });

  it("Viser to Utvidbar", () => {
    component = shallow(
      <InformasjonSendt
        arbeidstaker={arbeidstaker}
        mote={mote}
        ledetekster={ledetekster}
      />
    );
    expect(component.find(Utvidbar)).to.have.length(2);
  });

  it("Viser en InnholdsviserContainer", () => {
    arbeidstaker.kontaktinfo.skalHaVarsel = false;
    component = shallow(
      <InformasjonSendt
        arbeidstaker={arbeidstaker}
        mote={mote}
        ledetekster={ledetekster}
      />
    );
    expect(component.find(InnholdsviserContainer)).to.have.length(1);
  });

  it("Viser en Utvidbar", () => {
    arbeidstaker.kontaktinfo.skalHaVarsel = false;
    component = shallow(
      <InformasjonSendt
        arbeidstaker={arbeidstaker}
        mote={mote}
        ledetekster={ledetekster}
      />
    );
    expect(component.find(Utvidbar)).to.have.length(1);
  });
});
