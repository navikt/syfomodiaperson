import React, { ReactNode } from "react";
import { Column, Container, Row } from "nav-frontend-grid";
import { Personkort } from "../personkort/Personkort";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface Props {
  tittel: string;
  children?: ReactNode;
}

export default function SideFullbredde(sideFullbreddeProps: Props) {
  const { tittel, children } = sideFullbreddeProps;

  useDocumentTitle(tittel);

  return (
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
  );
}
