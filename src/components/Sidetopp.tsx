import React from "react";
import { Heading } from "@navikt/ds-react";

const SIDETOPP_ID = "sidetopp";

interface Props {
  tittel: string;
  className?: string;
}

const Sidetopp = ({ tittel, className }: Props) => {
  return (
    <header>
      <Heading
        spacing
        size="large"
        id={SIDETOPP_ID}
        level="1"
        className={className}
      >
        {tittel}
      </Heading>
    </header>
  );
};

export default Sidetopp;
