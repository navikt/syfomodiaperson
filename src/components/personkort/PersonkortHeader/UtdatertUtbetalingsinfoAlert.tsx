import React from "react";
import { Alert } from "@navikt/ds-react";

export default function UtdatertUtbetalingsinfoAlert() {
  return (
    <Alert inline variant="warning" size="small">
      Utbetalingsinfo kan gjelde tidligere oppfølgingstilfelle
    </Alert>
  );
}
