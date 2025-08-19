import React from "react";
import { Alert, Box, Button, Heading } from "@navikt/ds-react";

import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  title: "Arbeidsuførhet",
  siste: "Siste vurdering",
  startNyVurderingButton: "Start ny vurdering",
};

interface Props {
  handleClick: () => void;
}

export default function NyVurdering({ handleClick }: Props) {
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
        <Button onClick={handleClick} variant="secondary">
          {texts.startNyVurderingButton}
        </Button>
      </Box>
    </>
  );
}
