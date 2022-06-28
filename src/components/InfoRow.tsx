import styled from "styled-components";
import { PaddingSize } from "./Layout";
import React, { ReactElement } from "react";

interface Props {
  icon: string;
  iconAltText?: string;
  title: ReactElement;
  subtitle?: string;
}

const Icon = styled.img`
  margin-right: 1em;
  width: 1.5em;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: ${PaddingSize.SM};
`;

const InfoColumn = styled.div`
  display: flex
  flex-direction: column;
`;

const InfoTextRow = styled.div`
  display: flex;
`;

export const InfoRow = ({
  icon,
  iconAltText = "Ikon",
  title,
  subtitle,
}: Props) => {
  return (
    <InfoContainer>
      <Icon src={icon} alt={iconAltText} />
      <InfoColumn>
        {title}
        {subtitle && (
          <InfoTextRow>
            <i>{subtitle}</i>
          </InfoTextRow>
        )}
      </InfoColumn>
    </InfoContainer>
  );
};
