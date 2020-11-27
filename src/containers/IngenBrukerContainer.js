import React from "react";
import { connect } from "react-redux";
import { Container, Row, Column } from "nav-frontend-grid";
import Infomelding from "../components/Infomelding";

export const IngenBrukerSide = () => {
  return (
    <Container>
      <Row>
        <Column className="col-xs-12">
          <div style={{ width: "40em", margin: "0 auto" }}>
            <Infomelding
              tittel="Her mangler det fødselsnummer"
              melding="Det mangler eller er et ugyldig fødselsnummer. Skriv inn et gyldig fødselsnummer i menylinjen"
            />
          </div>
        </Column>
      </Row>
    </Container>
  );
};

export function mapStateToProps() {
  return {};
}

const IngenBrukerContainer = connect(mapStateToProps)(IngenBrukerSide);

export default IngenBrukerContainer;
