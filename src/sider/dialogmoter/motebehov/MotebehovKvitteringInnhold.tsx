import React, { ReactElement } from "react";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import {
  MotebehovIkkeSvartImage,
  MotebehovKanIkkeImage,
  MotebehovKanImage,
} from "../../../../img/ImageComponents";
import { Box, HStack, Textarea, VStack } from "@navikt/ds-react";

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

const texts = {
  begrunnelse: "Begrunnelse",
  sykmelder: "Hvorfor ønsker du at leg/behandler deltar i møtet?",
  tolk: "Hva slags tolk har dere behov for?",
};

export default function MotebehovKvitteringInnhold({
  deltakerOnskerMote,
  ikonAltTekst,
  motebehov,
  tekst,
}: Props) {
  return (
    <Box
      background={"surface-alt-3-subtle"}
      padding={"3"}
      className={"[&>*:not(:last-child)]:mb-4"}
    >
      <HStack>
        <img
          src={setSvarIkon(deltakerOnskerMote)}
          alt={ikonAltTekst}
          className="mr-4 w-6"
        />
        <VStack>
          <div>{tekst}</div>
        </VStack>
      </HStack>

      {motebehov?.formValues.begrunnelse && (
        <Textarea
          label={texts.sykmelder}
          readOnly={true}
          value={motebehov?.formValues.begrunnelse}
          minRows={1}
        />
      )}

      {motebehov?.formValues.onskerSykmelderDeltar &&
        motebehov?.formValues.onskerSykmelderDeltarBegrunnelse && (
          <Textarea
            label={texts.sykmelder}
            readOnly={true}
            value={motebehov?.formValues.onskerSykmelderDeltarBegrunnelse}
            minRows={1}
          />
        )}

      {motebehov?.formValues.onskerTolk && motebehov?.formValues.tolkSprak && (
        <Textarea
          label={texts.tolk}
          readOnly={true}
          value={motebehov.formValues.tolkSprak}
          minRows={1}
        />
      )}
    </Box>
  );
}
