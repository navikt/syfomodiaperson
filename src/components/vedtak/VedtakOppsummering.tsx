import React, { useEffect, useState } from "react";
import { Column, Row } from "nav-frontend-grid";
import { Normaltekst } from "nav-frontend-typografi";
import {
  estimertMaksdato,
  refusjonTilUtbetalingsdager,
} from "@/utils/vedtakUtils";
import { ValutaFormat } from "@/utils/valutaUtils";
import { VedtakInfopanelRow } from "./VedtakInfopanel";
import { VedtakDTO } from "@/data/vedtak/vedtakTypes";

const texts = {
  utbetalingsdager: "Utbetalingsdager",
  utbetalingsbelopDag: "Beløp per dag",
  utbetalingsbelopBrutto: "Sykepengebeløp brutto",
  utbetalingsMottaker: "Refundert til",
  utbetalingsMottakerArbeidsgiver: "Arbeidsgiver",
  utbetalingsMottakerArbeidstaker: "Arbeidstaker",
  maksdato: "Maksdato",
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

  const [utbetaltArbeidsgiver, setUtbetaltArbeidsgiver] = useState<boolean>(
    false
  );
  const [
    utbetalingsdagerArbeidsgiver,
    setUtbetalingsdagerArbeidsgiver,
  ] = useState<string>("-");
  const [
    utbetalingsbelopBruttoArbeidsgiver,
    setUtbetalingbelopBruttoArbeidsgiver,
  ] = useState<string>("-");
  const [
    utbetalingsbelopDagligArbeidsgiver,
    setUtbetalingbelopDagligArbeidsgiver,
  ] = useState<string>("-");

  const [sykepengegrunnlag, setSykepengegrunnlag] = useState<string>("-");
  const [manedsinntekt, setManedsinntekt] = useState<string>("-");
  const [arsinntekt, setArsinntekt] = useState<string>("-");

  useEffect(() => {
    const utbetalingsdagerArbeidsgiver = refusjonTilUtbetalingsdager(
      selectedVedtak
    );
    if (utbetalingsdagerArbeidsgiver > 0) {
      setUtbetalingsdagerArbeidsgiver(utbetalingsdagerArbeidsgiver + " dager");
      const utbetalingsbelopBruttoArbeidsgiver = selectedVedtak.sykepengebelop;
      setUtbetalingbelopBruttoArbeidsgiver(
        ValutaFormat.format(utbetalingsbelopBruttoArbeidsgiver) + " kr"
      );
      setUtbetalingbelopDagligArbeidsgiver(
        (utbetalingsbelopBruttoArbeidsgiver > 0
          ? ValutaFormat.format(
              utbetalingsbelopBruttoArbeidsgiver / utbetalingsdagerArbeidsgiver
            )
          : 0) + " kr"
      );
      setUtbetaltArbeidsgiver(true);
    }

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
    if (selectedVedtak?.vedtak.inntekt) {
      const calculatedManedsinntekt = Math.floor(
        selectedVedtak?.vedtak.inntekt
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
      {utbetaltArbeidsgiver && (
        <VedtakInfopanelRow>
          <Column className="col-xs-4">
            <Row>
              <Normaltekst>{texts.utbetalingsdager}</Normaltekst>
            </Row>
            <Row>
              <Normaltekst>{texts.utbetalingsbelopDag}</Normaltekst>
            </Row>
            <Row>
              <Normaltekst>{texts.utbetalingsbelopBrutto}</Normaltekst>
            </Row>
            <Row>
              <Normaltekst>{texts.utbetalingsMottaker}</Normaltekst>
            </Row>
          </Column>
          <Column className="col-xs-2">
            <Row>
              <Normaltekst>{utbetalingsdagerArbeidsgiver}</Normaltekst>
            </Row>
            <Row>
              <Normaltekst>{utbetalingsbelopDagligArbeidsgiver}</Normaltekst>
            </Row>
            <Row>
              <Normaltekst>{utbetalingsbelopBruttoArbeidsgiver}</Normaltekst>
            </Row>
            <Row>
              <Normaltekst>{texts.utbetalingsMottakerArbeidsgiver}</Normaltekst>
            </Row>
          </Column>
        </VedtakInfopanelRow>
      )}
      <VedtakInfopanelRow>
        <Column className="col-xs-4">
          <Row>
            <Normaltekst>{texts.maksdato}</Normaltekst>
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
              {selectedVedtak.vedtak.utbetaling.gjenståendeSykedager}
            </Normaltekst>
          </Row>
          <Row>
            <Normaltekst>
              {selectedVedtak.vedtak.utbetaling.forbrukteSykedager}
            </Normaltekst>
          </Row>
          <Row>
            <Normaltekst>
              {selectedVedtak.vedtak.utbetaling.forbrukteSykedager +
                selectedVedtak.vedtak.utbetaling.gjenståendeSykedager}
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
