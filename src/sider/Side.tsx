import React, { ReactNode } from "react";
import styled from "styled-components";
import { Column, Container, Row } from "nav-frontend-grid";
import Personkort from "../components/personkort/Personkort";
import DocumentTitle from "react-document-title";
import { GlobalNavigasjon } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { isEaster } from "@/utils/festiveUtils";
import { Easter } from "@/components/Easter";

const StyledContainer = styled(Container)`
  width: 95%;
`;

interface SideProps {
  tittel: string;
  children?: ReactNode;
  aktivtMenypunkt: string;
}

const Side = (sideProps: SideProps) => {
  const { tittel, children, aktivtMenypunkt } = sideProps;

  return (
    <DocumentTitle
      title={tittel + (tittel.length > 0 ? " - Sykefravær" : "Sykefravær")}
    >
      <StyledContainer fluid>
        <Row>
          <Column className="col-xs-12">
            <Personkort />
          </Column>
        </Row>
        <Row>
          <nav className="col-xs-12 col-sm-3">
            <GlobalNavigasjon aktivtMenypunkt={aktivtMenypunkt} />
            {isEaster() && <Easter />}
          </nav>
          <Column className="col-xs-12 col-sm-9">{children}</Column>
        </Row>
      </StyledContainer>
    </DocumentTitle>
  );
};

export default Side;
