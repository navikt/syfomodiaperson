import React from "react";
import ForhandsvarselBeforeDeadline from "@/sider/arbeidsuforhet/ForhandsvarselBeforeDeadline";
import ForhandsvarselAfterDeadline from "@/sider/arbeidsuforhet/ForhandsvarselAfterDeadline";
import { VurderingResponseDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { Alert } from "@navikt/ds-react";
import { useNotification } from "@/context/notification/NotificationContext";

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export default function ForhandsvarselSendt({ forhandsvarsel }: Props) {
  const { notification } = useNotification();
  const isForhandsvarselExpired =
    forhandsvarsel && forhandsvarsel?.varsel?.isExpired;

  return (
    <div>
      {notification && (
        <Alert variant="success" className="mb-2">
          {notification.message}
        </Alert>
      )}
      {isForhandsvarselExpired ? (
        <ForhandsvarselAfterDeadline forhandsvarsel={forhandsvarsel} />
      ) : (
        <ForhandsvarselBeforeDeadline forhandsvarsel={forhandsvarsel} />
      )}
    </div>
  );
}
