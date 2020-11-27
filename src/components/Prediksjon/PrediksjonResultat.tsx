import * as React from "react";
import styled from "styled-components";
import { Prediksjon } from "../../reducers/prediksjon";
import { tilDatoMedUkedagOgManedNavn } from "../../utils/datoUtils";

interface PrediksjonResultatProps {
  prediksjon: Prediksjon;
}

interface ResultTextProps {
  langt: boolean;
  certainty: number;
}

interface CalculationTextProps {
  prediksjonsDato: string;
}

const ResultatWrapper = styled.div`
  margin-bottom: 1em;
`;

const TextWithBottomMargin = styled.p`
  margin-bottom: 0.5em;
`;

const ResultText = ({ langt, certainty }: ResultTextProps) => {
  const yesOrNo = langt ? "Ja" : "Nei";

  return (
    <TextWithBottomMargin>
      {`${yesOrNo}, med `} <b>{`${certainty}%`}</b> {" sannsynlighet"}
    </TextWithBottomMargin>
  );
};

const CalculationText = ({ prediksjonsDato }: CalculationTextProps) => {
  return (
    <p>{`Utregningen ble gjort ${tilDatoMedUkedagOgManedNavn(
      prediksjonsDato
    )}`}</p>
  );
};

const PrediksjonResultat = ({ prediksjon }: PrediksjonResultatProps) => {
  return (
    <ResultatWrapper>
      <ResultText
        langt={prediksjon.langt}
        certainty={prediksjon.treffsikkerhetProsent}
      />
      <CalculationText prediksjonsDato={prediksjon.prediksjonsDato} />
    </ResultatWrapper>
  );
};

export default PrediksjonResultat;
