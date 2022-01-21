import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Column, Row } from "nav-frontend-grid";
import { AlertStripeInfo } from "nav-frontend-alertstriper";
import Side from "../../../sider/Side";
import VedtakInfopanel from "../VedtakInfopanel";
import styled from "styled-components";
import { VEDTAK } from "@/enums/menypunkter";
import VedtakUnselected from "../VedtakUnselected";
import VedtakColumn from "../VedtakColumn";
import VedtakInfoBox from "../VedtakInfoBox";
import { sjekkTilgang } from "@/data/tilgang/tilgang_actions";
import { MappeAdvarselImage } from "../../../../img/ImageComponents";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import SideLaster from "../../SideLaster";
import { VedtakDTO } from "@/data/vedtak/vedtakTypes";
import { useVedtakQuery } from "@/data/vedtak/vedtakQueryHooks";

const texts = {
  pageTitle: "Vedtak",
  noVedtak: "Denne personen har ingen vedtak",
  comingSoon: `
       Dette er en tidlig versjon av vedtakshistorikken. 
       Feil og mangler kan forekomme. Bruk Yammer til å komme med forslag og Porten til å melde feil. 
    `,
};

const StyledAlertStripe = styled(AlertStripeInfo)`
  margin: 0 0.5em 0.5em 0.5em;
`;

const VedtakContainer = () => {
  const fnr = useValgtPersonident();
  const { isLoading, isError, data: vedtakListe } = useVedtakQuery();
  const harVedtak = vedtakListe && vedtakListe.length > 0;

  const [selectedVedtak, setSelectedVedtak] = useState<VedtakDTO>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(sjekkTilgang(fnr));
  }, [dispatch, fnr]);

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={VEDTAK}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Row>
          <StyledAlertStripe>{texts.comingSoon}</StyledAlertStripe>
        </Row>
        <Row>
          {harVedtak && (
            <VedtakColumn
              data={vedtakListe || []}
              selectedVedtak={selectedVedtak}
              setSelectedVedtak={setSelectedVedtak}
            />
          )}

          {selectedVedtak && (
            <Column className="col-xs-7">
              <VedtakInfopanel selectedVedtak={selectedVedtak} />
            </Column>
          )}

          {!selectedVedtak && harVedtak && <VedtakUnselected />}
          {!harVedtak && (
            <VedtakInfoBox title={texts.noVedtak} icon={MappeAdvarselImage} />
          )}
        </Row>
      </SideLaster>
    </Side>
  );
};

export default VedtakContainer;
