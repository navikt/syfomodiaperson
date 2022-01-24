import React from "react";
import { Column, Container, Row } from "nav-frontend-grid";
import Infomelding from "./Infomelding";
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
    <Container>
      <Row>
        <Column className="col-xs-12">
          <InfoWrapper>
            <Infomelding tittel={texts.title} melding={texts.melding} />
          </InfoWrapper>
        </Column>
      </Row>
    </Container>
  </>
);
