import * as React from "react";
import styled from "styled-components";
import Hjelpetekst from "nav-frontend-hjelpetekst";

const texts = {
  title: "Vil den sykmeldte fortsatt være sykmeldt etter uke 26?",
  info: {
    title: "Om beregningen",
    subtitle:
      "Hvordan beregner vi hvor lenge sykefraværet sannsynligvis vil vare?",
    factors:
      "I modellen bruker vi data fra sykmeldingen: sykmeldingsgraden, bostedet, yrket, alderen, diagnosen, legen og arbeidsgiveren.",
    comparison:
      "Når modellen beregner sannsynligheten for at personen blir friskmeldt, baserer den seg på tilsvarende data fra alle som tidligere har vært sykmeldt i minst 17 uker. Vi sammenlikner altså personen med alle andre sykmeldte.",
    week17:
      "Uke 17 er valgt for at du kan bruke resultatet når du skal beslutte om dialogmøte 2 er nødvendig. Du får se de tre viktigste faktorene som trekker sannsynligheten opp, og de tre viktigste faktorene som trekker den ned.",
  },
};

const PrediksjontittelHeader = styled.h3`
  margin: 0;
`;

const BoldText = styled.p`
  font-weight: bold;
`;

const InfoText = () => {
  return (
    <>
      <BoldText>{texts.info.title}</BoldText>
      <BoldText>{texts.info.subtitle}</BoldText>
      <p>{texts.info.factors}</p>
      <p>{texts.info.comparison}</p>
      <p>{texts.info.week17}</p>
    </>
  );
};

const TittelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
`;
const Prediksjontittel = () => {
  return (
    <TittelWrapper>
      <PrediksjontittelHeader>{texts.title}</PrediksjontittelHeader>
      <Hjelpetekst type="under" id="1">
        <InfoText />
      </Hjelpetekst>
    </TittelWrapper>
  );
};

export default Prediksjontittel;
