import React, { ComponentProps } from "react";
import { Loader } from "@navikt/ds-react";
import styled from "styled-components";

const SpinnerRow = styled.div<{ isSmall?: boolean }>`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => (props.isSmall ? "0.5em" : "4em")};

  > * {
    &:not(:last-child) {
      margin-right: 0.25em;
    }
  }
`;

const AppSpinner = ({
  size = "2xlarge",
  ...rest
}: ComponentProps<typeof Loader>) => {
  return (
    <SpinnerRow
      isSmall={size === "small"}
      aria-label="Vent litt mens siden laster"
    >
      <Loader size={size} title="Venter..." {...rest}>
        Vent litt mens siden laster
      </Loader>
    </SpinnerRow>
  );
};

export default AppSpinner;
