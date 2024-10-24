import React, { ReactNode } from "react";
import { Box } from "@navikt/ds-react";

interface ReferatInfoBoxProps {
  children: ReactNode;
}

export const ReferatInfoBox = ({ children }: ReferatInfoBoxProps) => (
  <Box
    borderRadius="medium"
    background="surface-subtle"
    borderColor="border-default"
    padding="4"
    borderWidth="1"
  >
    {children}
  </Box>
);
