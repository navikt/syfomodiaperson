import * as React from 'react';
import { useEffect, useState } from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { restdatoTildato } from '../../utils/datoUtils';
import { VedtakSuperContainer } from '../../reducers/vedtak';
import { estimertMaksdato } from '../../utils/vedtakUtils';
import { useDispatch, useSelector } from 'react-redux';
import { hentVirksomhet } from '../../actions/virksomhet_actions';

const texts = {
    oppsummering: 'Oppsummering',
    arbeidsgiver: 'Arbeidsgiver',
    maksdato: 'Maksdato',
    vedtaksdato: 'Vedtaksdato',
    dagerGjenstar: 'Dager gjenstår',
    dagerBrukt: 'Dager brukt hittil',
    totalSykepengedager: 'Sykepengedager totalt',
};

interface VedtakOppsummeringProps {
    selectedVedtak: VedtakSuperContainer,
}


const VedtakOppsummering = (vedtakOppsummering: VedtakOppsummeringProps) => {
    const { selectedVedtak } = vedtakOppsummering;
    const dispatch = useDispatch();
    const virksomhetState = useSelector((state: any) => state.virksomhet);
    const [arbeidsgiver, setArbeidsgiver] = useState<string>();
    const orgnr = selectedVedtak.vedtak.organisasjonsnummer;

    useEffect(() => {
        dispatch(hentVirksomhet(orgnr));
    }, []);

    useEffect(() => {
        if (virksomhetState[orgnr]?.hentet) {
            setArbeidsgiver(virksomhetState[orgnr].data[orgnr]);
        }
    }, [virksomhetState]);

    return (
        <>
            <Row>
                <Column className='col-xs-4'>
                    <Row><Normaltekst>{texts.arbeidsgiver}</Normaltekst></Row>
                </Column>
                <Column className='col-xs-5'>
                    <Row><Normaltekst>{arbeidsgiver}</Normaltekst></Row>
                </Column>
            </Row>

            <Row>
                <Column className='col-xs-4'>
                    <Row><Normaltekst>{texts.maksdato}</Normaltekst></Row>
                    <Row><Normaltekst>{texts.vedtaksdato}</Normaltekst></Row>
                    <Row><Normaltekst>{texts.dagerGjenstar}</Normaltekst></Row>
                    <Row><Normaltekst>{texts.dagerBrukt}</Normaltekst></Row>
                    <Row><Normaltekst>{texts.totalSykepengedager}</Normaltekst></Row>
                </Column>
                <Column className='col-xs-2'>
                    <Row><Normaltekst>{estimertMaksdato(selectedVedtak)}</Normaltekst></Row>
                    <Row><Normaltekst>{restdatoTildato(selectedVedtak.opprettet)}</Normaltekst></Row>
                    <Row><Normaltekst>{selectedVedtak.vedtak.gjenståendeSykedager}</Normaltekst></Row>
                    <Row><Normaltekst>{selectedVedtak.vedtak.forbrukteSykedager}</Normaltekst></Row>
                    <Row><Normaltekst>{selectedVedtak.vedtak.forbrukteSykedager + selectedVedtak.vedtak.gjenståendeSykedager}</Normaltekst></Row>
                </Column>
            </Row>
        </>
    );
};

export default VedtakOppsummering;
