import { expect } from "chai";
import * as actions from "../../src/actions/oppfolgingstilfelleperioder_actions";

describe("oppfolgingstilfelleperioder_actions", () => {
  let fnr;
  let orgnummer;

  beforeEach(() => {
    fnr = "1234";
    orgnummer = "5678";
  });

  it("Skal ha en hentOppfolgingstilfelleperioder()-funksjon som returnerer riktig action", () => {
    expect(actions.hentOppfolgingstilfelleperioder(fnr)).to.deep.equal({
      type: actions.HENT_OPPFOLGINGSTILFELLEPERIODER_FORESPURT,
      fnr,
    });
  });

  it("Skal ha en hentOppfolgingstiflelleperioderHenter()-funksjon som returnerer riktig action", () => {
    expect(
      actions.hentOppfolgingstilfelleperioderHenter(orgnummer)
    ).to.deep.equal({
      type: actions.HENT_OPPFOLGINGSTILFELLEPERIODER_HENTER,
      orgnummer,
    });
  });

  it("har en hentOppfolgingstiflelleperioderHentet()-funksjon som returnerer riktig action", () => {
    const data = {};
    expect(
      actions.hentOppfolgingstilfelleperioderHentet(data, orgnummer)
    ).to.deep.equal({
      type: actions.HENT_OPPFOLGINGSTILFELLEPERIODER_HENTET,
      data,
      orgnummer,
    });
  });

  it("Skal ha en hentOppfolgingstilfelleperioderFeilet()-funksjon som returnerer riktig action", () => {
    expect(
      actions.hentOppfolgingstilfelleperioderFeilet(orgnummer)
    ).to.deep.equal({
      type: actions.HENT_OPPFOLGINGSTILFELLEPERIODER_FEILET,
      orgnummer,
    });
  });
});
