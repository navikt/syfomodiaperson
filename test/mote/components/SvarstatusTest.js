import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Utvidbar } from "@navikt/digisyfo-npm";
import Svarstatus, {
  erSamtidig,
  getGamleAlternativer,
  getNyeAlternativer,
} from "../../../src/mote/components/Svarstatus";
import BesvarteTidspunkter from "../../../src/mote/components/BesvarteTidspunkter";
import { konverterTid } from "../../../src/utils/datoUtils";

describe("Svarstatus", () => {
  let mote;
  let motedata;

  beforeEach(() => {
    motedata = {
      id: 4,
      moteUuid: "0afd1d57-db90-4a9b-af97-cbf1055e6ffa",
      opprettetAv: "Z990322",
      status: "OPPRETTET",
      opprettetTidspunkt: "2017-03-28T09:46:37.677Z",
      navEnhet: "navEnhet",
      deltakere: [
        {
          hendelser: [
            {
              kanal: "EPOST",
              adresse: "arbe.idsgiver@nav.no",
              varseltype: "OPPRETTET",
              resultat: "OK",
            },
          ],
          deltakerUuid: "454a31c0-3691-40f4-9d9e-882ac1d5306e",
          navn: "Arbe Idsgiver",
          orgnummer: "012345678",
          epost: "arbe.idsgiver@nav.no",
          type: "arbeidsgiver",
          avvik: [],
          svar: [
            {
              id: 14003,
              tid: "2021-12-12T11:00:00Z",
              created: "2017-03-28T09:46:37.682Z",
              sted: "Oslo",
              valgt: false,
            },
            {
              id: 14004,
              tid: "2020-12-12T11:00:00Z",
              created: "2017-03-28T09:46:37.684Z",
              sted: "Oslo",
              valgt: false,
            },
          ],
        },
        {
          hendelser: [
            {
              kanal: "TLF",
              adresse: "12345678",
              varseltype: "OPPRETTET",
              resultat: "OK",
            },
            {
              kanal: "EPOST",
              adresse: "test@nav.no",
              varseltype: "OPPRETTET",
              resultat: "OK",
            },
          ],
          deltakerUuid: "0b118a5a-f866-432b-92cd-46a1dbbc7699",
          navn: "Ane Arbeidstaker",
          fnr: "88776655443",
          type: "Bruker",
          avvik: [],
          svar: [
            {
              id: 14003,
              tid: "2021-12-12T11:00:00Z",
              created: "2017-03-28T09:46:37.682Z",
              sted: "Oslo",
              valgt: false,
            },
            {
              id: 14004,
              tid: "2020-12-12T11:00:00Z",
              created: "2017-03-28T09:46:37.684Z",
              sted: "Oslo",
              valgt: false,
            },
          ],
        },
      ],
      alternativer: [
        {
          id: 14001,
          tid: "2021-10-12T11:00:00Z",
          created: "2017-03-28T09:46:37.682Z",
          sted: "Oslo",
          valgt: false,
        },
        {
          id: 14002,
          tid: "2021-09-12T11:00:00Z",
          created: "2017-03-28T09:46:37.682Z",
          sted: "Oslo",
          valgt: false,
        },
        {
          id: 14003,
          tid: "2021-07-12T11:00:00Z",
          created: "2017-04-28T09:46:37.682Z",
          sted: "Oslo",
          valgt: false,
        },
        {
          id: 14004,
          tid: "2021-12-12T11:00:00Z",
          created: "2017-04-28T09:46:37.682Z",
          sted: "Oslo",
          valgt: false,
        },
        {
          id: 14005,
          tid: "2020-11-12T11:00:00Z",
          created: "2017-05-28T09:46:37.682Z",
          sted: "Oslo",
          valgt: false,
        },
        {
          id: 14006,
          tid: "2020-12-12T11:00:00Z",
          created: "2017-05-28T09:46:37.684Z",
          sted: "Oslo",
          valgt: false,
        },
        {
          id: 14007,
          tid: "2020-10-12T11:00:00Z",
          created: "2017-05-28T09:46:37.686Z",
          sted: "Oslo",
          valgt: false,
        },
      ],
    };
    mote = konverterTid(motedata);
  });

  describe("erSamtidig", () => {
    it("Skal returnere true hvis to tidspunkt er like +/- 1000 ms", () => {
      const res = erSamtidig(
        new Date("2017-05-28T09:46:37.686Z"),
        new Date("2017-05-28T09:46:37.682Z")
      );
      expect(res).to.be.equal(true);
    });

    it("Skal returnere true hvis to tidspunkt er helt like +/- 1000 ms", () => {
      const res = erSamtidig(
        new Date("2017-05-28T09:46:37.686Z"),
        new Date("2017-05-28T09:46:37.686Z")
      );
      expect(res).to.be.equal(true);
    });

    it("Skal returnere false hvis to tidspunkt er ulike +/- 1000 ms", () => {
      const res = erSamtidig(
        new Date("2017-05-28T09:46:37.686Z"),
        new Date("2017-05-28T09:46:36.685Z")
      );
      expect(res).to.be.equal(false);
    });

    it("Skal returnere true hvis to tidspunkt er like +/- 1000 ms", () => {
      const res = erSamtidig(
        new Date("2017-05-28T09:46:37.686Z"),
        new Date("2017-05-28T09:46:36.687Z")
      );
      expect(res).to.be.equal(true);
    });
  });

  describe("getNyeAlternativer", () => {
    it("Skal returnere nye alternativer, sortert etter møtetidspunkt", () => {
      const res = getNyeAlternativer(mote);
      expect(res.length).to.equal(3);
      expect(res[0].id).to.equal(14007);
      expect(res[1].id).to.equal(14005);
      expect(res[2].id).to.equal(14006);
    });

    it("Skal returnere tom liste om mote mangler alternativer", () => {
      mote = {};
      const res = getNyeAlternativer(mote);
      expect(res).to.deep.equal([]);
    });
  });

  describe("getGamleAlternativer", () => {
    it("Skal returnere gamle alternativer, sortert etter tid", () => {
      const res = getGamleAlternativer(mote);
      expect(res.length).to.equal(4);
      expect(res[0].id).to.equal(14003);
      expect(res[3].id).to.equal(14004);
    });

    it("Skal returnere tom liste om mote mangler alternativer", () => {
      mote = {};
      const res = getNyeAlternativer(mote);
      expect(res).to.deep.equal([]);
    });
  });

  describe("Svarstatus", () => {
    const ledetekster = {
      "mote.bookingstatus.tidspunkt-foreslatt-tidligere.tittel":
        "Tidspunkt foreslått tidligere",
    };

    describe("Hvis møtet har både nye og gamle alternativer", () => {
      it("Skal inneholde to stk BesvarteTidspunkter", () => {
        const component = shallow(<Svarstatus mote={mote} />);
        expect(component.find(BesvarteTidspunkter)).to.have.length(2);
      });

      it("Skal inneholde en Utvidbar", () => {
        const component = shallow(
          <Svarstatus mote={mote} ledetekster={ledetekster} />
        );
        expect(component.find(Utvidbar)).to.have.length(1);
        expect(component.find(Utvidbar).prop("tittel")).to.equal(
          "Tidspunkt foreslått tidligere"
        );
      });
    });

    describe("Hvis møtet har kun nye alternativer", () => {
      let mote_;

      beforeEach(() => {
        mote_ = Object.assign({}, motedata, {
          alternativer: [
            {
              id: 14001,
              tid: "2021-10-12T11:00:00Z",
              created: "2017-03-28T09:46:37.682Z",
              sted: "Oslo",
              valgt: false,
            },
            {
              id: 14002,
              tid: "2021-09-12T11:00:00Z",
              created: "2017-03-28T09:46:37.685Z",
              sted: "Oslo",
              valgt: false,
            },
          ],
        });

        mote_ = konverterTid(mote_);
      });

      it("Skal inneholde 1 stk BesvarteTidspunkter", () => {
        const component = shallow(<Svarstatus mote={mote_} />);
        expect(component.find(BesvarteTidspunkter)).to.have.length(1);
      });

      it("Skal ikke inneholde en Utvidbar", () => {
        const component = shallow(
          <Svarstatus mote={mote_} ledetekster={ledetekster} />
        );
        expect(component.find(Utvidbar)).to.have.length(0);
      });
    });
  });
});
