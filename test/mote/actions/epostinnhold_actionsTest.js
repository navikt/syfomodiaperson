import { expect } from "chai";
import * as actions from "../../../src/actions/epostinnhold_actions";

describe("epostinnhold_actions", () => {
  it("Har en hentBekreftMoteEpostinnhold()-funksjon som returnerer riktig action", () => {
    const motedeltakerUuid = "hansen";
    const valgtAlternativId = "123";
    const action = actions.hentBekreftMoteEpostinnhold(
      motedeltakerUuid,
      valgtAlternativId
    );
    expect(action).to.deep.equal({
      type: actions.HENT_BEKREFT_MOTE_EPOSTINNHOLD_FORESPURT,
      motedeltakerUuid: "hansen",
      valgtAlternativId: "123",
    });
  });

  it("Har en hentAvbrytMoteEpostinnhold-funksjon som returnerer riktig action", () => {
    const motedeltakerUuid = "Olsen";
    const action = actions.hentAvbrytMoteEpostinnhold(motedeltakerUuid);
    expect(action).to.deep.equal({
      type: actions.HENT_AVBRYT_MOTE_EPOSTINNHOLD_FORESPURT,
      motedeltakerUuid: "Olsen",
    });
  });

  it("Har en henterEpostInnhold()-funksjon som returnerer riktig action", () => {
    const action = actions.henterEpostInnhold();
    expect(action).to.deep.equal({
      type: actions.HENTER_EPOSTINNHOLD,
    });
  });

  it("Har en hentEpostinnholdFeilet()-funksjon som returnerer riktig action", () => {
    const action = actions.hentEpostinnholdFeilet();
    expect(action).to.deep.equal({
      type: actions.HENT_EPOSTINNHOLD_FEILET,
    });
  });

  it("Har en epostInnholdHentet()-funksjon som returnerer riktig action", () => {
    const action = actions.epostInnholdHentet("olsen", {
      id: 1,
    });
    expect(action).to.deep.equal({
      type: actions.EPOSTINNHOLD_HENTET,
      eposttype: "olsen",
      data: {
        id: 1,
      },
    });
  });
});
