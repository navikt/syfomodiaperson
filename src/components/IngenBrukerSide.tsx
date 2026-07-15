import React from "react";
import { Infomelding } from "./Infomelding";
import Decorator from "../decorator/Decorator";
import styled from "styled-components";

const texts = {
  title: "Her mangler det fødselsnummer",
  melding:
    "Det mangler eller er et ugyldig fødselsnummer. Skriv inn et gyldig fødselsnummer i menylinjen",
};

const InfoWrapper = styled.div`
  width: 40em;
  margin: 0 auto;
`;

export const IngenBrukerSide = () => (
  <>
    <Decorator />
    <InfoWrapper>
      <Infomelding tittel={texts.title} melding={texts.melding} />
    </InfoWrapper>
  </>
);
