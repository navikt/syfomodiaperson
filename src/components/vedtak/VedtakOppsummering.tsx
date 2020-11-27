import React, { useEffect, useState } from "react";
import { Column, Row } from "nav-frontend-grid";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import { restdatoTildato } from "../../utils/datoUtils";
import { VedtakDTO } from "../../reducers/vedtak";
import { estimertMaksdato } from "../../utils/vedtakUtils";
import { ValutaFormat } from "../../utils/valutaUtils";
import { VedtakInfopanelRow } from "./VedtakInfopanel";

const texts = {
  oppsummering: "Oppsummering",
  maksdato: "Maksdato",
  vedtaksdato: "Vedtaksdato",
  dagerGjenstar: "Dager gjenstår",
  dagerBrukt: "Dager brukt hittil",
  totalSykepengedager: "Sykepengedager totalt",
  sykepengegrunnlag: "Sykepengegrunnlag",
  manedsinntekt: "Beregnet månedslønn",
  arsinntekt: "Omregnet til årslønn",
};

interface VedtakOppsummeringProps {
  selectedVedtak: VedtakDTO;
}

const VedtakOppsummering = (vedtakOppsummering: VedtakOppsummeringProps) => {
  const { selectedVedtak } = vedtakOppsummering;

  const [sykepengegrunnlag, setSykepengegrunnlag] = useState<string>("-");
  const [manedsinntekt, setManedsinntekt] = useState<string>("-");
  const [arsinntekt, setArsinntekt] = useState<string>("-");

  useEffect(() => {
    if (selectedVedtak?.vedtak.sykepengegrunnlag) {
      const calculatedSykepengegrunnlag = Math.floor(
        selectedVedtak?.vedtak.sykepengegrunnlag
      );
      setSykepengegrunnlag(
        ValutaFormat.format(calculatedSykepengegrunnlag || 0) + " kr"
      );
    } else {
      setSykepengegrunnlag("-");
    }
    if (selectedVedtak?.vedtak.månedsinntekt) {
      const calculatedManedsinntekt = Math.floor(
        selectedVedtak?.vedtak.månedsinntekt
      );
      setManedsinntekt(
        ValutaFormat.format(calculatedManedsinntekt || 0) + " kr"
      );
      setArsinntekt(
        ValutaFormat.format(calculatedManedsinntekt * 12 || 0) + " kr"
      );
    } else {
      setManedsinntekt("-");
      setArsinntekt("-");
    }
  }, [selectedVedtak]);

  return (
    <>
      <VedtakInfopanelRow>
        <Undertittel>{texts.oppsummering}</Undertittel>
      </VedtakInfopanelRow>
      <VedtakInfopanelRow>
        <Column className="col-xs-4">
          <Row>
            <Normaltekst>{texts.maksdato}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>{texts.vedtaksdato}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>{texts.dagerGjenstar}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>{texts.dagerBrukt}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>{texts.totalSykepengedager}</Normaltekst>
          </Row>
        </Column>
        <Column className="col-xs-2">
          <Row>
            <Normaltekst>{estimertMaksdato(selectedVedtak)}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>
              {restdatoTildato(selectedVedtak.opprettet)}
            </Normaltekst>
          </Row>
          <Row>
            <Normaltekst>
              {selectedVedtak.vedtak.gjenståendeSykedager}
            </Normaltekst>
          </Row>
          <Row>
            <Normaltekst>
              {selectedVedtak.vedtak.forbrukteSykedager}
            </Normaltekst>
          </Row>
          <Row>
            <Normaltekst>
              {selectedVedtak.vedtak.forbrukteSykedager +
                selectedVedtak.vedtak.gjenståendeSykedager}
            </Normaltekst>
          </Row>
        </Column>
      </VedtakInfopanelRow>
      <VedtakInfopanelRow>
        <Column className="col-xs-4">
          <Row>
            <Normaltekst>{texts.sykepengegrunnlag}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>{texts.manedsinntekt}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>{texts.arsinntekt}</Normaltekst>
          </Row>
        </Column>
        <Column className="col-xs-2">
          <Row>
            <Normaltekst>{sykepengegrunnlag}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>{manedsinntekt}</Normaltekst>
          </Row>
          <Row>
            <Normaltekst>{arsinntekt}</Normaltekst>
          </Row>
        </Column>
      </VedtakInfopanelRow>
    </>
  );
};

export default VedtakOppsummering;
