import React from "react";
import { PersonPencilIcon } from "@navikt/aksel-icons";
import { Heading, HStack } from "@navikt/ds-react";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

export const DeltakerNavHeading = () => {
  const { data: veilederinfo } = useAktivVeilederinfoQuery();

  return (
    <HStack gap="2" className="pl-4">
      <PersonPencilIcon role="img" focusable={false} width={24} height={24} />
      <Heading size="small">{`Fra Nav: ${veilederinfo?.fulltNavn()}`}</Heading>
    </HStack>
  );
};
