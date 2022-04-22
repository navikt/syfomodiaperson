import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import Lenke from "nav-frontend-lenker";
import React, { ReactElement } from "react";
import styled from "styled-components";

const texts = {
  oversikt: "Min oversikt",
  moter: "Mine møter",
};

const MinOversiktLenke = styled(Lenke)`
  margin-right: 2em;
`;

export const OversiktLenker = (): ReactElement => (
  <>
    <MinOversiktLenke href={fullNaisUrlIntern("syfooversikt", "/minoversikt")}>
      {texts.oversikt}
    </MinOversiktLenke>
    <Lenke href={fullNaisUrlIntern("syfomoteoversikt")}>{texts.moter}</Lenke>
  </>
);
