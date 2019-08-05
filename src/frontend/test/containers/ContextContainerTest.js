import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { mapStateToProps, Context } from '../../js/context/ContextContainer';
import ModalWrapper from 'nav-frontend-modal';
import { config } from '../../js/global';

describe('ContextContainer', () => {
    const gammeltFnr = '11223344556';
    const nyttFnr = '12345678910';
    const nyEnhet = '0314';
    const gammelEnhet = '0315';

    let actions;
    let state;

    beforeEach(() => {
        state = {
            veilederinfo: {
                henter: false,
                data: {
                    ident: '123',
                },
            },
        };

        actions = {
            hentAktivBruker: sinon.spy(),
            hentAktivEnhet: sinon.spy(),
            hentVeilederinfo: sinon.spy(),
            valgtEnhet: sinon.spy(),
            pushModiaContext: sinon.spy(),
        };
        config.config.fnr = gammeltFnr;
        config.config.initiellEnhet = gammelEnhet;
    });

    it('Skal vise EndreBrukerModal ved mottak av nytt fnr', () => {
        const component = shallow(
            <Context
                {...mapStateToProps(state)}
                actions={actions}
            />);
        component.instance().visEndretBrukerModal(nyttFnr);

        expect(component.state().visEndretBrukerModal).to.equal(true);
        expect(component.state().nyttFnr).to.equal(nyttFnr);
        expect(component.find(ModalWrapper)).to.have.length(1);
    });

    it('Skal vise EndreEnhetModal ved mottak av ny enhet', () => {
        const component = shallow(
            <Context
                {...mapStateToProps(state)}
                actions={actions}
            />);
        component.instance().visEndretEnhetModal(nyEnhet);

        expect(component.state().visEndretEnhetModal).to.equal(true);
        expect(component.state().nyEnhet).to.equal(nyEnhet);
        expect(component.find(ModalWrapper)).to.have.length(1);
    });

    it('Skal oppdatere modiacontext ved trykk på "Behold gammel bruker"', () => {
        const component = shallow(
            <Context
                {...mapStateToProps(state)}
                actions={actions}
            />);

        component.instance().visEndretBrukerModal(nyttFnr);
        component.instance().beholdGammelBrukerClicked();
        expect(actions.pushModiaContext.calledOnce).to.equal(true);
    });

    it('Skal oppdatere modiacontext ved trykk på "Behold gammel enhet"', () => {
        const component = shallow(
            <Context
                {...mapStateToProps(state)}
                actions={actions}
            />);

        component.instance().visEndretEnhetModal(nyEnhet);
        component.instance().beholdGammelEnhetClicked();
        expect(actions.valgtEnhet.calledOnce).to.equal(true);
    });

});
