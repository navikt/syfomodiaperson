import { expect } from 'chai';
import epostinnhold from '../../../js/mote/reducers/epostinnhold';
import * as actions from '../../../js/mote/actions/epostinnhold_actions';
import deepFreeze from 'deep-freeze';

describe("epostinnhold", () => {

    it("Har en default state", () => {
        const state = epostinnhold();
        expect(state).to.deep.equal({
            data: {},
            henter: false,
            hentingFeilet: false,
        })
    });

    it("Håndterer henterEpostInnhold()", () => {
        const action = actions.henterEpostInnhold();
        const currentState = deepFreeze({})
        const state = epostinnhold(currentState, action);
        expect(state).to.deep.equal({
            henter: true,
            hentingFeilet: false,
        })
    });

    it("Håndterer epostInnholdHentet", () => {
        const data = {
            emne: "test",
            innhold: "Mer test"
        }
        const action = actions.epostInnholdHentet("BEKREFT_TIDSPUNKT", data);
        const currentState = {
            data: {},
            henter: true,
            hentingFeilet: false
        };
        const nextState = epostinnhold(currentState, action);
        expect(nextState).to.deep.equal({
            data: {
                emne: "test",
                innhold: "Mer test"
            },
            eposttype: "BEKREFT_TIDSPUNKT",
            henter: false,
            hentingFeilet: false,
        })
    });

    it("HÅndterer hentEpostinnholdFeilet", () => {
        const action = actions.hentEpostinnholdFeilet();
        const currentState = {
            data: {},
            henter: true,
            hentingFeilet: false,
        };
        const nextState = epostinnhold(currentState, action);
        expect(nextState).to.deep.equal({
            data: {},
            henter: false,
            hentingFeilet: true,
        })
    })

    it("HÅndterer setValgtKanal", () => {
        const action = actions.setValgtKanal('SMS');
        const currentState = {
            data: {},
            henter: false,
            hentingFeilet: false,
        };
        const nextState = epostinnhold(currentState, action);
        expect(nextState).to.deep.equal({
            data: {},
            henter: false,
            hentingFeilet: false,
            valgtKanal: 'SMS',
        })
    })

    it("HÅndterer setValgDeltaker", () => {
        const action = actions.setValgtDeltaker({id: 'testmannen'});
        const currentState = {
            data: {},
            henter: false,
            hentingFeilet: false,
        };
        const nextState = epostinnhold(currentState, action);
        expect(nextState).to.deep.equal({
            data: {},
            henter: false,
            hentingFeilet: false,
            valgtDeltaker: {id: 'testmannen'},
        })
    })

});