import { expect } from "chai";
import deepFreeze from "deep-freeze";
import * as actions from "../../src/actions/oppfolgingstilfelleperioder_actions";
import oppfolgingstilfelleperioder from "../../src/reducers/oppfolgingstilfelleperioder";
import { ANTALL_MS_DAG } from "../../src/utils/datoUtils";

describe("oppfolgingstilfelleperioder", () => {
  const initState = deepFreeze({});

  let sykmeldt;
  let fnr;
  let orgnummer;
  beforeEach(() => {
    sykmeldt = {
      fnr: "1234",
      orgnummer: "1234",
    };
    fnr = "1234";
    orgnummer = "5678";
  });

  it("håndterer HENT_OPPFOLGINGSTILFELLEPERIODER_HENTER", () => {
    const action = actions.hentOppfolgingstilfelleperioderHenter(orgnummer);
    const nextState = oppfolgingstilfelleperioder(initState, action);
    expect(nextState).to.deep.equal({
      [orgnummer]: {
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
        data: [],
      },
    });
  });

  it("håndterer HENT_OPPFOLGINGSTILFELLEPERIODER_HENTET", () => {
    const action = actions.hentOppfolgingstilfelleperioderHentet(
      [
        {
          orgnummer,
          fom: new Date(Date.now() - ANTALL_MS_DAG * 120),
          tom: new Date(Date.now() - ANTALL_MS_DAG * 90),
          grad: 100,
          aktivitet: "Heihei",
        },
      ],
      orgnummer
    );
    const nextState = oppfolgingstilfelleperioder(initState, action);

    expect(nextState).to.deep.equal({
      [orgnummer]: {
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
        data: [
          {
            orgnummer,
            fom: new Date(Date.now() - ANTALL_MS_DAG * 120),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 90),
            grad: 100,
            aktivitet: "Heihei",
          },
        ],
      },
    });
  });

  it("håndterer HENT_OPPFOLGINGSTILFELLEPERIODER_FEILET", () => {
    const action = actions.hentOppfolgingstilfelleperioderFeilet(orgnummer);
    const nextState = oppfolgingstilfelleperioder(initState, action);
    expect(nextState).to.deep.equal({
      [orgnummer]: {
        henter: false,
        hentet: false,
        hentingFeilet: true,
        hentingForsokt: true,
        data: [],
      },
    });
  });
});
