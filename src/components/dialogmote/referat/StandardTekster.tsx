import { Element, Normaltekst } from "nav-frontend-typografi";
import { Field } from "react-final-form";
import React, { ReactElement } from "react";
import { referatTexts, StandardTekst } from "@/data/dialogmote/dialogmoteTexts";
import styled from "styled-components";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import { ReferatInfoColumn } from "./ReferatInfoColumn";
import { Checkbox } from "nav-frontend-skjema";

const texts = {
  header: "Dette informerte NAV om i møtet",
  subHeader: "Velg bare de alternativene du faktisk informerte om i møtet.",
  info:
    "Det blir hentet opp standardtekster i referatet avhengig av hva du velger.",
};

const StandardTekstCheckbox = styled(Checkbox)`
  margin-bottom: 1.125em;
`;

const Header = styled(Element)`
  margin-bottom: 1em;
`;

const Subheader = styled(Normaltekst)`
  margin-bottom: 1em;
`;

export const StandardTekster = (): ReactElement => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <FlexColumn flex={1}>
      <Header>{texts.header}</Header>
      <Subheader>{texts.subHeader}</Subheader>
      {referatTexts.standardTekster.map((standardtekst, index) => (
        <Field<StandardTekst>
          key={index}
          name="standardtekster"
          type="checkbox"
          value={standardtekst}
        >
          {({ input }) => (
            <StandardTekstCheckbox
              {...input}
              value={standardtekst.text}
              label={standardtekst.label}
            />
          )}
        </Field>
      ))}
    </FlexColumn>
    <ReferatInfoColumn>
      <Normaltekst>{texts.info}</Normaltekst>
    </ReferatInfoColumn>
  </FlexRow>
);
