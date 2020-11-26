import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Column, Row } from "nav-frontend-grid";
import Panel from "nav-frontend-paneler";
import { Undertekst, Undertittel } from "nav-frontend-typografi";
import { hentVedtak } from "../actions/vedtak_actions";
import Side from "../sider/Side";
import { VedtakDTO } from "../reducers/vedtak";
import { restdatoTildato } from "../utils/datoUtils";
import VedtakAnnullertLabel from "../components/vedtak/VedtakAnnullertLabel";
import VedtakInfopanel from "../components/vedtak/VedtakInfopanel";
import styled from "styled-components";
import { VEDTAK } from "../enums/menypunkter";
import { AlertStripeFeil } from "nav-frontend-alertstriper";

const texts = {
  pageTitle: "Vedtak",
  comingSoon: `
       Dette er en tidlig versjon av vedtakshistorikken. 
       Feil og mangler kan forekomme. Bruk Yammer til å komme med forslag og Porten til å melde feil. 
    `,
};

const StyledAlertStripe = styled(AlertStripeFeil)`
  margin: 0 0.5em 0.5em 0.5em;
`;

interface StyledPanelProps {
  readonly isActive: boolean;
}

const hvit = "#FFF";
const lysBla = "#CCE1F3";

const StyledPanel = styled(Panel)<StyledPanelProps>`
  background: ${(props) => (props.isActive ? lysBla : hvit)};
`;

const StyledButton = styled.button`
  margin: 0;
  margin-bottom: 0.5em;
  padding: 0;
  border: 0;
  background: 0;
  width: 100%;
  text-align: left;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`;

const FlexColInfo = styled.div`
  flex-grow: 1;
`;
const FlexColLabel = styled.div`
  flex-grow: 0;
`;

const VedtakContainer = () => {
  const fnr = window.location.pathname.split("/")[2];

  const vedtak = useSelector((state: any) => state.vedtak);
  const [selectedVedtak, setSelectedVedtak] = useState<VedtakDTO>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hentVedtak(fnr));
  });

  useEffect(() => {
    if (vedtak && vedtak.hentet) {
      vedtak.data.reverse();
      setSelectedVedtak(() => vedtak.data[0]);
    }
  }, [vedtak]);

  return (
    <Side fnr={fnr} tittel={texts.pageTitle} aktivtMenypunkt={VEDTAK}>
      <>
        <Row>
          <StyledAlertStripe>{texts.comingSoon}</StyledAlertStripe>
        </Row>
        {vedtak && selectedVedtak && (
          <Row>
            <Column className="col-xs-5">
              {vedtak.data.map((v: VedtakDTO) => (
                <StyledButton
                  onClick={() => {
                    setSelectedVedtak(v);
                  }}
                >
                  <StyledPanel isActive={v.id === selectedVedtak.id}>
                    <FlexRow>
                      <FlexColInfo>
                        <Undertittel>
                          {`${restdatoTildato(
                            v.vedtak.fom
                          )} - ${restdatoTildato(v.vedtak.tom)}`}
                        </Undertittel>
                        <Undertekst>
                          {`Vedtaksdato: ${restdatoTildato(
                            v.opprettet
                          )} · Restdager: ${v.vedtak.gjenståendeSykedager}`}
                        </Undertekst>
                      </FlexColInfo>
                      {v.annullert && (
                        <FlexColLabel>
                          <VedtakAnnullertLabel />
                        </FlexColLabel>
                      )}
                    </FlexRow>
                  </StyledPanel>
                </StyledButton>
              ))}
            </Column>
            <Column className="col-xs-7">
              <VedtakInfopanel selectedVedtak={selectedVedtak} />
            </Column>
          </Row>
        )}
      </>
    </Side>
  );
};

export default VedtakContainer;
