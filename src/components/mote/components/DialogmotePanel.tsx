import React, { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import Panel from "nav-frontend-paneler";
import {
  FlexColumn,
  FlexRow,
  H2NoMargins,
  JustifyContentType,
  PaddingSize,
} from "../../Layout";

interface Props {
  icon: string;
  header: string;
  subtitle?: ReactNode;
  topRightElement?: ReactElement;
  children: ReactNode;
}

const StyledPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
  padding: 2em;
`;

const Icon = styled.img`
  margin-right: 1em;
  width: 3em;
`;

const DivRightAligned = styled.div`
  margin-left: auto;
`;

export const DialogmotePanel = ({
  icon,
  header,
  subtitle,
  topRightElement,
  children,
}: Props): ReactElement => {
  return (
    <StyledPanel>
      <FlexRow bottomPadding={PaddingSize.MD}>
        <Icon src={icon} alt="moteikon" />
        <FlexColumn justifyContent={JustifyContentType.CENTER}>
          <H2NoMargins>{header}</H2NoMargins>
          {typeof subtitle === "string" ? <p>{subtitle}</p> : subtitle}
        </FlexColumn>
        {topRightElement && (
          <DivRightAligned>{topRightElement}</DivRightAligned>
        )}
      </FlexRow>

      <>{children}</>
    </StyledPanel>
  );
};
