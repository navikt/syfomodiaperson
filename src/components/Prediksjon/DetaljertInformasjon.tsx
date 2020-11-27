import * as React from "react";
import styled from "styled-components";
import TextDropdown from "../TextDropdown";

interface FaktorParagrafProps {
  faktor: string;
}

interface FaktorerInfoProps {
  faktorer: string[];
}

interface DetaljertInformasjonProps {
  kortereFaktorer: string[];
  lengreFaktorer: string[];
}

const texts = {
  buttonTitle: "Detaljert informasjon",
  header: "Om faktorene",
};

type faktorForklaringerType = { [index: string]: string[] };

const faktorForklaringer: faktorForklaringerType = {
  Sykmeldingsgrad: [
    "graden som brukes i sykmeldingen ved uke 17",
    "gjennomsnittlig sykmeldingsgrad fram til uke 17",
    "forholdet mellom sykmeldingsgraden i siste og nest siste sykmelding",
  ],
  Bosted: [
    "kommunenummer",
    "gjennomsnittlig lengde på sykefravær for innbyggerne i kommunen",
    "arbeidsledighet i kommunen måneden før personen har vært sykmeldt i 17 uker",
  ],
  Yrke: [
    "personens yrke",
    "andre registrerte yrker",
    "gjennomsnittlig lengde på sykefraværet per yrke",
  ],
  Alder: ["aldersgrupper", "personens fødselsår"],
  Diagnose: [
    "hoveddiagnose (icpc og icd)",
    "symptom eller diagnose ved uke 17",
    "hoveddiagnosen med lengst varighet i personens tidligere sykefravær",
  ],
  Lege: [
    "legens alder",
    "landsgjennomsnittet av lengden på sykmeldinger ved denne diagnosen",
    "avviket mellom lengden på denne sykmeldingen og landsgjennomsnittet",
  ],
};

const BoldText = styled.p`
  font-weight: bold;
  margin-bottom: 0;
`;

const List = styled.ul`
  margin-bottom: 0.5em;
  margin-top: 0;
`;

const FaktorParagraf = ({ faktor }: FaktorParagrafProps) => {
  const forklaringForUsedFaktorer = faktorForklaringer[faktor];
  return (
    <>
      <BoldText>{faktor}</BoldText>
      <List>
        {forklaringForUsedFaktorer.map((item: string, index: number) => {
          return <li key={index}>{item}</li>;
        })}
      </List>
    </>
  );
};

const FaktorerInfo = ({ faktorer }: FaktorerInfoProps) => {
  return (
    <>
      {faktorer.map((faktor: string, index: number) => {
        return (
          faktorForklaringer[faktor] && (
            <FaktorParagraf key={index} faktor={faktor} />
          )
        );
      })}
    </>
  );
};

const DetaljertInformasjon = ({
  kortereFaktorer,
  lengreFaktorer,
}: DetaljertInformasjonProps) => {
  return (
    <div>
      <TextDropdown title={texts.buttonTitle}>
        <h4>{texts.header}</h4>
        <FaktorerInfo faktorer={lengreFaktorer} />
        <FaktorerInfo faktorer={kortereFaktorer} />
      </TextDropdown>
    </div>
  );
};

export default DetaljertInformasjon;
