import { PersonSuitIcon } from "@navikt/aksel-icons";
import React from "react";
import { Heading, HStack } from "@navikt/ds-react";

interface Props {
  children: string;
}

export const DeltakerArbeidsgiverHeading = ({ children }: Props) => {
  return (
    <HStack gap="2">
      <PersonSuitIcon role="img" focusable={false} width={24} height={24} />
      <Heading size="small">{children}</Heading>
    </HStack>
  );
};
