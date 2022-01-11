import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import {
  BekreftMoteSide,
  mapStateToProps,
} from "@/components/mote/container/BekreftMoteContainer";

describe("BekreftMoteContainer", () => {
  describe("BekreftMoteSide", () => {
    let hentMoter;
    let bekreftMote;
    let deltaker;
    let compo;

    beforeEach(() => {
      hentMoter = sinon.spy();
      bekreftMote = sinon.spy();
      deltaker = {
        deltakerUuid: "123",
      };
    });

    it("Skal ha en onSubmit-funksjon som kaller på bekreftMote() med riktige argumenter", () => {
      const mote = {
        moteUuid: "Olsen",
        deltakere: [
          {
            type: "Bruker",
          },
          {
            type: "arbeidsgiver",
            deltakerUuid: "uuid1",
          },
        ],
      };
      const alternativ = {
        id: 4545,
      };
      compo = shallow(
        <BekreftMoteSide
          fnr="44556677889"
          hentBekreftMoteEpostinnhold={() => {
            /* Do nothing */
          }}
          bekreftMote={bekreftMote}
          alternativ={alternativ}
          mote={mote}
          arbeidsgiver={deltaker}
        />
      );
      compo.instance().onSubmit();
      expect(bekreftMote.getCall(0).args).to.deep.equal([
        "Olsen",
        4545,
        "44556677889",
      ]);
    });

    describe("Dersom alternativ ikke finnes", () => {
      beforeEach(() => {
        compo = shallow(
          <BekreftMoteSide
            hentMoter={hentMoter}
            deltaker={deltaker}
            fnr="5566"
          />
        );
      });

      it("Skal hente møter", () => {
        expect(hentMoter.calledWith("5566")).to.be.equal(true);
      });
    });

    describe("Når alternativ finnes", () => {
      let mote;
      let alternativ;
      let hentBekreftMoteEpostinnhold;

      beforeEach(() => {
        alternativ = {
          id: 328,
          tid: "2020-12-12T11:00:00Z",
          sted: "Oslo ",
          valgt: false,
        };
        mote = {
          moteUuid: "123",
          status: "OPPRETTET",
          deltakere: [
            {
              type: "Bruker",
            },
            {
              type: "arbeidsgiver",
              deltakerUuid: "uuid",
            },
          ],
        };
        hentBekreftMoteEpostinnhold = sinon.spy();
        compo = shallow(
          <BekreftMoteSide
            hentBekreftMoteEpostinnhold={hentBekreftMoteEpostinnhold}
            hentMoter={hentMoter}
            alternativ={alternativ}
            mote={mote}
            deltaker={deltaker}
          />
        );
      });

      it("Skal ikke hente møter", () => {
        expect(hentMoter.called).to.be.equal(false);
      });
    });
  });

  describe("mapStateToProps", () => {
    let ownProps;
    let state;

    beforeEach(() => {
      ownProps = {
        match: {
          params: {
            alternativId: "328",
          },
        },
      };
      state = {
        valgtbruker: {
          personident: "123",
        },
        epostinnhold: { henter: false, data: {} },
        moter: {
          data: [
            {
              id: 1,
              moteUuid: "2fedc0da-efec-4b6e-8597-a021628058ae",
              opprettetAv: "Z990562",
              status: "OPPRETTET",
              opprettetTidspunkt: "2016-11-21T11:35:51.870Z",
              navEnhet: "navEnhet",
              deltakere: [
                {
                  deltakerUuid: "85a12263-d955-4103-b172-bf135df5f37a",
                  navn: "Arve Arbeidsgiver",
                  epost: "arve.arbeidsgiver@nav.no",
                  type: "arbeidsgiver",
                  avvik: [],
                  svar: [
                    {
                      id: 328,
                      tid: "2020-12-12T11:00:00Z",
                      sted: "Oslo ",
                      valgt: false,
                    },
                    {
                      id: 329,
                      tid: "2020-09-09T07:00:00Z",
                      sted: "Oslo ",
                      valgt: false,
                    },
                  ],
                },
                {
                  deltakerUuid: "85a12263-d955-4103-b172-bf135df5f37b",
                  navn: "Andreas Arbeidstaker",
                  epost: "andreas.arbeidstaker@nav.no",
                  type: "Bruker",
                  avvik: [],
                  svar: [
                    {
                      id: 330,
                      tid: "2020-12-12T11:00:00Z",
                      sted: "Oslo ",
                      valgt: false,
                    },
                    {
                      id: 331,
                      tid: "2020-09-09T07:00:00Z",
                      sted: "Oslo ",
                      valgt: false,
                    },
                  ],
                },
              ],
              alternativer: [
                {
                  id: 328,
                  tid: "2020-12-12T11:00:00Z",
                  sted: "Oslo ",
                  valgt: false,
                },
                {
                  id: 329,
                  tid: "2020-09-09T07:00:00Z",
                  sted: "Oslo ",
                  valgt: false,
                },
              ],
            },
          ],
        },
        navbruker: {
          data: {
            fnr: "123",
          },
        },
      };
    });

    it("Skal returnere mote", () => {
      const props = mapStateToProps(state, ownProps);
      expect(props.mote.moteUuid).to.equal(
        "2fedc0da-efec-4b6e-8597-a021628058ae"
      );
    });

    it('Skal returnere mote når mote.status === "BEKREFTET"', () => {
      state.moter.data[0].status = "BEKREFTET";
      const props = mapStateToProps(state, ownProps);
      expect(props.mote.moteUuid).to.equal(
        "2fedc0da-efec-4b6e-8597-a021628058ae"
      );
    });

    it("Skal returnere fnr", () => {
      const props = mapStateToProps(state, ownProps);
      expect(props.fnr).to.equal("123");
    });

    it("Skal returnere alternativ", () => {
      const props = mapStateToProps(state, ownProps);
      expect(props.alternativ).to.deep.equal({
        id: 328,
        tid: "2020-12-12T11:00:00Z",
        sted: "Oslo ",
        valgt: false,
      });
    });

    it("Skal returnere henterMoterBool når det hentes møter", () => {
      state.moter.henter = true;
      const props = mapStateToProps(state, ownProps);
      expect(props.henterMoterBool).to.be.equal(true);
    });
  });
});
