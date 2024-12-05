import React, { ReactElement } from "react";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import {
  MotebehovIkkeSvartImage,
  MotebehovKanIkkeImage,
  MotebehovKanImage,
} from "../../../../img/ImageComponents";
import { VStack } from "@navikt/ds-react";

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
    <div className="flex items-center mt-4">
      <img
        src={setSvarIkon(deltakerOnskerMote)}
        alt={ikonAltTekst}
        className="mr-4 w-6"
      />
      <VStack>
        {tekst}
        {motebehov?.motebehovSvar?.forklaring && (
          <VStack>
            <i>{motebehov?.motebehovSvar?.forklaring}</i>
          </VStack>
        )}
      </VStack>
    </div>
  );
}
