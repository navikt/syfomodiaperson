import { PersonIcon } from "@navikt/aksel-icons";
import { Heading, HStack } from "@navikt/ds-react";
import React from "react";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";

export const DeltakerArbeidstakerHeading = () => {
  const navbruker = useNavBrukerData();

  return (
    <HStack gap="2" className="pl-4">
      <PersonIcon role="img" focusable={false} width={24} height={24} />
      <Heading size="small">{`Arbeidstaker: ${navbruker?.navn}`}</Heading>
    </HStack>
  );
};
