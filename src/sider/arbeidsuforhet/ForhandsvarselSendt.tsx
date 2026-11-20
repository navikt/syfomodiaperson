import ForhandsvarselBeforeDeadline from "@/sider/arbeidsuforhet/ForhandsvarselBeforeDeadline";
import ForhandsvarselAfterDeadline from "@/sider/arbeidsuforhet/ForhandsvarselAfterDeadline";
import { VurderingResponseDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { LocalAlert } from "@navikt/ds-react";
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
        <LocalAlert status="success" className="mb-2">
          <LocalAlert.Header>
            <LocalAlert.Title>{notification.message}</LocalAlert.Title>
          </LocalAlert.Header>
        </LocalAlert>
      )}
      {isForhandsvarselExpired ? (
        <ForhandsvarselAfterDeadline forhandsvarsel={forhandsvarsel} />
      ) : (
        <ForhandsvarselBeforeDeadline forhandsvarsel={forhandsvarsel} />
      )}
    </div>
  );
}
