import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import Lenke from "nav-frontend-lenker";
import React, { ReactElement } from "react";
import styled from "styled-components";

const texts = {
  oversikt: "Min oversikt",
  moter: "Mine møter",
  enhetensOversikt: "Enhetens oversikt",
};

const StyledLenkeRad = styled.div`
  > * {
    &:not(:last-child) {
      margin-right: 2em;
    }
  }
`;

export const OversiktLenker = (): ReactElement => (
  <StyledLenkeRad>
    <Lenke href={fullNaisUrlIntern("syfooversikt", "/minoversikt")}>
      {texts.oversikt}
    </Lenke>
    <Lenke href={fullNaisUrlIntern("syfooversikt", "/enhet")}>
      {texts.enhetensOversikt}
    </Lenke>
    <Lenke href={fullNaisUrlIntern("syfomoteoversikt")}>{texts.moter}</Lenke>
  </StyledLenkeRad>
);
