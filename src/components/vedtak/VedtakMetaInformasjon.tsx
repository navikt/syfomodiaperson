import * as React from "react";
import { Column, Row } from "nav-frontend-grid";
import { Normaltekst } from "nav-frontend-typografi";
import { VedtakDTO } from "../../reducers/vedtak";
import { restdatoTildato } from "../../utils/datoUtils";
import { VedtakInfopanelRow } from "./VedtakInfopanel";

const texts = {
  lestDato: "Lest",
  utbetalingsdato: "Sendt til utbetaling",
};

interface VedtakMetaInformasjonProps {
  selectedVedtak: VedtakDTO;
}

const isVedtakLest = (vedtak: VedtakDTO) => {
  return vedtak.lest && vedtak.lestDato;
};

const VedtakMetaInformasjon = (
  vedtakMetaInformasjonProps: VedtakMetaInformasjonProps
) => {
  const { selectedVedtak } = vedtakMetaInformasjonProps;
  return (
    <VedtakInfopanelRow>
      <Column className="col-xs-4">
        <Row>
          <Normaltekst>{texts.utbetalingsdato}</Normaltekst>
        </Row>
        {isVedtakLest(selectedVedtak) && (
          <Row>
            <Normaltekst>{texts.lestDato}</Normaltekst>
          </Row>
        )}
      </Column>
      <Column className="col-xs-2">
        <Row>
          <Normaltekst>{restdatoTildato(selectedVedtak.opprettet)}</Normaltekst>
        </Row>
        {isVedtakLest(selectedVedtak) && (
          <Row>
            <Normaltekst>
              {restdatoTildato(selectedVedtak.lestDato)}
            </Normaltekst>
          </Row>
        )}
      </Column>
    </VedtakInfopanelRow>
  );
};

export default VedtakMetaInformasjon;
