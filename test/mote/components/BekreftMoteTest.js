import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";
import KnappBase from "nav-frontend-knapper";
import BekreftMoteSkjema, {
  InnholdsviserContainer,
  tekster as bekreftMoteTeskter,
} from "../../../src/mote/components/BekreftMoteSkjema";
import BekreftMoteUtenSvarSkjema, {
  tekster as bekreftMoteUtenSvarTekster,
} from "../../../src/mote/components/BekreftMoteUtenSvarSkjema";
import { ARBEIDSGIVER, BRUKER } from "../../../src/konstanter";
import Epostmottakere from "../../../src/mote/components/Epostmottakere";

const getMoteUtenSvar = (mote) => {
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

const getMoteMedSvar = (mote) => {
  return Object.assign(
    {},
    {
      status: "OPPRETTET",
      opprettetTidspunkt: new Date("2017-02-22T15:18:24.323"),
      bekreftetTidspunkt: new Date("2017-03-07T15:18:24.323"),
      deltakere: [
        {
          hendelser: [],
          deltakerUuid: "uuid1",
          navn: "Are Arbeidsgiver",
          orgnummer: "012345678",
          epost: "are.arbeidsgiver@nav.no",
          type: ARBEIDSGIVER,
          svartidspunkt: new Date("2017-03-07T15:18:24.323"),
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
              valgt: true,
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
          svartidspunkt: new Date("2017-03-07T15:18:24.323"),
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
              valgt: true,
            },
          ],
        },
      ],
      bekreftetAlternativ: 1,
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
          valgt: true,
        },
      ],
    },
    mote
  );
};

describe("BekreftMoteSkjemaComponent", () => {
  let component;
  let ledetekster;
  let mote;

  beforeEach(() => {
    mote = getMoteMedSvar();
    ledetekster = {
      "mote.bekreftmote.lightbox-overskrift": "Bekreft møteforespørsel",
    };
  });

  it("Viser tittel", () => {
    component = shallow(<BekreftMoteSkjema mote={mote} />);
    expect(component.text()).to.contain(
      bekreftMoteTeskter.mote.bekreftmote.lightboxOverskrift
    );
  });

  it("Viser mottakere det er to mottakere", () => {
    component = shallow(
      <BekreftMoteSkjema mote={mote} ledetekster={ledetekster} />
    );
    expect(component.find(Epostmottakere)).to.have.length(1);
    expect(component.find(Epostmottakere).prop("mote")).to.deep.equal(mote);
    expect(component.find(Epostmottakere).prop("ledetekster")).to.deep.equal(
      ledetekster
    );
  });

  it("Viser en InnholdsviserContainer", () => {
    component = shallow(
      <BekreftMoteSkjema mote={mote} ledetekster={ledetekster} />
    );
    expect(component.find(InnholdsviserContainer)).to.have.length(1);
  });
});

describe("BekreftMoteUtenSvarSkjemaComponent", () => {
  let component;
  let mote;
  let handleSubmit;

  beforeEach(() => {
    mote = getMoteUtenSvar();
    handleSubmit = sinon.spy();
  });

  it("Viser tittel", () => {
    component = shallow(<BekreftMoteUtenSvarSkjema mote={mote} />);
    expect(component.text()).to.contain(
      bekreftMoteUtenSvarTekster.mote.bekreftmoteutensvar.lightboxOverskrift
    );
  });

  it("Bekrefter at møte er avtalt på annen måte", () => {
    component = shallow(
      <BekreftMoteUtenSvarSkjema
        mote={mote}
        bekreftMoteUtenSvar={handleSubmit}
      />
    );
    component.find(KnappBase).simulate("click");
    expect(handleSubmit.calledOnce).to.be.equal(true);
  });
});
