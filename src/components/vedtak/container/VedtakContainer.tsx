import * as React from "react";
import Side from "../../../sider/Side";
import styled from "styled-components";
import { VEDTAK } from "@/enums/menypunkter";
import { SpinnsynLenke } from "@/components/vedtak/SpinnsynLenke";
import Panel from "nav-frontend-paneler";
import { Normaltekst } from "nav-frontend-typografi";

const texts = {
  pageTitle: "Vedtak",
  info: "Denne lenken gir deg mer utfyllende og riktig informasjon enn vi tidligere kunne vise her i Modia.",
};

const VedtakPanel = styled(Panel)`
  padding: 2em;
`;

const InfoTekst = styled(Normaltekst)`
  margin-top: 0.75em;
`;

const VedtakContainer = () => (
  <Side tittel={texts.pageTitle} aktivtMenypunkt={VEDTAK}>
    <VedtakPanel>
      <SpinnsynLenke />
      <InfoTekst>{texts.info}</InfoTekst>
    </VedtakPanel>
  </Side>
);

export default VedtakContainer;
