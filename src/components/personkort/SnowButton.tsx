import React from "react";
import { startSnow, stopAndHideSnow } from "@/utils/festiveUtils";
import Knapp from "nav-frontend-knapper";
import styled from "styled-components";

const texts = {
  letItSnow: "La det snø",
};

const StyledButton = styled(Knapp)`
  margin-left: auto;
  align-self: center;
  margin-right: 0;
  padding: 0 0.5em;
`;

const SnowButton = () => {
  const clickButton = () => {
    startSnow();
    setTimeout(() => {
      stopAndHideSnow();
    }, 10000);
  };

  return (
    <StyledButton onClick={clickButton} mini>
      {texts.letItSnow}
    </StyledButton>
  );
};

export default SnowButton;
