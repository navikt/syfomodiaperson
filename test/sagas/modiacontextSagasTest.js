import { expect } from 'chai';
import { put, call } from 'redux-saga/effects';
import { get, post } from '../../src/api';
import {
    aktivEnhetSaga,
    pushModiacontextSaga,
    aktivBrukerSaga,
} from '../../src/sagas/modiacontextSagas';
import {
    HENTER_AKTIVENHET,
    PUSHER_MODIACONTEXT,
    HENTER_AKTIVBRUKER,
} from '../../src/actions/actiontyper';
import { HOST_NAMES } from '../../src/konstanter';
import { fullNaisUrlQ1 } from '../../src/utils/miljoUtil';

describe('modiacontextSagas', () => {

    let apiPath;

    beforeEach(() => {
        apiPath = '/modiacontextholder/api';
        process.env = {
            REACT_APP_CONTEXTHOLDER_ROOT: apiPath,
        };
    });

    describe('aktivEnhetSaga', () => {
        const generator = aktivEnhetSaga();

        it(`Skal dispatche ${HENTER_AKTIVENHET}`, () => {
            const nextPut = put({ type: HENTER_AKTIVENHET });
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it('Skal dernest hente aktiv enhet', () => {
            const host = HOST_NAMES.MODIACONTEXTHOLDER;
            const path = `${apiPath}/context/aktivenhet`;
            const url = fullNaisUrlQ1(host, path);
            const nextCall = call(get, url);
            expect(generator.next().value).to.deep.equal(nextCall);
        });
    });

    describe('aktivBrukerSaga', () => {
        const generator = aktivBrukerSaga();

        it(`Skal dispatche ${HENTER_AKTIVBRUKER}`, () => {
            const nextPut = put({ type: HENTER_AKTIVBRUKER });
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it('Skal dernest hente aktiv bruker', () => {
            const host = HOST_NAMES.MODIACONTEXTHOLDER;
            const path = `${apiPath}/context/aktivbruker`;
            const url = fullNaisUrlQ1(host, path);
            const nextCall = call(get, url);
            expect(generator.next().value).to.deep.equal(nextCall);
        });
    });


    describe('pushModiacontextSaga', () => {
        const generator = pushModiacontextSaga({
            data: {
                verdi: 'fnr',
                eventType: 'event1',
            },
        });

        it(`Skal dispatche ${PUSHER_MODIACONTEXT}`, () => {
            const nextPut = put({ type: PUSHER_MODIACONTEXT });
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it('Skal dernest pushe context', () => {
            const host = HOST_NAMES.MODIACONTEXTHOLDER;
            const path = `${apiPath}/context`;
            const url = fullNaisUrlQ1(host, path);
            const nextCall = call(post, url, {
                verdi: 'fnr',
                eventType: 'event1',
            });
            expect(generator.next().value).to.deep.equal(nextCall);
        });
    });
});
