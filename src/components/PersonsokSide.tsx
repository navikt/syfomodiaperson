import React from "react";
import { Infomelding } from "./Infomelding";
import styled from "styled-components";

const texts = {
  title: "Søk på person",
  melding: "Søk på en person. Skriv inn et gyldig fødselsnummer i menylinjen",
};

const InfoWrapper = styled.div`
  width: 40em;
  margin: 0 auto;
`;

export const PersonsokSide = () => (
  <InfoWrapper>
    <Infomelding tittel={texts.title} melding={texts.melding} />
  </InfoWrapper>
);
