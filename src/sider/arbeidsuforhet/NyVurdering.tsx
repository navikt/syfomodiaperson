import { useState } from "react";
import { BodyShort, Box, Button, Heading, LocalAlert } from "@navikt/ds-react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import {
  typeTexts,
  VurderingResponseDTO,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { formatNumericDate } from "@/utils/datoUtils";
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
    return `Forrige forhåndsvarsel på 8-4 ble sendt ut ${formatNumericDate(
      lastVurdering?.createdAt,
    )}`;
  } else {
    const lastVurderingType = typeTexts[lastVurdering.type].toLowerCase();
    return `Siste vurdering var ${lastVurderingType} og ble gjort ${formatNumericDate(
      lastVurdering?.createdAt,
    )}`;
  }
};

interface NotificationAlertProps {
  notification: Notification;
  onClose: () => void;
}

function NotificationAlert({ notification, onClose }: NotificationAlertProps) {
  return (
    <LocalAlert status={notification.alertStatus ?? "success"} className="mb-2">
      <LocalAlert.Header>
        <LocalAlert.Title>{notification.message}</LocalAlert.Title>
        <LocalAlert.CloseButton onClick={onClose} />
      </LocalAlert.Header>
      {notification.content && (
        <LocalAlert.Content>{notification.content}</LocalAlert.Content>
      )}
    </LocalAlert>
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
          onClose={() => setIsNotificationVisible(false)}
        />
      )}
      <Box background="default" padding="space-24">
        <Heading className="mb-4" level="2" size="medium">
          {texts.siste}
        </Heading>
        <BodyShort className="mb-4">{`${lastVurderingText(
          vurderinger,
        )}`}</BodyShort>
        <Button onClick={handleClick} variant="secondary">
          {texts.startNyVurderingButton}
        </Button>
      </Box>
    </>
  );
}
