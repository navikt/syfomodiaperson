import { Normaltekst, Undertekst, Undertittel } from "nav-frontend-typografi";
import { restdatoTildato } from "@/utils/datoUtils";
import VedtakAnnullertLabel from "./VedtakAnnullertLabel";
import * as React from "react";
import styled from "styled-components";
import Panel from "nav-frontend-paneler";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import navFarger from "nav-frontend-core";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { VedtakDTO } from "@/data/vedtak/vedtakTypes";

interface StyledPanelProps {
  readonly selected: boolean;
}

const StyledPanel = styled(Panel)<StyledPanelProps>`
  background: ${(props) =>
    props.selected ? navFarger.navBlaLighten80 : navFarger.white};
`;

const StyledButton = styled.button`
  margin: 0;
  padding: 1em;
  border: 0;
  border-radius: 0;
  background: 0;
  width: 100%;
  text-align: left;
  background: none;
`;

const StyledEkspanderbartPanel = styled(Ekspanderbartpanel)`
  border-radius: 0;
  margin: 0 0 0.2em;
  padding: 0;
  background: none;
`;

const FlexRow = styled.div`
  display: flex;
`;

const FlexColInfo = styled.div`
  flex-grow: 1;
`;
const FlexColLabel = styled.div`
  flex-grow: 0;
`;

interface VedtakEkspanderbartPanelProps {
  selectedVedtak?: VedtakDTO;
  setSelectedVedtak: (vedtak: VedtakDTO) => void;
  vedtakPerArbeidsgiver: VedtakDTO[];
}

const VedtakEkspanderbartPanel = (
  panelProps: VedtakEkspanderbartPanelProps
) => {
  const {
    vedtakPerArbeidsgiver,
    setSelectedVedtak,
    selectedVedtak,
  } = panelProps;
  const { data: virksomhet } = useVirksomhetQuery(
    vedtakPerArbeidsgiver[0].vedtak.organisasjonsnummer
  );
  const arbeidsgiver = virksomhet?.navn || "";

  return (
    <StyledEkspanderbartPanel
      tittel={<Normaltekst>{arbeidsgiver}</Normaltekst>}
    >
      {vedtakPerArbeidsgiver
        .sort(
          (v1: VedtakDTO, v2: VedtakDTO) =>
            new Date(v2.vedtak.fom).getTime() -
            new Date(v1.vedtak.fom).getTime()
        )
        .map((v: VedtakDTO, index: number) => {
          return (
            <StyledPanel key={index} selected={v.id === selectedVedtak?.id}>
              <StyledButton
                onClick={() => {
                  setSelectedVedtak(v);
                }}
              >
                <FlexRow>
                  <FlexColInfo>
                    <Undertittel>
                      {`${restdatoTildato(v.vedtak.fom)} - ${restdatoTildato(
                        v.vedtak.tom
                      )}`}
                    </Undertittel>
                    <Undertekst>
                      {`Utbetaling: ${restdatoTildato(
                        v.opprettet
                      )} · Restdager: ${
                        v.vedtak.utbetaling.gjenståendeSykedager
                      }`}
                    </Undertekst>
                  </FlexColInfo>
                  {(v.annullert || v.revurdert) && (
                    <FlexColLabel>
                      <VedtakAnnullertLabel />
                    </FlexColLabel>
                  )}
                </FlexRow>
              </StyledButton>
            </StyledPanel>
          );
        })}
    </StyledEkspanderbartPanel>
  );
};

export default VedtakEkspanderbartPanel;
