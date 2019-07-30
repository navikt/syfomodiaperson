import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import * as actions from '../../js/actions/fastleger_actions';
import fastleger from '../../js/reducers/fastleger';

describe('fastleger', () => {
    describe('henter', () => {
        const initialState = deepFreeze({
            henter: false,
            hentet: false,
            ikkeFunnet: false,
            hentingFeilet: false,
            data: [],
            aktiv: {},
            tidligere: [],
        });

        it('håndterer HENTER_FASTLEGER', () => {
            const action = actions.henterFastleger();
            const nextState = fastleger(initialState, action);
            expect(nextState).to.deep.equal({
                henter: true,
                hentet: false,
                ikkeFunnet: false,
                hentingFeilet: false,
                data: [],
                aktiv: {},
                tidligere: [],
            });
        });

        it('håndterer FASTLEGER_HENTET med liste med innhold', () => {
            const nesteDag = new Date();
            nesteDag.setDate(nesteDag.getDate() + 1);
            const forrigeDag = new Date();
            forrigeDag.setDate(forrigeDag.getDate() - 1);
            const leger = [
                {
                    pasientforhold: {
                        fom: forrigeDag,
                        tom: nesteDag,
                    },
                },
                {
                    pasientforhold: {
                        fom: forrigeDag,
                        tom: forrigeDag,
                    },
                },
            ];
            const action = actions.fastlegerHentet(leger);
            const nextState = fastleger(initialState, action);
            expect(nextState).to.deep.equal({
                henter: false,
                hentet: true,
                ikkeFunnet: false,
                hentingFeilet: false,
                data: leger,
                aktiv: leger[0],
                tidligere: [leger[1]],
            });
        });

        it('håndterer FASTLEGER_HENTET med tom liste gir IkkeFunnet', () => {
            const action = actions.fastlegerHentet([]);
            const nextState = fastleger(initialState, action);
            expect(nextState).to.deep.equal({
                henter: false,
                hentet: true,
                ikkeFunnet: true,
                hentingFeilet: false,
                data: [],
                aktiv: {},
                tidligere: [],
            });
        });

        it('håndterer HENT_FASTLEGER_FEILET', () => {
            const action = actions.hentFastlegerFeilet();
            const nextState = fastleger(initialState, action);
            expect(nextState).to.deep.equal({
                henter: false,
                hentet: false,
                ikkeFunnet: false,
                hentingFeilet: true,
                data: [],
                aktiv: {},
                tidligere: [],
            });
        });
    });
});
