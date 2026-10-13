import { ReactElement, ReactNode } from "react";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { Box, HStack, VStack } from "@navikt/ds-react";
import { Skjemasvar } from "@/components/skjemasvar/Skjemasvar";
import {
  CheckmarkCircleFillIcon,
  MinusCircleFillIcon,
  QuestionmarkCircleFillIcon,
} from "@navikt/aksel-icons";

const setSvarIkon = (
  deltakerOnskerMote: boolean | undefined,
  ikonAltTekst: string,
): ReactNode => {
  switch (deltakerOnskerMote) {
    case true: {
      return (
        <CheckmarkCircleFillIcon
          title={ikonAltTekst}
          fontSize="1.7rem"
          color="var(--ax-bg-success-strong)"
        />
      );
    }
    case false: {
      return (
        <MinusCircleFillIcon
          title={ikonAltTekst}
          fontSize="1.7rem"
          color="var(--ax-bg-danger-strong)"
        />
      );
    }
    default: {
      return (
        <QuestionmarkCircleFillIcon
          title={ikonAltTekst}
          fontSize="1.7rem"
          color="var(--ax-bg-neutral-strong)"
        />
      );
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
    <Box padding={"space-12"}>
      <VStack gap={"space-16"}>
        <HStack gap={"space-12"} align="center">
          {setSvarIkon(deltakerOnskerMote, ikonAltTekst)}
          {tekst}
        </HStack>
        {motebehov && (
          <Skjemasvar formSnapshot={motebehov.formValues.formSnapshot} />
        )}
      </VStack>
    </Box>
  );
}
