import { expect } from 'chai';
import { hentNavbruker, sjekkTilgangMoteadmin } from '../../js/sagas/navbrukerSagas.js';
import { get } from '../../js/api';
import { put, call } from 'redux-saga/effects';

describe("navbrukerSagas", () => {

    beforeEach(() => {
        window.APP_SETTINGS = {
            REST_ROOT: "http://tjenester.nav.no/sykefravaer"
        }
    })

    describe("hentNavbruker", () => {
        const generator = hentNavbruker({
            fnr: "55"
        });

        it("Skal dispatche HENTER_NAVBRUKER", () => {
            const nextPut = put({type: 'HENTER_NAVBRUKER'});
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it("Skal dernest hente navbruker", () => {
            const nextCall = call(get, "http://tjenester.nav.no/sykefravaer/brukerinfo?fnr=55");
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it("Skal dernest hente ledere", () => {
            const nextPut = put({
                type: 'NAVBRUKER_HENTET',
                data: {
                    "navn": "***REMOVED***"
                }
            });
            expect(generator.next({
                "navn": "***REMOVED***"
            }).value).to.deep.equal(nextPut);
        });
    });

    describe("sjekkTilgangMoteadmin", () => {
        const generator = sjekkTilgangMoteadmin();

        it("Skal dispatche SJEKKER_TILGANG_MOTEADMIN", () => {
            const nextPut = put({type: 'SJEKKER_TILGANG_MOTEADMIN'});
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it("Skal dernest kalle REST-tjenesten", () => {
            const nextCall = call(get, "http://tjenester.nav.no/sykefravaer/toggle/tilgangmoteadmin");
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it("Skal dernest store tilgang hentet", () => {
            const nextPut = put({
                type: 'TILGANG_MOTEMODUL_HENTET',
                data: {
                    "harTilgang": true
                }
            });
            expect(generator.next({
                "harTilgang": true
            }).value).to.deep.equal(nextPut);
        });

    });
});