import React from "react";
import { Alert } from "@navikt/ds-react";

export default function ArbeidssokerAlert() {
  return (
    <Alert variant="warning" size="small">
      Den sykemeldte er ikke registrert som arbeidssøker. Dette må gjøres før et
      nytt vedtak kan fattes.
    </Alert>
  );
}
