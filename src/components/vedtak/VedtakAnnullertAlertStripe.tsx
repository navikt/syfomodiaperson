import * as React from "react";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";

const texts = {
  annullert:
    "Vi har mottatt nye opplysninger som gjør at søknaden må behandles på nytt",
};

const VedtakAnnullertAlertStripe = () => {
  return <AlertStripeAdvarsel>{texts.annullert}</AlertStripeAdvarsel>;
};

export default VedtakAnnullertAlertStripe;
