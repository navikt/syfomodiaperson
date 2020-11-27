import { expect } from "chai";
import * as actions from "../../src/actions/behandlemotebehov_actions";

describe("behandlemotebehov_actions", () => {
  let fnr;
  let veilederIdent;

  beforeEach(() => {
    fnr = "1234";
    veilederIdent = "Z990000";
  });

  it("Skal ha en behandleMotebehov()-funksjon som returnerer riktig action", () => {
    const action = actions.behandleMotebehov(fnr, veilederIdent);
    expect(action).to.deep.equal({
      type: actions.BEHANDLE_MOTEBEHOV_FORESPURT,
      fnr,
      veilederIdent,
    });
  });

  it("Skal ha en behandleMotebehovBehandler()-funksjon som returnerer riktig action", () => {
    const action = actions.behandleMotebehovBehandler();
    expect(action).to.deep.equal({
      type: actions.BEHANDLE_MOTEBEHOV_BEHANDLER,
    });
  });

  it("Skal ha en behandleMotebehovBehandlet()-funksjon som returnerer riktig action", () => {
    const action = actions.behandleMotebehovBehandlet(veilederIdent);
    expect(action).to.deep.equal({
      type: actions.BEHANDLE_MOTEBEHOV_BEHANDLET,
      veilederIdent,
    });
  });

  it("Skal ha en behandleMotebehovFeilet()-funksjon som returnerer riktig action", () => {
    const action = actions.behandleMotebehovFeilet();
    expect(action).to.deep.equal({
      type: actions.BEHANDLE_MOTEBEHOV_FEILET,
    });
  });

  it("Skal ha en behandleMotebehovForbudt()-funksjon som returnerer riktig action", () => {
    const action = actions.behandleMotebehovForbudt();
    expect(action).to.deep.equal({
      type: actions.BEHANDLE_MOTEBEHOV_FORBUDT,
    });
  });
});
