import * as React from 'react';
import { useEffect, useState } from 'react';
import { VedtakSuperContainer } from '../../reducers/vedtak';
import styled from 'styled-components';
import Panel from 'nav-frontend-paneler';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { restdatoTildato } from '../../utils/datoUtils';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { useDispatch, useSelector } from 'react-redux';
import { hentVirksomhet } from '../../actions/virksomhet_actions';
import VedtakAnnullertLabel from './VedtakAnnullertLabel';

interface StyledPanelProps {
    readonly isActive: boolean
}

const hvit = '#FFF';
const lysBla = '#CCE1F3';

const FlexRow = styled.div`
    display: flex;
`;

const FlexColInfo = styled.div`
    flex-grow: 1;
`;
const FlexColLabel = styled.div`
    flex-grow: 0;
`;


const StyledPanel = styled(Panel)<StyledPanelProps>`
  background: ${props => props.isActive ? lysBla : hvit};
  border-radius: 0;
`;

const StyledButton = styled.button`
  margin: 0;
  padding: .8em;
  padding-left: 1em;
  border: 0;
  border-radius: 0;
  background: 0;
  width: 100%;
  text-align: left;
  background: none;
`;

const StyledEkspanderbartPanel = styled(Ekspanderbartpanel)`
    border: 0;
    border-radius: 0;
    margin-bottom: .1em;
`;

interface VedtakEkspanderbartPanelProps {
    selectedVedtak: VedtakSuperContainer,
    setSelectedVedtak: (vedtak: VedtakSuperContainer) => void,
    vedtakPerArbeidsgiver: VedtakSuperContainer[],
    className?: string
}

const VedtakEkspanderbartPanel = (panelProps: VedtakEkspanderbartPanelProps) => {
    const { vedtakPerArbeidsgiver, setSelectedVedtak, selectedVedtak } = panelProps;
    const dispatch = useDispatch();
    const virksomhetState = useSelector((state: any) => state.virksomhet);
    const [arbeidsgiver, setArbeidsgiver] = useState<string>();
    const orgnr = vedtakPerArbeidsgiver[0].vedtak.organisasjonsnummer;

    useEffect(() => {
        dispatch(hentVirksomhet(orgnr));
    });

    useEffect(() => {
        if (virksomhetState[orgnr]?.hentet) {
            setArbeidsgiver(virksomhetState[orgnr].data[orgnr]);
        }
    }, [virksomhetState]);

    return (

        <StyledEkspanderbartPanel tittel={<Normaltekst>{arbeidsgiver}</Normaltekst>}>
            {vedtakPerArbeidsgiver.map((v: VedtakSuperContainer) => {
                return (

                    <StyledPanel isActive={v.id === selectedVedtak.id}>
                        <StyledButton onClick={() => {
                            setSelectedVedtak(v);
                        }}>
                            <FlexRow>
                                <FlexColInfo>
                                    <Undertittel>
                                        {`${restdatoTildato(v.vedtak.fom)} - ${restdatoTildato(v.vedtak.tom)}`}
                                    </Undertittel>
                                    <Undertekst>
                                        {`Vedtaksdato: ${restdatoTildato(
                                            v.opprettet,
                                        )} · Restdager: ${v.vedtak.gjenståendeSykedager}`}
                                    </Undertekst>
                                </FlexColInfo>
                                {v.annullert &&
                                <FlexColLabel>
                                    <VedtakAnnullertLabel/>
                                </FlexColLabel>
                                }
                            </FlexRow>
                        </StyledButton>
                    </StyledPanel>

                );
            })}
        </StyledEkspanderbartPanel>

    );
};

export default VedtakEkspanderbartPanel;
