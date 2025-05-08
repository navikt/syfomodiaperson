import { Box } from "@navikt/ds-react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Card = ({ children }: Props) => {
  return (
    <Box background={"bg-subtle"} borderRadius={"large"} padding={"4"}>
      {children}
    </Box>
  );
};
