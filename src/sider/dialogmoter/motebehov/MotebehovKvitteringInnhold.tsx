import React, { ReactElement } from "react";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import {
  MotebehovIkkeSvartImage,
  MotebehovKanIkkeImage,
  MotebehovKanImage,
} from "../../../../img/ImageComponents";
import { Box, HStack, VStack } from "@navikt/ds-react";
import { MotebehovSkjemasvar } from "@/sider/dialogmoter/motebehov/skjema/MotebehovSkjemasvar";

const setSvarIkon = (deltakerOnskerMote?: boolean): string => {
  switch (deltakerOnskerMote) {
    case true: {
      return MotebehovKanImage;
    }
    case false: {
      return MotebehovKanIkkeImage;
    }
    default: {
      return MotebehovIkkeSvartImage;
    }
  }
};

interface Props {
  deltakerOnskerMote?: boolean;
  ikonAltTekst: string;
  motebehov?: MotebehovVeilederDTO;
  tekst: ReactElement;
}

export default function MotebehovKvitteringInnhold({
  deltakerOnskerMote,
  ikonAltTekst,
  motebehov,
  tekst,
}: Props) {
  return (
    <Box padding={"3"} borderRadius={"medium"} shadow={"medium"}>
      <VStack gap={"4"}>
        <HStack>
          <img
            src={setSvarIkon(deltakerOnskerMote)}
            alt={ikonAltTekst}
            className="mr-4 w-6"
          />
          <div>{tekst}</div>
        </HStack>
        {motebehov && <MotebehovSkjemasvar motebehov={motebehov} />}
      </VStack>
    </Box>
  );
}
