import { expect } from "chai";
import deepFreeze from "deep-freeze";
import sinon from "sinon";
import moter from "../../../src/reducers/moter";
import * as actions from "../../../src/actions/moter_actions";

export const getMote = (mote) => {
  return Object.assign(
    {},
    {
      status: "OPPRETTET",
      moteUuid: "min-mote-uuid",
      opprettetTidspunkt: new Date("2017-02-22T15:18:24.000Z"),
      bekreftetTidspunkt: null,
      deltakere: [
        {
          hendelser: [],
          deltakerUuid: "uuid1",
          navn: "Are Arbeidsgiver",
          orgnummer: "012345678",
          epost: "are.arbeidsgiver@nav.no",
          type: "arbeidsgiver",
          svartidspunkt: null,
          svar: [
            {
              id: 1,
              tid: new Date("2017-03-07T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 3,
              tid: new Date("2017-02-25T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: new Date("2017-03-09T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
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
              tid: new Date("2017-03-07T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 3,
              tid: new Date("2017-02-25T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: new Date("2017-03-09T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
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
          tid: new Date("2017-03-07T15:18:24.000Z"),
          created: new Date("2017-02-22T15:18:24.000Z"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 3,
          tid: new Date("2017-02-25T15:18:24.000Z"),
          created: new Date("2017-02-22T15:18:24.000Z"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 2,
          tid: new Date("2017-02-25T15:18:24.000Z"),
          created: new Date("2017-02-22T15:18:24.000Z"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
      trengerBehandling: false,
    },
    mote
  );
};

describe("moter", () => {
  let clock;
  const today = new Date("2017-01-16");

  beforeEach(() => {
    clock = sinon.useFakeTimers(today.getTime()); // 16. januar 2017
  });

  afterEach(() => {
    clock.restore();
  });

  describe("OPPRETT MØTE", () => {
    it("Håndterer OPPRETTER_MOTE", () => {
      const initialState = deepFreeze({
        data: [],
      });
      const action = actions.oppretterMote();
      const nextState = moter(initialState, action);
      expect(nextState).to.deep.equal({
        data: [],
        sender: true,
        sendingFeilet: false,
        henter: false,
        hentingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    });

    it("Håndterer OPPRETT_MOTE_FEILET", () => {
      const initialState = deepFreeze({
        data: [],
      });
      const action = actions.opprettMoteFeilet();
      const nextState = moter(initialState, action);
      expect(nextState).to.deep.equal({
        data: [],
        sender: false,
        sendingFeilet: true,
        henter: false,
        hentingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    });
  });

  describe("HENT MØTER", () => {
    it("Håndterer HENTER_MOTER", () => {
      const initialState = deepFreeze({});
      const action = actions.henterMoter();
      const nextState = moter(initialState, action);
      expect(nextState).to.deep.equal({
        data: [],
        sender: false,
        henter: true,
        hentingFeilet: false,
        hentingForsokt: false,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    });

    it("Håndterer MOTER_HENTET", () => {
      const initialState = deepFreeze({
        data: [],
        henter: true,
      });
      const action = actions.moterHentet([
        {
          status: "OPPRETTET",
          opprettetTidspunkt: "2017-02-22T15:18:24.000Z",
          bekreftetTidspunkt: null,
          deltakere: [
            {
              hendelser: [],
              deltakerUuid: "uuid1",
              navn: "Are Arbeidsgiver",
              orgnummer: "012345678",
              epost: "are.arbeidsgiver@nav.no",
              type: "arbeidsgiver",
              svartidspunkt: "2017-03-07T15:18:24.000Z",
              svar: [
                {
                  id: 1,
                  tid: "2017-03-07T15:18:24.000Z",
                  created: "2017-02-22T15:18:24.000Z",
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 2,
                  tid: "2017-03-09T15:18:24.000Z",
                  created: "2017-02-22T15:18:24.000Z",
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
                  tid: "2017-03-07T15:18:24.000Z",
                  created: "2017-02-22T15:18:24.000Z",
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 2,
                  tid: "2017-03-09T15:18:24.000Z",
                  created: "2017-02-22T15:18:24.000Z",
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
              tid: "2017-03-07T15:18:24.000Z",
              created: "2017-02-22T15:18:24.000Z",
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: "2017-03-09T15:18:24.000Z",
              created: "2017-02-22T15:18:24.000Z",
              sted: "Testveien 2",
              valgt: false,
            },
          ],
        },
      ]);
      const nextState = moter(initialState, action);
      expect(nextState).to.deep.equal({
        data: [
          {
            status: "OPPRETTET",
            opprettetTidspunkt: new Date("2017-02-22T15:18:24.000Z"),
            bekreftetTidspunkt: null,
            deltakere: [
              {
                hendelser: [],
                deltakerUuid: "uuid1",
                navn: "Are Arbeidsgiver",
                orgnummer: "012345678",
                epost: "are.arbeidsgiver@nav.no",
                type: "arbeidsgiver",
                svartidspunkt: new Date("2017-03-07T15:18:24.000Z"),
                svar: [
                  {
                    id: 1,
                    tid: new Date("2017-03-07T15:18:24.000Z"),
                    created: new Date("2017-02-22T15:18:24.000Z"),
                    sted: "Testveien 2",
                    valgt: false,
                  },
                  {
                    id: 2,
                    tid: new Date("2017-03-09T15:18:24.000Z"),
                    created: new Date("2017-02-22T15:18:24.000Z"),
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
                    tid: new Date("2017-03-07T15:18:24.000Z"),
                    created: new Date("2017-02-22T15:18:24.000Z"),
                    sted: "Testveien 2",
                    valgt: false,
                  },
                  {
                    id: 2,
                    tid: new Date("2017-03-09T15:18:24.000Z"),
                    created: new Date("2017-02-22T15:18:24.000Z"),
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
                tid: new Date("2017-03-07T15:18:24.000Z"),
                created: new Date("2017-02-22T15:18:24.000Z"),
                sted: "Testveien 2",
                valgt: false,
              },
              {
                id: 2,
                tid: new Date("2017-03-09T15:18:24.000Z"),
                created: new Date("2017-02-22T15:18:24.000Z"),
                sted: "Testveien 2",
                valgt: false,
              },
            ],
          },
        ],
        henter: false,
        hentingFeilet: false,
        hentingForsokt: true,
        sender: false,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    });

    it("Håndterer MOTER_HENTET ved bekreftet møte", () => {
      const initialState = deepFreeze({
        data: [],
        henter: true,
      });
      const action = actions.moterHentet([
        {
          status: "BEKREFTET",
          opprettetTidspunkt: "2017-02-22T15:18:24.000Z",
          bekreftetTidspunkt: "2017-02-25T15:18:24.000Z",
          deltakere: [
            {
              hendelser: [],
              deltakerUuid: "uuid1",
              navn: "Are Arbeidsgiver",
              orgnummer: "012345678",
              epost: "are.arbeidsgiver@nav.no",
              type: "arbeidsgiver",
              svartidspunkt: "2017-03-07T15:18:24.000Z",
              svar: [
                {
                  id: 1,
                  tid: "2017-03-07T15:18:24.000Z",
                  created: "2017-02-22T15:18:24.000Z",
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 2,
                  tid: "2017-03-09T15:18:24.000Z",
                  created: "2017-02-22T15:18:24.000Z",
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
                  tid: "2017-03-07T15:18:24.000Z",
                  created: "2017-02-22T15:18:24.000Z",
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 2,
                  tid: "2017-03-09T15:18:24.000Z",
                  created: "2017-02-22T15:18:24.000Z",
                  sted: "Testveien 2",
                  valgt: false,
                },
              ],
            },
          ],
          bekreftetAlternativ: {
            id: 1,
            tid: "2017-03-07T15:18:24.000Z",
            created: "2017-02-22T15:18:24.000Z",
            sted: "Testveien 2",
            valgt: false,
          },
          alternativer: [
            {
              id: 1,
              tid: "2017-03-07T15:18:24.000Z",
              created: "2017-02-22T15:18:24.000Z",
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: "2017-03-09T15:18:24.000Z",
              created: "2017-02-22T15:18:24.000Z",
              sted: "Testveien 2",
              valgt: false,
            },
          ],
        },
      ]);
      const nextState = moter(initialState, action);
      expect(nextState).to.deep.equal({
        data: [
          {
            status: "BEKREFTET",
            opprettetTidspunkt: new Date("2017-02-22T15:18:24.000Z"),
            bekreftetTidspunkt: new Date("2017-02-25T15:18:24.000Z"),
            deltakere: [
              {
                hendelser: [],
                deltakerUuid: "uuid1",
                navn: "Are Arbeidsgiver",
                orgnummer: "012345678",
                epost: "are.arbeidsgiver@nav.no",
                type: "arbeidsgiver",
                svartidspunkt: new Date("2017-03-07T15:18:24.000Z"),
                svar: [
                  {
                    id: 1,
                    tid: new Date("2017-03-07T15:18:24.000Z"),
                    created: new Date("2017-02-22T15:18:24.000Z"),
                    sted: "Testveien 2",
                    valgt: false,
                  },
                  {
                    id: 2,
                    tid: new Date("2017-03-09T15:18:24.000Z"),
                    created: new Date("2017-02-22T15:18:24.000Z"),
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
                    tid: new Date("2017-03-07T15:18:24.000Z"),
                    created: new Date("2017-02-22T15:18:24.000Z"),
                    sted: "Testveien 2",
                    valgt: false,
                  },
                  {
                    id: 2,
                    tid: new Date("2017-03-09T15:18:24.000Z"),
                    created: new Date("2017-02-22T15:18:24.000Z"),
                    sted: "Testveien 2",
                    valgt: false,
                  },
                ],
              },
            ],
            bekreftetAlternativ: {
              id: 1,
              tid: new Date("2017-03-07T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
              sted: "Testveien 2",
              valgt: false,
            },
            alternativer: [
              {
                id: 1,
                tid: new Date("2017-03-07T15:18:24.000Z"),
                created: new Date("2017-02-22T15:18:24.000Z"),
                sted: "Testveien 2",
                valgt: false,
              },
              {
                id: 2,
                tid: new Date("2017-03-09T15:18:24.000Z"),
                created: new Date("2017-02-22T15:18:24.000Z"),
                sted: "Testveien 2",
                valgt: false,
              },
            ],
          },
        ],
        henter: false,
        hentingFeilet: false,
        hentingForsokt: true,
        sender: false,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    });

    it("Håndterer HENT_MOTER_FEILET", () => {
      const initialState = deepFreeze({});
      const action = actions.hentMoterFeilet();
      const nextState = moter(initialState, action);
      expect(nextState).to.deep.equal({
        data: [],
        henter: false,
        hentingFeilet: true,
        hentingForsokt: true,
        sender: false,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    });
  });

  describe("AVBRYT MØTE", () => {
    it("Håndterer AVBRYTER_MOTE", () => {
      const initialState = deepFreeze({
        data: [
          {
            id: 0,
            moteUuid: "b23ee185-cd29-41cb-a109-48d7aad15dc3",
            opprettetAv: "testNAVRessurs",
            opprettetTidspunkt: "2016-11-03T13:28:05.244",
            navEnhet: "navEnhet",
            deltakere: [
              {
                deltakerUuid: "944c877e-e261-49a4-841e-2ab52349e864",
                navn: "Arve Arbeidsgiver",
                epost: "arve.arbeidsgiver@nav.no",
                type: "arbeidsgiver",
                avvik: [],
                svar: [
                  {
                    tid: "2012-12-12T11:00:00Z",
                    sted: "Oslo by",
                    valgt: false,
                  },
                  {
                    tid: "2009-09-09T07:00:00Z",
                    sted: "Oslo by",
                    valgt: false,
                  },
                ],
              },
            ],
            alternativer: [
              {
                tid: "2012-12-12T11:00:00Z",
                sted: "Oslo by",
                valgt: false,
              },
              {
                tid: "2009-09-09T07:00:00Z",
                sted: "Oslo by",
                valgt: false,
              },
            ],
          },
        ],
      });
      const action = actions.avbryterMote(
        "b23ee185-cd29-41cb-a109-48d7aad15dc3"
      );
      const nextState = moter(initialState, action);
      expect(nextState.avbryter).to.equal(true);
      expect(nextState.avbrytFeilet).to.equal(false);
    });

    it("Håndterer MOTE_AVBRUTT", () => {
      const initialState = deepFreeze({
        data: [
          {
            id: 0,
            moteUuid: "b23ee185-cd29-41cb-a109-48d7aad15dc3",
            opprettetAv: "testNAVRessurs",
            opprettetTidspunkt: "2016-11-03T13:28:05.244",
            navEnhet: "navEnhet",
            deltakere: [
              {
                deltakerUuid: "944c877e-e261-49a4-841e-2ab52349e864",
                navn: "Arve Arbeidsgiver",
                epost: "arve.arbeidsgiver@nav.no",
                type: "arbeidsgiver",
                avvik: [],
                svar: [
                  {
                    tid: "2012-12-12T11:00:00Z",
                    sted: "Oslo by",
                    valgt: false,
                  },
                  {
                    tid: "2009-09-09T07:00:00Z",
                    sted: "Oslo by",
                    valgt: false,
                  },
                ],
              },
            ],
            alternativer: [
              {
                tid: "2012-12-12T11:00:00Z",
                sted: "Oslo by",
                valgt: false,
              },
              {
                tid: "2009-09-09T07:00:00Z",
                sted: "Oslo by",
                valgt: false,
              },
            ],
          },
        ],
      });
      const action = actions.moteAvbrutt(
        "b23ee185-cd29-41cb-a109-48d7aad15dc3"
      );
      const nextState = moter(initialState, action);
      expect(nextState.data[0].status).to.equal("AVBRUTT");
      expect(nextState.avbrytFeilet).to.equal(false);
      expect(nextState.avbryter).to.equal(false);
    });

    it("Håndterer AVBRYT_MOTE_FEILET", () => {
      const initialState = deepFreeze({
        data: [{}],
      });
      const action = actions.avbrytMoteFeilet();
      const nextState = moter(initialState, action);
      expect(nextState.avbrytFeilet).to.equal(true);
      expect(nextState.avbryter).to.equal(false);
    });
  });

  describe("BEKREFT MØTE", () => {
    let initialState;

    beforeEach(() => {
      initialState = deepFreeze({
        data: [
          {
            foo: "bar",
          },
          {
            id: 0,
            status: "OPPRETTET",
            moteUuid: "b23ee185-cd29-41cb-a109-48d7aad15dc3",
            opprettetAv: "testNAVRessurs",
            opprettetTidspunkt: "2016-11-03T13:28:05.244",
            navEnhet: "navEnhet",
            deltakere: [
              {
                deltakerUuid: "944c877e-e261-49a4-841e-2ab52349e864",
                navn: "Arve Arbeidsgiver",
                epost: "arve.arbeidsgiver@nav.no",
                type: "arbeidsgiver",
                avvik: [],
                svar: [
                  {
                    tid: "2012-12-12T11:00:00Z",
                    sted: "Oslo by",
                    valgt: false,
                    id: 6,
                  },
                  {
                    tid: "2009-09-09T07:00:00Z",
                    sted: "Oslo by",
                    valgt: false,
                    id: 7,
                  },
                ],
              },
            ],
            alternativer: [
              {
                id: 6,
                tid: "2012-12-12T11:00:00Z",
                sted: "Oslo by",
                valgt: false,
              },
              {
                id: 7,
                tid: "2009-09-09T07:00:00Z",
                sted: "Oslo by",
                valgt: false,
              },
            ],
          },
        ],
      });
    });

    it("Håndterer BEKREFTER_MOTE", () => {
      const action = actions.bekrefterMote();
      const nextState = moter(initialState, action);
      expect(nextState.data).to.deep.equal(initialState.data);
      expect(nextState.bekrefter).to.be.equal(true);
      expect(nextState.bekreftFeilet).to.be.equal(false);
      expect(nextState.avbryter).to.be.equal(false);
      expect(nextState.avbrytFeilet).to.be.equal(false);
    });

    it("Håndterer MOTE_BEKREFTET", () => {
      const action = actions.moteBekreftet(
        "b23ee185-cd29-41cb-a109-48d7aad15dc3",
        6,
        "2016-11-03T13:28:05.244"
      );
      const nextState = moter(initialState, action);
      expect(nextState.avbryter).to.be.equal(false);
      expect(nextState.avbrytFeilet).to.be.equal(false);
      expect(nextState.data).to.deep.equal([
        {
          foo: "bar",
        },
        {
          id: 0,
          status: "BEKREFTET",
          moteUuid: "b23ee185-cd29-41cb-a109-48d7aad15dc3",
          opprettetAv: "testNAVRessurs",
          opprettetTidspunkt: "2016-11-03T13:28:05.244",
          navEnhet: "navEnhet",
          bekreftetTidspunkt: new Date("2016-11-03T13:28:05.244"),
          deltakere: [
            {
              deltakerUuid: "944c877e-e261-49a4-841e-2ab52349e864",
              navn: "Arve Arbeidsgiver",
              epost: "arve.arbeidsgiver@nav.no",
              type: "arbeidsgiver",
              avvik: [],
              svar: [
                {
                  tid: "2012-12-12T11:00:00Z",
                  sted: "Oslo by",
                  valgt: false,
                  id: 6,
                },
                {
                  tid: "2009-09-09T07:00:00Z",
                  sted: "Oslo by",
                  valgt: false,
                  id: 7,
                },
              ],
            },
          ],
          bekreftetAlternativ: {
            id: 6,
            tid: "2012-12-12T11:00:00Z",
            sted: "Oslo by",
            valgt: false,
          },
          alternativer: [
            {
              id: 6,
              tid: "2012-12-12T11:00:00Z",
              sted: "Oslo by",
              valgt: false,
            },
            {
              id: 7,
              tid: "2009-09-09T07:00:00Z",
              sted: "Oslo by",
              valgt: false,
            },
          ],
        },
      ]);
    });

    it("Håndterer bekreftMoteFeilet()", () => {
      const action = actions.bekreftMoteFeilet();
      const nextState = moter(initialState, action);
      expect(nextState.bekrefter).to.be.equal(false);
      expect(nextState.bekreftFeilet).to.be.equal(true);
    });

    it("Håndterer bekreftMote()", () => {
      const action = actions.bekreftMote(
        "b23ee185-cd29-41cb-a109-48d7aad15dc3",
        6
      );
      const nextState = moter(initialState, action);
      expect(nextState).to.deep.equal(initialState);
    });
  });

  describe("FLERE ALTERNATIVER", () => {
    let mote;

    beforeEach(() => {
      mote = getMote();
    });

    it("Håndterer opprettFlereAlternativBekreftet", () => {
      const initialState = deepFreeze({
        data: [mote],
      });
      const data = [
        {
          tid: "2017-03-09T10:00:00.000",
          sted: "Testveien 2",
          valgt: false,
        },
        {
          tid: "2017-03-10T10:00:00.000",
          sted: "Testveien 2",
          valgt: false,
        },
      ];
      const action = actions.opprettFlereAlternativBekreftet(
        data,
        "min-mote-uuid"
      );
      const nextState = moter(initialState, action);

      expect(nextState.nyeAlternativFeilet).to.be.equal(false);
      expect(nextState.senderNyeAlternativ).to.be.equal(false);
      expect(nextState.data).to.deep.equal([
        {
          status: "OPPRETTET",
          moteUuid: "min-mote-uuid",
          opprettetTidspunkt: new Date("2017-02-22T15:18:24.000Z"),
          bekreftetTidspunkt: null,
          deltakere: [
            {
              hendelser: [],
              deltakerUuid: "uuid1",
              navn: "Are Arbeidsgiver",
              orgnummer: "012345678",
              epost: "are.arbeidsgiver@nav.no",
              type: "arbeidsgiver",
              svartidspunkt: null,
              svar: [
                {
                  id: 1,
                  tid: new Date("2017-03-07T15:18:24.000Z"),
                  created: new Date("2017-02-22T15:18:24.000Z"),
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 2,
                  tid: new Date("2017-03-09T15:18:24.000Z"),
                  created: new Date("2017-02-22T15:18:24.000Z"),
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 3,
                  tid: new Date("2017-02-25T15:18:24.000Z"),
                  created: new Date("2017-02-22T15:18:24.000Z"),
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 4,
                  tid: new Date("2017-03-09T10:00:00.000"),
                  created: new Date(),
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 5,
                  tid: new Date("2017-03-10T10:00:00.000"),
                  created: new Date(),
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
                  tid: new Date("2017-03-07T15:18:24.000Z"),
                  created: new Date("2017-02-22T15:18:24.000Z"),
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 2,
                  tid: new Date("2017-03-09T15:18:24.000Z"),
                  created: new Date("2017-02-22T15:18:24.000Z"),
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 3,
                  tid: new Date("2017-02-25T15:18:24.000Z"),
                  created: new Date("2017-02-22T15:18:24.000Z"),
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 4,
                  tid: new Date("2017-03-09T10:00:00.000"),
                  created: new Date(),
                  sted: "Testveien 2",
                  valgt: false,
                },
                {
                  id: 5,
                  tid: new Date("2017-03-10T10:00:00.000"),
                  created: new Date(),
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
              tid: new Date("2017-03-07T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: new Date("2017-02-25T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 3,
              tid: new Date("2017-02-25T15:18:24.000Z"),
              created: new Date("2017-02-22T15:18:24.000Z"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 4,
              tid: new Date("2017-03-09T10:00:00.000"),
              created: new Date(),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 5,
              tid: new Date("2017-03-10T10:00:00.000"),
              created: new Date(),
              sted: "Testveien 2",
              valgt: false,
            },
          ],
          trengerBehandling: false,
        },
      ]);
    });
  });
});
