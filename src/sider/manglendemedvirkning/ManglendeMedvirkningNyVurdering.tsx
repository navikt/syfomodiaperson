import React, { ReactElement } from "react";
import { useNotification } from "@/context/notification/NotificationContext";
import { Alert, BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  typeTexts,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";

const texts = {
  title: "Arbeidsuførhet",
  siste: "Siste vurdering",
  button: "Start ny vurdering",
};

const lastVurderingText = (vurderinger: VurderingResponseDTO[]) => {
  const lastVurdering = vurderinger[0];
  if (!lastVurdering) {
    return "Ingen vurderinger har blitt gjort, trykk på 'Start ny vurdering' for å sende forhåndsvarsel.";
  }
  const lastForhandsvarsel = vurderinger.find(
    ({ vurderingType }) => vurderingType === VurderingType.FORHANDSVARSEL
  );
  const lastVurderingType =
    typeTexts[lastVurdering.vurderingType].toLowerCase();

  return `Forrige forhåndsvarsel på § 8-8 ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
    lastForhandsvarsel?.createdAt
  )} og det ble vurdert ${lastVurderingType} ${tilLesbarDatoMedArUtenManedNavn(
    lastVurdering?.createdAt
  )}.`;
};

interface Props {
  handleClick: () => void;
}

export const ManglendeMedvirkningNyVurdering = ({
  handleClick,
}: Props): ReactElement => {
  const { data } = useManglendemedvirkningVurderingQuery();
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
        <BodyShort className="mb-4">{`${lastVurderingText(data)}`}</BodyShort>
        <Button onClick={handleClick} variant="secondary">
          {texts.button}
        </Button>
      </Box>
    </>
  );
};
