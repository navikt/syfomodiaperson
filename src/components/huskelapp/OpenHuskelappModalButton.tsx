import { Button } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";

const texts = {
  openModal: "Åpne huskelapp",
};

const StyledButton = styled(Button)`
  margin-bottom: 0.5em;
`;

export const OpenHuskelappModalButton = () => {
  return <StyledButton variant="secondary">{texts.openModal}</StyledButton>;
};
