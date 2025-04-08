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
  sykmelder: "Hvorfor ønsker du at lege/behandler deltar i møtet?",
  tolk: "Hva slags tolk har dere behov for?",
};

interface MotebehovSvarProps {
  motebehov: MotebehovVeilederDTO;
}

export const MotebehovSvar = ({
  motebehov: {
    formValues: {
      begrunnelse,
      onskerSykmelderDeltar,
      onskerSykmelderDeltarBegrunnelse,
      onskerTolk,
      tolkSprak,
    },
  },
}: MotebehovSvarProps) => (
  <>
    {begrunnelse && (
      <Textarea
        label={texts.begrunnelse}
        value={begrunnelse}
        readOnly={true}
        minRows={1}
      />
    )}

    {onskerSykmelderDeltar && onskerSykmelderDeltarBegrunnelse && (
      <Textarea
        label={texts.sykmelder}
        value={onskerSykmelderDeltarBegrunnelse}
        readOnly={true}
        minRows={1}
      />
    )}

    {onskerTolk && tolkSprak && (
      <Textarea
        label={texts.tolk}
        value={tolkSprak}
        readOnly={true}
        minRows={1}
      />
    )}
  </>
);

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
      borderRadius={"medium"}
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
      {motebehov && <MotebehovSvar motebehov={motebehov} />}
    </Box>
  );
}
