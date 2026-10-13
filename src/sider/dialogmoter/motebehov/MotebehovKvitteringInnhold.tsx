import { ReactElement, ReactNode } from "react";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { Box, HStack, VStack } from "@navikt/ds-react";
import { Skjemasvar } from "@/components/skjemasvar/Skjemasvar";
import {
  CheckmarkCircleFillIcon,
  MinusCircleFillIcon,
  QuestionmarkCircleFillIcon,
} from "@navikt/aksel-icons";

const setSvarIkon = (deltakerOnskerMote?: boolean): ReactNode => {
  switch (deltakerOnskerMote) {
    case true: {
      return (
        <CheckmarkCircleFillIcon
          title="a11y-title"
          fontSize="1.7rem"
          color="var(--ax-bg-success-strong)"
        />
      );
    }
    case false: {
      return (
        <MinusCircleFillIcon
          title="a11y-title"
          fontSize="1.7rem"
          color="var(--ax-bg-danger-strong)"
        />
      );
    }
    default: {
      return (
        <QuestionmarkCircleFillIcon
          title="a11y-title"
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
          <div className="w-6">{setSvarIkon(deltakerOnskerMote)}</div>
          <div>{tekst}</div>
        </HStack>
        {motebehov && (
          <Skjemasvar formSnapshot={motebehov.formValues.formSnapshot} />
        )}
      </VStack>
    </Box>
  );
}
