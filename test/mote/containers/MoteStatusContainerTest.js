import { expect } from "chai";
import { mapStateToProps } from "../../../src/containers/MotestatusContainer";

describe("MotestatusContainerTest", () => {
  describe("mapStateToProps", () => {
    let state;
    let ownProps;

    beforeEach(() => {
      ownProps = {
        moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
        fnr: "123456",
      };
      state = {
        ledetekster: { henter: false, data: {} },
        moter: {
          data: [
            {
              moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
              status: "OPPRETTET",
              deltakere: [],
              alternativer: [],
            },
            {
              moteUuid: "test",
              status: "AVBRUTT",
              deltakere: [],
              alternativer: [],
            },
          ],
        },
        navbruker: {
          data: {
            fnr: "123456",
            kontaktinfo: {
              skalHaVarsel: true,
            },
          },
        },
        virksomhet: {
          navn: "BEKK",
        },
      };
    });

    it("Skal returnere fnr", () => {
      const props = mapStateToProps(state, ownProps);
      expect(props.fnr).to.equal("123456");
    });

    it("Skal returnere møte", () => {
      ownProps = {
        moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
        fnr: "123456",
      };
      const props = mapStateToProps(state, ownProps);
      expect(props.mote).to.deep.equal({
        moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
        status: "OPPRETTET",
        deltakere: [],
        alternativer: [],
      });
    });

    it("Skal returnere avbryter", () => {
      state.moter.avbryter = true;
      const props = mapStateToProps(state, ownProps);
      expect(props.avbryter).to.be.equal(true);
    });

    it("Skal returnere avbrytFeilet", () => {
      state.moter.avbrytFeilet = true;
      const props = mapStateToProps(state, ownProps);
      expect(props.avbrytFeilet).to.be.equal(true);
    });

    it("Skal returnere henter", () => {
      state.moter.henter = true;
      const props = mapStateToProps(state, ownProps);
      expect(props.henter).to.be.equal(true);
    });

    it("Skal ikke filtrere bort reservert bruker dersom brukeren har svart", () => {
      state.moter.data = [
        {
          moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
          status: "OPPRETTET",
          deltakere: [
            {
              svartidspunkt: "2011-12-12T11:00:00Z",
              type: "Bruker",
              hendelser: [
                {
                  resultat: "RESERVERT",
                  varseltype: "OPPRETTET",
                },
              ],
              svar: [],
            },
          ],
          alternativer: [],
        },
      ];
      const props = mapStateToProps(state, ownProps);
      expect(props.mote).to.deep.equal({
        moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
        status: "OPPRETTET",
        deltakere: [
          {
            type: "Bruker",
            hendelser: [
              {
                resultat: "RESERVERT",
                varseltype: "OPPRETTET",
              },
            ],
            svartidspunkt: "2011-12-12T11:00:00Z",
            svar: [],
          },
        ],
        alternativer: [],
      });
    });

    it("Sorterer deltakere etter type", () => {
      state.moter.data = [
        {
          moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
          status: "OPPRETTET",
          deltakere: [
            {
              svartidspunkt: "2011-12-12T11:00:00Z",
              type: "Bruker",
              svar: [],
            },
            {
              svartidspunkt: "2011-12-12T11:00:00Z",
              type: "arbeidsgiver",
              svar: [],
            },
            {
              svartidspunkt: "2011-12-12T11:00:00Z",
              type: "testtype",
              svar: [],
            },
          ],
          alternativer: [],
        },
      ];
      const props = mapStateToProps(state, ownProps);
      expect(props.mote).to.deep.equal({
        moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
        status: "OPPRETTET",
        deltakere: [
          {
            svartidspunkt: "2011-12-12T11:00:00Z",
            type: "testtype",
            svar: [],
          },
          {
            type: "Bruker",
            svartidspunkt: "2011-12-12T11:00:00Z",
            svar: [],
          },
          {
            svartidspunkt: "2011-12-12T11:00:00Z",
            type: "arbeidsgiver",
            svar: [],
          },
        ],
        alternativer: [],
      });
    });

    it("Sorterer svar OG alternativer etter tidspunkt", () => {
      state.moter.data = [
        {
          moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
          status: "OPPRETTET",
          deltakere: [
            {
              svartidspunkt: "2011-12-12T11:00:00Z",
              type: "arbeidsgiver",
              svar: [
                {
                  id: 1,
                  tid: "2012-12-12T11:00:00Z",
                },
                {
                  id: 2,
                  tid: "2013-12-12T11:00:00Z",
                },
                {
                  id: 3,
                  tid: "2011-12-12T11:00:00Z",
                },
              ],
            },
          ],
          alternativer: [
            {
              id: 1,
              tid: "2012-12-12T11:00:00Z",
            },
            {
              id: 2,
              tid: "2013-12-12T11:00:00Z",
            },
            {
              id: 3,
              tid: "2011-12-12T11:00:00Z",
            },
          ],
        },
      ];
      const props = mapStateToProps(state, ownProps);
      expect(props.mote).to.deep.equal({
        moteUuid: "dced4bbd-13a6-4c5b-81f4-e04390b8c986",
        status: "OPPRETTET",
        deltakere: [
          {
            svartidspunkt: "2011-12-12T11:00:00Z",
            type: "arbeidsgiver",
            svar: [
              {
                id: 3,
                tid: "2011-12-12T11:00:00Z",
              },
              {
                id: 1,
                tid: "2012-12-12T11:00:00Z",
              },
              {
                id: 2,
                tid: "2013-12-12T11:00:00Z",
              },
            ],
          },
        ],
        alternativer: [
          {
            id: 3,
            tid: "2011-12-12T11:00:00Z",
          },
          {
            id: 1,
            tid: "2012-12-12T11:00:00Z",
          },
          {
            id: 2,
            tid: "2013-12-12T11:00:00Z",
          },
        ],
      });
    });
  });
});
