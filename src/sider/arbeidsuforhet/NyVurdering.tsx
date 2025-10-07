import React, { useState } from "react";
import { Alert, BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import {
  typeTexts,
  VurderingResponseDTO,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  Notification,
  useNotification,
} from "@/context/notification/NotificationContext";

const texts = {
  title: "Arbeidsuførhet",
  siste: "Siste vurdering",
  startNyVurderingButton: "Start ny vurdering",
};

const lastVurderingText = (vurderinger: VurderingResponseDTO[]) => {
  const lastVurdering = vurderinger[0];
  if (!lastVurdering) {
    return "Ingen vurderinger har blitt gjort.";
  }

  if (lastVurdering.type === VurderingType.FORHANDSVARSEL) {
    return `Forrige forhåndsvarsel på 8-4 ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
      lastVurdering?.createdAt
    )}`;
  } else {
    const lastVurderingType = typeTexts[lastVurdering.type].toLowerCase();
    return `Siste vurdering var ${lastVurderingType} og ble gjort ${tilLesbarDatoMedArUtenManedNavn(
      lastVurdering?.createdAt
    )}`;
  }
};

function NotificationAlert({
  notification,
  setIsNotificationVisible,
}: {
  notification: Notification;
  setIsNotificationVisible: (visible: boolean) => void;
}) {
  return (
    <Alert
      variant={
        notification.alertVariant ? notification.alertVariant : "success"
      }
      closeButton
      onClose={() => setIsNotificationVisible(false)}
      className="mb-2"
    >
      {notification.message}
    </Alert>
  );
}

interface Props {
  handleClick: () => void;
}

export default function NyVurdering({ handleClick }: Props) {
  const { data: vurderinger } = useGetArbeidsuforhetVurderingerQuery();
  const { notification } = useNotification();
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  return (
    <>
      {notification && isNotificationVisible && (
        <NotificationAlert
          notification={notification}
          setIsNotificationVisible={setIsNotificationVisible}
        />
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
