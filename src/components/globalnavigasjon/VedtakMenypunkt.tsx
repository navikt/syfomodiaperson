import React from "react";
import Lenke from "nav-frontend-lenker";
import styled from "styled-components";
import { spinnsynUrl } from "@/components/vedtak/SpinnsynLenke";
import { ExternalLinkIcon } from "@navikt/aksel-icons";

interface VedtakMenypunktProps {
  index: number;
  navn: string;
}

const LenkeWithoutUnderlinedText = styled(Lenke)`
  text-decoration: none;
`;

export const VedtakMenypunkt = ({ index, navn }: VedtakMenypunktProps) => {
  return (
    <li key={index} className="navigasjon__element">
      <LenkeWithoutUnderlinedText
        className="navigasjonspanel"
        href={spinnsynUrl()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="navigasjon__element__tekst">{navn}</span>
        <ExternalLinkIcon fontSize="1.5em" />
      </LenkeWithoutUnderlinedText>
    </li>
  );
};
