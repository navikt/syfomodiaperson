import React, { ReactNode } from "react";
import { Box } from "@navikt/ds-react";

interface ReferatInfoBoxProps {
  children: ReactNode;
}

export const ReferatInfoBox = ({ children }: ReferatInfoBoxProps) => (
  <Box
    borderRadius="4"
    background="neutral-soft"
    borderColor="neutral"
    padding="space-16"
    borderWidth="1"
  >
    {children}
  </Box>
);
