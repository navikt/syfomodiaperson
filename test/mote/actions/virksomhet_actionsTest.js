import { expect } from "chai";
import * as actions from "../../../src/actions/virksomhet_actions";

describe("virksomhet_actions", () => {
  let orgnummer;

  beforeEach(() => {
    orgnummer = "orgnummer";
  });

  it("Har en hentVirksomhet()-funksjon som returnerer riktig action", () => {
    const action = actions.hentVirksomhet(orgnummer);
    expect(action).to.deep.equal({
      type: actions.HENT_VIRKSOMHET_FORESPURT,
      orgnummer,
    });
  });

  it("Har en henterVirksomhet()-funksjon som returnerer riktig action", () => {
    const action = actions.henterVirksomhet(orgnummer);
    expect(action).to.deep.equal({
      type: actions.HENTER_VIRKSOMHET,
      orgnummer,
    });
  });

  it("Har en hentVirksomhetFeilet()-funksjon som returnerer riktig action", () => {
    const action = actions.hentVirksomhetFeilet(orgnummer);
    expect(action).to.deep.equal({
      type: actions.HENT_VIRKSOMHET_FEILET,
      orgnummer,
    });
  });

  it("Har en virksomhetHentet()-funksjon som returnerer riktig action", () => {
    const action = actions.virksomhetHentet(orgnummer, {
      navn: "test",
    });
    expect(action).to.deep.equal({
      type: actions.VIRKSOMHET_HENTET,
      orgnummer,
      data: {
        navn: "test",
      },
    });
  });
});
