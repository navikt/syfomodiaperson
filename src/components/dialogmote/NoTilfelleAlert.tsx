import React from "react";
import styled from "styled-components";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

const texts = {
  noTilfelleAlertInfo:
    "Vi kan ikke sende innkalling til dialogmøte til denne arbeidstakeren.",
  noTilfelleAlertReason: "Årsaken kan være at:",
  reasonNoSykmelding: "Det er mer enn 16 dager siden siste sykmelding gikk ut.",
  reasonNoActiveSykmelding:
    "Det er mottatt sykmelding, men arbeidstakeren har ikke sendt den til " +
    "arbeidsgiveren. For å sjekke dette gå til Sykmeldinger her i Modia. Under overskriften Nye Sykmeldinger finner" +
    " du sykmeldinger som arbeidstakeren ikke har tatt i bruk.",
};

const StyledList = styled.ul`
  margin-top: 0;
`;

const StyledListTitle = styled.p`
  margin-bottom: 0;
`;

const AdvarselStripe = styled(AlertstripeFullbredde)`
  margin-bottom: 2.5em;
`;

export const NoTilfelleAlert = (): React.ReactElement => (
  <AdvarselStripe type="feil">
    <p>{texts.noTilfelleAlertInfo}</p>
    <StyledListTitle>{texts.noTilfelleAlertReason}</StyledListTitle>
    <StyledList>
      <li>{texts.reasonNoSykmelding}</li>
      <li>{texts.reasonNoActiveSykmelding}</li>
    </StyledList>
  </AdvarselStripe>
);
