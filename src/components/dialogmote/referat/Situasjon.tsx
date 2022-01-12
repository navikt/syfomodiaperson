import React, { ReactElement } from "react";
import { FlexRow, PaddingSize } from "../../Layout";
import { Normaltekst } from "nav-frontend-typografi";
import { ReferatInfoColumn } from "./ReferatInfoColumn";
import { ReferatTextareaFieldColumn } from "./ReferatTextareaFieldColumn";

export const MAX_LENGTH_SITUASJON = 3500;

const texts = {
  label: "Situasjon og muligheter",
  placeholder: "Skriv hva deltakerne forteller om situasjonen",
  infoboks: {
    eksempler: "Eksempler:",
    jobb: "Hvordan har det gått å prøve seg i jobb?",
    tilrettelegging: "Hvordan har tilretteleggingen fungert?",
    mer: "Er det noe mer som kan gjøres?",
    framover: "Hva ser man for seg framover?",
    husk:
      "Husk å skrive i du-form, referatet er rettet mot arbeidstakeren selv om det går til flere.",
  },
};

export const Situasjon = (): ReactElement => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <ReferatTextareaFieldColumn
      size="ekstra-stor"
      fieldName="situasjon"
      label={texts.label}
      placeholder={texts.placeholder}
      maxLength={MAX_LENGTH_SITUASJON}
    />
    <ReferatInfoColumn>
      <Normaltekst>{texts.infoboks.eksempler}</Normaltekst>
      <Normaltekst>{texts.infoboks.jobb}</Normaltekst>
      <Normaltekst>{texts.infoboks.tilrettelegging}</Normaltekst>
      <Normaltekst>{texts.infoboks.mer}</Normaltekst>
      <Normaltekst>{texts.infoboks.framover}</Normaltekst>
      <br />
      <Normaltekst>{texts.infoboks.husk}</Normaltekst>
    </ReferatInfoColumn>
  </FlexRow>
);
