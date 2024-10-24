import { MedisinskrinImage } from "../../../../../img/ImageComponents";
import { Heading, HStack } from "@navikt/ds-react";
import React from "react";

interface Props {
  children: string;
}

export const DeltakerBehandlerHeading = ({ children }: Props) => {
  return (
    <HStack gap="2">
      <img
        role="img"
        width={24}
        height={24}
        src={MedisinskrinImage}
        alt="Medisinskrin-ikon"
      />
      <Heading size="small">{children}</Heading>
    </HStack>
  );
};
