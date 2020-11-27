import { expect } from "chai";
import { put, call } from "redux-saga/effects";
import sinon from "sinon";
import { post, get } from "../../../src/api";
import {
  opprettMote,
  hentMoter,
  avbrytMote,
  bekreftMote,
  opprettFlereAlternativ,
} from "../../../src/sagas/moterSagas";
import * as actions from "../../../src/actions/moter_actions";

describe("moterSagas", () => {
  beforeEach(() => {
    process.env = {
      REACT_APP_REST_ROOT: "/sykefravaer",
      REACT_APP_MOTEADMIN_REST_ROOT: "/moteadmin",
    };
  });

  describe("opprettMote", () => {
    const generator = opprettMote({
      data: {
        fnr: "55",
        naermesteLederNavn: "Test Bestesen",
      },
    });

    it("Skal dispatche OPPRETTER_MOTE", () => {
      const nextPut = put({ type: "OPPRETTER_MOTE" });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal poste møtet til REST-tjenesten", () => {
      const nextCall = call(post, "/moteadmin/internad/moter", {
        fnr: "55",
        naermesteLederNavn: "Test Bestesen",
      });
      expect(generator.next().value).to.deep.equal(nextCall);
    });
  });

  describe("hentMoter", () => {
    const generator = hentMoter({
      fnr: "123",
    });

    it("Skal dispatche HENTER_MOTER", () => {
      const nextPut = put({ type: "HENTER_MOTER" });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal hente et array bestående av ett møte fra REST-tjenesten", () => {
      const nextCall = call(
        get,
        "/moteadmin/internad/moter?fnr=123&henttpsdata=true&limit=1"
      );
      expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dispatche MOTER_HENTET", () => {
      const nextPut = put({
        type: "MOTER_HENTET",
        data: [{ id: 1 }],
      });
      expect(generator.next([{ id: 1 }]).value).to.deep.equal(nextPut);
    });
  });

  describe("avbrytMote", () => {
    const action = actions.avbrytMote("min-fine-mote-uuid");
    const generator = avbrytMote(action);

    it("Skal dispatche AVBRYTER_MOTE", () => {
      const nextPut = put({
        type: "AVBRYTER_MOTE",
        uuid: "min-fine-mote-uuid",
      });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal poste til REST-tjenesten", () => {
      const nextCall = call(
        post,
        "/moteadmin/internad/moter/min-fine-mote-uuid/avbryt?varsle=true"
      );
      expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dispatche MOTE_AVBRUTT", () => {
      const nextPut = put({
        type: "MOTE_AVBRUTT",
        uuid: "min-fine-mote-uuid",
      });
      expect(generator.next().value).to.deep.equal(nextPut);
    });
  });

  describe("avbrytMoteUtenVarsel", () => {
    const action = actions.avbrytMoteUtenVarsel("min-fine-mote-uuid", "887766");
    const generator = avbrytMote(action);

    it("Skal dispatche AVBRYTER_MOTE", () => {
      const nextPut = put({
        type: "AVBRYTER_MOTE",
        uuid: "min-fine-mote-uuid",
      });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal poste til REST-tjenesten", () => {
      const nextCall = call(
        post,
        "/moteadmin/internad/moter/min-fine-mote-uuid/avbryt?varsle=false"
      );
      expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dispatche MOTE_AVBRUTT", () => {
      const nextPut = put({
        type: "MOTE_AVBRUTT",
        uuid: "min-fine-mote-uuid",
      });
      expect(generator.next().value).to.deep.equal(nextPut);
    });
  });

  describe("opprettFlereAlternativ", () => {
    const data = [
      {
        tid: "2017-03-30T10:00:00.000Z",
        sted: "Oslo",
        valgt: false,
      },
      {
        tid: "2017-03-31T08:00:00.000Z",
        sted: "Oslo",
        valgt: false,
      },
    ];
    let action = actions.opprettFlereAlternativ(
      data,
      "min-fine-mote-uuid",
      "fnr"
    );
    const generator = opprettFlereAlternativ(action);

    it("Skal dispatche OPPRETTER_FLERE_ALTERNATIV", () => {
      action = actions.oppretterFlereAlternativ();
      const nextPut = put(action);
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal poste til REST-tjenesten", () => {
      const nextCall = call(
        post,
        "/moteadmin/internad/moter/min-fine-mote-uuid/nyealternativer",
        data
      );
      expect(generator.next().value).to.deep.equal(nextCall);
    });
  });

  describe("bekreftMote", () => {
    const action = actions.bekreftMote("olsen", 998877);

    const generator = bekreftMote(action);

    it("Skal dispatche BEKREFTER_MOTE", () => {
      const nextPut = put({ type: "BEKREFTER_MOTE" });
      expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal poste til REST-tjenesten", () => {
      const nextCall = call(
        post,
        "/moteadmin/internad/moter/olsen/bekreft?valgtAlternativId=998877"
      );
      expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dispatche MOTE_BEKREFTET", () => {
      const date = new Date(2017, 3, 1);
      const clock = sinon.useFakeTimers(date.getTime());
      const nextPut = put({
        type: "MOTE_BEKREFTET",
        moteUuid: "olsen",
        valgtAlternativId: 998877,
        bekreftetTidspunkt: date,
      });
      expect(generator.next().value).to.deep.equal(nextPut);
      clock.restore();
    });
  });
});
