import { expect } from "chai";
import * as actions from "../../../src/data/mote/moter_actions";

describe("moter_actions", () => {
  it("Skal ha en hentMoter()-funksjon som returnerer riktig action", () => {
    const action = actions.hentMoter("123");
    expect(action).to.deep.equal({
      type: actions.HENT_MOTER_FORESPURT,
      fnr: "123",
    });
  });

  it("Skal ha en avbrytMote()-funksjon som returnerer riktig action", () => {
    const action = actions.avbrytMote("fiskekake", "123");
    expect(action).to.deep.equal({
      type: actions.AVBRYT_MOTE_FORESPURT,
      uuid: "fiskekake",
      fnr: "123",
      varsle: true,
    });
  });

  it("Skal ha en avbrytMoteUtenVarsel()-funksjon som returnerer riktig action", () => {
    const action = actions.avbrytMoteUtenVarsel("fiskekake", "123");
    expect(action).to.deep.equal({
      type: actions.AVBRYT_MOTE_FORESPURT,
      uuid: "fiskekake",
      fnr: "123",
      varsle: false,
    });
  });

  it("Skal ha en bekreftMote()-funksjon som rturnerer riktig action", () => {
    const action = actions.bekreftMote(
      "moteUuid",
      "valgtAlternativId",
      "998877"
    );
    expect(action).to.deep.equal({
      type: actions.BEKREFT_MOTE_FORESPURT,
      moteUuid: "moteUuid",
      valgtAlternativId: "valgtAlternativId",
      fnr: "998877",
    });
  });

  it("Skal ha en bekrefterMote()-funksjon som rturnerer riktig action", () => {
    const action = actions.bekrefterMote();
    expect(action).to.deep.equal({
      type: actions.BEKREFTER_MOTE,
    });
  });

  it("Skal ha en moteBekreftet()-funksjon som rturnerer riktig action", () => {
    const action = actions.moteBekreftet(
      "olsen",
      "valgtAlternativId",
      "2016-11-03T13:28:05.244"
    );
    expect(action).to.deep.equal({
      type: actions.MOTE_BEKREFTET,
      moteUuid: "olsen",
      valgtAlternativId: "valgtAlternativId",
      bekreftetTidspunkt: "2016-11-03T13:28:05.244",
    });
  });

  it("Skal ha en bekreftMoteFeilet()-funksjon som returnerer riktig action", () => {
    const action = actions.bekreftMoteFeilet();
    expect(action).to.deep.equal({
      type: actions.BEKREFT_MOTE_FEILET,
    });
  });

  it("Skal ha en opprettFlereAlternativ()-funksjon som returnerer riktig action", () => {
    const data = [
      {
        tid: "2017-03-30T10:00:00.000Z",
        sted: "OSlo",
        valgt: false,
      },
      {
        tid: "2017-03-31T08:00:00.000Z",
        sted: "Oslo",
        valgt: false,
      },
    ];
    const action = actions.opprettFlereAlternativ(data, "mote-uuid", "fnr");
    expect(action).to.deep.equal({
      type: actions.OPPRETT_FLERE_ALTERNATIV_FORESPURT,
      data,
      moteUuid: "mote-uuid",
      fnr: "fnr",
    });
  });

  it("Skal ha en opprettFlereAlternativBekreftet()-funksjon som returnerer riktig action", () => {
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
    const action = actions.opprettFlereAlternativBekreftet(data, "mote-uuid");
    expect(action).to.deep.equal({
      type: actions.OPPRETT_FLERE_ALTERNATIV_BEKREFTET,
      data,
      moteUuid: "mote-uuid",
    });
  });

  it("Skal ha en opprettFlereAlternativFeilet()-funksjon som returnerer riktig action", () => {
    const action = actions.opprettFlereAlternativFeilet();
    expect(action).to.deep.equal({
      type: actions.OPPRETT_FLERE_ALTERNATIV_FEILET,
    });
  });

  it("Skal ha en oppretterFlereAlternativ()-funksjon som returnerer riktig action", () => {
    const action = actions.oppretterFlereAlternativ();
    expect(action).to.deep.equal({
      type: actions.OPPRETTER_FLERE_ALTERNATIV,
    });
  });
});
