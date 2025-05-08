import React, { ReactElement } from "react";
import {
  Notification,
  useNotification,
} from "@/context/notification/NotificationContext";
import { Alert, Heading } from "@navikt/ds-react";

interface Props {
  notification: Notification | undefined;
  onClose: () => void;
}

function AlertWithCloseButton({ notification, onClose }: Props) {
  const show = notification && notification.isGlobal;
  return (
    show && (
      <Alert
        variant={notification.variant}
        className="my-2"
        size="small"
        onClose={onClose}
        closeButton
      >
        {!!notification.header && (
          <Heading size="xsmall" level="3">
            {notification.header}
          </Heading>
        )}
        {notification.message}
      </Alert>
    )
  );
}

export default function NotificationBar(): ReactElement {
  const { notification, setNotification } = useNotification();

  return (
    <AlertWithCloseButton
      notification={notification}
      onClose={() => setNotification(undefined)}
    />
  );
}
