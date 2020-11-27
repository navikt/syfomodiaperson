import * as React from "react";
import styled from "styled-components";

interface FaktorerBoxProps {
  faktorer: string[];
  ned: boolean;
}

const texts = {
  opp: "Dette trekker varigheten opp",
  ned: "Dette trekker varigheten ned",
};

const FaktorTittel = styled.p`
  font-weight: bold;
  margin-bottom: 0;
  margin-left: 0.5em;
  margin-top: 0.5em;
`;

const List = styled.ol`
  margin-top: 0.5em;
  padding-left: 1.5em;
`;

const ListWrapper = styled.div`
  display: flex;
`;

const PilIkon = styled.img`
  margin-left: 0.5em;
`;

const FaktorerBox = ({ faktorer, ned }: FaktorerBoxProps) => {
  const arrowDirection = ned ? "down" : "up";

  return (
    <div>
      <FaktorTittel>{ned ? texts.ned : texts.opp}</FaktorTittel>
      <ListWrapper>
        <PilIkon
          alt="pil-ned"
          src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/arrow-with-line__${arrowDirection}--blue.svg`}
        />
        <List>
          <li>{faktorer[0]}</li>
          <li>{faktorer[1]}</li>
          <li>{faktorer[2]}</li>
        </List>
      </ListWrapper>
    </div>
  );
};

export default FaktorerBox;
