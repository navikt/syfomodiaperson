import * as React from "react";
import { Ingress, Normaltekst, Undertittel } from "nav-frontend-typografi";
import { Utbetaling, Utbetalingslinje, VedtakDTO } from "../../reducers/vedtak";
import { restdatoTildato } from "../../utils/datoUtils";
import styled from "styled-components";
import { VedtakInfopanelRow } from "./VedtakInfopanel";

const texts = {
  utbetalt: "Utbetalte perioder til nå",
};

interface VedtakUtbetaltePerioderProps {
  selectedVedtak: VedtakDTO;
}

const StyledIngress = styled(Ingress)`
  margin-bottom: 0.5em;
`;

const StyledUndertittel = styled(Undertittel)`
  margin-bottom: 0.5em;
`;

const displayUtbetaling = (utbetaling: Utbetaling) => {
  return utbetaling.utbetalingslinjer.map((linje: Utbetalingslinje) => {
    const amount = new Intl.NumberFormat("no-NO", {
      minimumFractionDigits: 2,
    }).format(linje.beløp);

    return (
      <>
        <StyledIngress>
          {restdatoTildato(linje.fom)} - {restdatoTildato(linje.tom)}
        </StyledIngress>
        <Normaltekst>{linje.grad} % sykmeldt</Normaltekst>
        <Normaltekst>{`Beløp per dag: ${amount} kr`}</Normaltekst>
      </>
    );
  });
};

const VedtakUtbetaltePerioder = (
  utbetaltePerioderProps: VedtakUtbetaltePerioderProps
) => {
  const { selectedVedtak } = utbetaltePerioderProps;

  return (
    <VedtakInfopanelRow>
      <StyledUndertittel>{texts.utbetalt}</StyledUndertittel>
      {selectedVedtak.vedtak.utbetalinger.map((utbetaling: Utbetaling) =>
        displayUtbetaling(utbetaling)
      )}
    </VedtakInfopanelRow>
  );
};

export default VedtakUtbetaltePerioder;
