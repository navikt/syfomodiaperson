import React, { ReactElement } from "react";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  VStack,
} from "@navikt/ds-react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  typeTexts,
  VurderingResponseDTO,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useNotification } from "@/context/notification/NotificationContext";
import { Link } from "react-router-dom";
import {
  arbeidsuforhetForhandsvarselPath,
  arbeidsuforhetOppfyltPath,
} from "@/routers/AppRouter";

const texts = {
  title: "Arbeidsuførhet",
  siste: "Siste vurdering",
  forhandsvarselButton: "Send forhåndsvarsel",
  oppfyltButton: "Oppfylt",
  noVurderinger:
    "Ingen vurderinger har blitt gjort. Trykk på knappene under for å sende forhåndsvarsel eller skrive innstilling om oppfylt vilkår", // TODO: Avklar tekst
};

const lastVurderingText = (vurderinger: VurderingResponseDTO[]) => {
  const lastVurdering = vurderinger[0];
  if (!lastVurdering) {
    return texts.noVurderinger;
  }
  const lastVurderingType = typeTexts[lastVurdering.type];

  // TODO: Avklar tekst
  return `Forrige vurdering av §8-4: ${lastVurderingType} den ${tilLesbarDatoMedArUtenManedNavn(
    lastVurdering?.createdAt
  )}`;
};

export const NyVurdering = (): ReactElement => {
  const { data: vurderinger } = useGetArbeidsuforhetVurderingerQuery();
  const { notification } = useNotification();

  return (
    <>
      {notification && <Alert variant="success">{notification.message}</Alert>}
      <Box background="surface-default" padding="6">
        <VStack gap="4">
          <Heading level="2" size="medium">
            {texts.siste}
          </Heading>
          <BodyShort>{`${lastVurderingText(vurderinger)}`}</BodyShort>
          <HStack gap="4">
            <Button
              as={Link}
              to={arbeidsuforhetForhandsvarselPath}
              variant="primary"
            >
              {texts.forhandsvarselButton}
            </Button>
            <Button
              as={Link}
              to={arbeidsuforhetOppfyltPath}
              variant="secondary"
            >
              {texts.oppfyltButton}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </>
  );
};
