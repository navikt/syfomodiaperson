import React from "react";
import { Heading } from "@navikt/ds-react";
import styled from "styled-components";

interface SidetoppProps {
  tittel: string;
}

const Sidetopp = ({ tittel }: SidetoppProps) => {
  const HeadingStyled = styled(Heading)`
    text-align: center;
  `;

  return (
    <header>
      <HeadingStyled spacing size="xlarge">
        {tittel}
      </HeadingStyled>
    </header>
  );
};

export default Sidetopp;
