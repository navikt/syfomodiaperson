import * as React from "react";
import styled from "styled-components";
import { Row } from "nav-frontend-grid";
import { Innholdstittel } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { restdatoTildato } from "@/utils/datoUtils";
import VedtakMetaInformasjon from "./VedtakMetaInformasjon";
import VedtakOppsummering from "./VedtakOppsummering";
import VedtakAnnullertAlertStripe from "./VedtakAnnullertAlertStripe";
import { VedtakDTO } from "@/data/vedtak/vedtakTypes";

interface VedtakInfopanelProps {
  selectedVedtak: VedtakDTO;
}

const StyledPanel = styled(Panel)`
  padding: 1.5em;
  margin-bottom: 0.5em;
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
          {`${restdatoTildato(selectedVedtak.vedtak.fom)} - ${restdatoTildato(
            selectedVedtak.vedtak.tom
          )}`}
        </Innholdstittel>
      </VedtakInfopanelRow>
      <VedtakMetaInformasjon selectedVedtak={selectedVedtak} />
      <VedtakOppsummering selectedVedtak={selectedVedtak} />
      {(selectedVedtak.annullert || selectedVedtak.revurdert) && (
        <VedtakInfopanelRow>
          <VedtakAnnullertAlertStripe />
        </VedtakInfopanelRow>
      )}
    </StyledPanel>
  );
};

export default VedtakInfopanel;
