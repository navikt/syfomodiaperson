<<<<<<< HEAD
import React, {
    useEffect,
    useState,
} from 'react'
import {
    Column,
    Row,
} from 'nav-frontend-grid';
import {
    Normaltekst,
    Undertittel,
} from 'nav-frontend-typografi';
import { restdatoTildato } from '../../utils/datoUtils';
import { VedtakDTO } from '../../reducers/vedtak';
import { estimertMaksdato } from '../../utils/vedtakUtils';
import { ValutaFormat } from '../../utils/valutaUtils';
import { VedtakInfopanelRow } from './VedtakInfopanel';
=======
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { restdatoTildato } from '../../utils/datoUtils';
import { VedtakSuperContainer } from '../../reducers/vedtak';
import styled from 'styled-components';
import { estimertMaksdato } from '../../utils/vedtakUtils';
import { useDispatch, useSelector } from 'react-redux';
import { hentVirksomhet } from '../../actions/virksomhet_actions';
>>>>>>> Implement expandable panel with grouping by orgnr and display of arbeidsgiver

const texts = {
    oppsummering: 'Oppsummering',
    arbeidsgiver: 'Arbeidsgiver',
    maksdato: 'Maksdato',
    vedtaksdato: 'Vedtaksdato',
    dagerGjenstar: 'Dager gjenstår',
    dagerBrukt: 'Dager brukt hittil',
    totalSykepengedager: 'Sykepengedager totalt',
    sykepengegrunnlag: 'Sykepengegrunnlag',
    manedsinntekt: 'Beregnet månedslønn',
    arsinntekt: 'Omregnet til årslønn',
};

interface VedtakOppsummeringProps {
    selectedVedtak: VedtakSuperContainer,
}

const VedtakOppsummering = (vedtakOppsummering: VedtakOppsummeringProps) => {
    const { selectedVedtak } = vedtakOppsummering;
<<<<<<< HEAD

    const [ sykepengegrunnlag, setSykepengegrunnlag ] = useState<string>('-')
    const [ manedsinntekt, setManedsinntekt ] = useState<string>('-')
    const [ arsinntekt, setArsinntekt ] = useState<string>('-')

    useEffect(() => {
        if (selectedVedtak?.vedtak.sykepengegrunnlag) {
            const calculatedSykepengegrunnlag = Math.floor(selectedVedtak?.vedtak.sykepengegrunnlag)
            setSykepengegrunnlag(ValutaFormat.format(calculatedSykepengegrunnlag || 0) + ' kr')
        } else {
            setSykepengegrunnlag('-')
        }
        if (selectedVedtak?.vedtak.månedsinntekt) {
            const calculatedManedsinntekt = Math.floor(selectedVedtak?.vedtak.månedsinntekt)
            setManedsinntekt(ValutaFormat.format(calculatedManedsinntekt || 0) + ' kr')
            setArsinntekt(ValutaFormat.format(calculatedManedsinntekt * 12 || 0) + ' kr')
        } else {
            setManedsinntekt('-')
            setArsinntekt('-')
        }
    }, [ selectedVedtak ])

    return (
        <>
            <VedtakInfopanelRow>
                <Undertittel>{texts.oppsummering}</Undertittel>
            </VedtakInfopanelRow>
            <VedtakInfopanelRow>
=======
    const dispatch = useDispatch();
    const virksomhetState = useSelector((state: any) => state.virksomhet);
    const [arbeidsgiver, setArbeidsgiver] = useState<string>();
    const orgnr = selectedVedtak.vedtak.organisasjonsnummer;

    useEffect(() => {
        dispatch(hentVirksomhet(orgnr));
    });

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
>>>>>>> Implement expandable panel with grouping by orgnr and display of arbeidsgiver
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
            </VedtakInfopanelRow>
            <VedtakInfopanelRow>
                <Column className='col-xs-4'>
                    <Row><Normaltekst>{texts.sykepengegrunnlag}</Normaltekst></Row>
                    <Row><Normaltekst>{texts.manedsinntekt}</Normaltekst></Row>
                    <Row><Normaltekst>{texts.arsinntekt}</Normaltekst></Row>
                </Column>
                <Column className='col-xs-2'>
                    <Row><Normaltekst>{sykepengegrunnlag}</Normaltekst></Row>
                    <Row><Normaltekst>{manedsinntekt}</Normaltekst></Row>
                    <Row><Normaltekst>{arsinntekt}</Normaltekst></Row>
                </Column>
            </VedtakInfopanelRow>
        </>
    );
};

export default VedtakOppsummering;
