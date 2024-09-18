import React from "react";
import ForhandsvarselSkjema from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSkjema";
import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { VurderingType } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { Alert, Box } from "@navikt/ds-react";
import ForhandsvarselSendt from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSendt";
import { useNotification } from "@/context/notification/NotificationContext";

export default function ManglendeMedvirkning() {
  const { notification } = useNotification();
  const { sisteVurdering } = useManglendeMedvirkningVurderingQuery();
  const isForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;

  return (
    <>
      {notification && (
        <Alert variant="success" className="mb-2">
          {notification.message}
        </Alert>
      )}
      <Box>
        {isForhandsvarsel ? (
          <ForhandsvarselSendt forhandsvarsel={sisteVurdering} />
        ) : (
          <ForhandsvarselSkjema />
        )}
      </Box>
    </>
  );
}
