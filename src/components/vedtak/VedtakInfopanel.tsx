import * as React from 'react';
import styled from 'styled-components';
import { Row } from 'nav-frontend-grid';
import { Innholdstittel } from 'nav-frontend-typografi';
import { restdatoTildato } from '../../utils/datoUtils';
import VedtakMetaInformasjon from "./VedtakMetaInformasjon";
import { VedtakSuperContainer } from '../../reducers/vedtak';
import Panel from 'nav-frontend-paneler';
import VedtakOppsummering from './VedtakOppsummering';
import VedtakUtbetaltePerioder from './VedtakUtbetaltePerioder';
import VedtakAnnullertAlertStripe from './VedtakAnnullertAlertStripe';


interface VedtakInfopanelProps {
    selectedVedtak: VedtakSuperContainer,
}

const StyledPanel = styled(Panel)`
    padding: 1.5em;
    margin-bottom: .5em;
`;

export const VedtakInfopanelRow = styled(Row)`
    margin-bottom: 1em;
`;

const VedtakInfopanel = (vedtakProps: VedtakInfopanelProps) => {
    const { selectedVedtak } = vedtakProps;

    return (
        <StyledPanel>
            <VedtakInfopanelRow>
                <Innholdstittel>
                    {`${restdatoTildato(selectedVedtak.vedtak.fom)} - ${restdatoTildato(selectedVedtak.vedtak.tom)}`}
                </Innholdstittel>
            </VedtakInfopanelRow>
            <VedtakMetaInformasjon selectedVedtak={selectedVedtak}/>
            <VedtakOppsummering selectedVedtak={selectedVedtak}/>
            <VedtakUtbetaltePerioder selectedVedtak={selectedVedtak}/>
            {selectedVedtak.annullert &&
            <VedtakInfopanelRow>
                <VedtakAnnullertAlertStripe />
            </VedtakInfopanelRow>
            }
        </StyledPanel>
    );
};

export default VedtakInfopanel;
