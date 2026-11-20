import { LocalAlert } from "@navikt/ds-react";
import { TildeltNotification } from "@/components/oppfolgingsenhet/Oppfolgingsenhet";

interface Props {
  tildeltNotification: TildeltNotification;
}

export default function TildeltOppfolgingsenhetAlert({
  tildeltNotification,
}: Props) {
  const { status, header, message } = tildeltNotification;

  return (
    <LocalAlert status={status} className="mb-2">
      <LocalAlert.Header>
        <LocalAlert.Title>{header ?? message}</LocalAlert.Title>
      </LocalAlert.Header>
      {!!header && <LocalAlert.Content>{message}</LocalAlert.Content>}
    </LocalAlert>
  );
}
