import { expect } from "chai";
import deepFreeze from "deep-freeze";
import motebehovBehandling from "../../src/data/motebehov/motebehovBehandling";
import * as actions from "../../src/data/motebehov/behandlemotebehov_actions";
import { VEILEDER_IDENT_DEFAULT } from "../../mock/common/mockConstants";

describe("motebehovBehandling", () => {
  const initState = deepFreeze({
    behandler: false,
    behandlet: false,
    behandleFeilet: false,
    behandleForbudt: false,
  });

  let veilederIdent;
  beforeEach(() => {
    veilederIdent = VEILEDER_IDENT_DEFAULT;
  });

  it(`håndterer ${actions.BEHANDLE_MOTEBEHOV_BEHANDLER}`, () => {
    const action = actions.behandleMotebehovBehandler();
    const nextState = motebehovBehandling(initState, action);
    expect(nextState).to.deep.equal({
      behandler: true,
      behandlet: false,
      behandleFeilet: false,
      behandleForbudt: false,
    });
  });

  it(`håndterer ${actions.BEHANDLE_MOTEBEHOV_BEHANDLET}`, () => {
    const action = actions.behandleMotebehovBehandlet(veilederIdent);
    const nextState = motebehovBehandling(initState, action);

    expect(nextState).to.deep.equal({
      behandler: false,
      behandlet: true,
      behandleFeilet: false,
      behandleForbudt: false,
    });
  });

  it(`håndterer ${actions.BEHANDLE_MOTEBEHOV_FEILET}`, () => {
    const action = actions.behandleMotebehovFeilet();
    const nextState = motebehovBehandling(initState, action);
    expect(nextState).to.deep.equal({
      behandler: false,
      behandlet: false,
      behandleFeilet: true,
      behandleForbudt: false,
    });
  });

  it(`håndterer ${actions.BEHANDLE_MOTEBEHOV_FORBUDT}`, () => {
    const action = actions.behandleMotebehovForbudt();
    const nextState = motebehovBehandling(initState, action);
    expect(nextState).to.deep.equal({
      behandler: false,
      behandlet: false,
      behandleFeilet: false,
      behandleForbudt: true,
    });
  });
});
