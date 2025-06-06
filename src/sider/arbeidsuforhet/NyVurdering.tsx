import React from "react";
import { Alert, BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import {
  typeTexts,
  VurderingResponseDTO,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  title: "Arbeidsuførhet",
  siste: "Siste vurdering",
  startNyVurderingButton: "Start ny vurdering",
};

const lastVurderingText = (vurderinger: VurderingResponseDTO[]) => {
  const lastVurdering = vurderinger[0];
  if (!lastVurdering) {
    return "Ingen vurderinger har blitt gjort, trykk på 'Start ny vurdering' for å sende forhåndsvarsel";
  }
  const lastForhandsvarsel = vurderinger.find(
    (vurdering) => vurdering.type === VurderingType.FORHANDSVARSEL
  );
  const lastVurderingType = typeTexts[lastVurdering.type].toLowerCase();

  return `Forrige forhåndsvarsel på 8-4 ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
    lastForhandsvarsel?.createdAt
  )} og ${lastVurderingType} ${tilLesbarDatoMedArUtenManedNavn(
    lastVurdering?.createdAt
  )}`;
};

interface Props {
  handleClick: () => void;
}

export default function NyVurdering({ handleClick }: Props) {
  const { data: vurderinger } = useGetArbeidsuforhetVurderingerQuery();
  const { notification } = useNotification();

  return (
    <>
      {notification && (
        <Alert variant="success" className="mb-2">
          {notification.message}
        </Alert>
      )}
      <Box background="surface-default" padding="6">
        <Heading className="mb-4" level="2" size="medium">
          {texts.siste}
        </Heading>
        <BodyShort className="mb-4">{`${lastVurderingText(
          vurderinger
        )}`}</BodyShort>
        <Button onClick={handleClick} variant="secondary">
          {texts.startNyVurderingButton}
        </Button>
      </Box>
    </>
  );
}
