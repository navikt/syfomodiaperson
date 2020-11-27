import * as React from "react";
import styled from "styled-components";

const PrikkWrapper = styled.div`
  margin-left: auto;
  align-self: center;
`;

const MotelandingssidePrikk = () => {
  return (
    <PrikkWrapper>
      <i className="antallNytt">{1}</i>
    </PrikkWrapper>
  );
};

export default MotelandingssidePrikk;
