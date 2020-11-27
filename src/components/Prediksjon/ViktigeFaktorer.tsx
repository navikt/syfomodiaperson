import * as React from "react";
import styled from "styled-components";
import { Prediksjon } from "../../reducers/prediksjon";
import FaktorerBox from "./FaktorerBox";

interface ViktigeFaktorerProps {
  prediksjon: Prediksjon;
}

const ViktigeFaktorerWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  border: gray solid 1px;
  border-radius: 0.5em;
  margin-bottom: 1em;
`;

const ViktigeFaktorer = ({ prediksjon }: ViktigeFaktorerProps) => {
  return (
    <ViktigeFaktorerWrapper>
      <FaktorerBox ned={false} faktorer={prediksjon.lengreVarighetGrunner} />
      <FaktorerBox ned faktorer={prediksjon.kortereVarighetGrunner} />
    </ViktigeFaktorerWrapper>
  );
};

export default ViktigeFaktorer;
