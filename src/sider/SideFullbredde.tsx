import React, { ReactNode } from "react";
import { Column, Container, Row } from "nav-frontend-grid";
import Personkort from "../components/personkort/Personkort";
import DocumentTitle from "react-document-title";

interface SideFullbreddeProps {
  tittel: string;
  children?: ReactNode;
}

const Side = (sideFullbreddeProps: SideFullbreddeProps) => {
  const { tittel, children } = sideFullbreddeProps;

  return (
    <DocumentTitle
      title={tittel + (tittel.length > 0 ? " - Sykefravær" : "Sykefravær")}
    >
      <Container>
        <Row>
          <Column className="col-xs-12">
            <Personkort />
          </Column>
        </Row>
        <Row>
          <Column className="col-xs-12 col-sm-12">{children}</Column>
        </Row>
      </Container>
    </DocumentTitle>
  );
};

export default Side;
