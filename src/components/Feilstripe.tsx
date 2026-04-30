import React from "react";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";

interface FeilstripeProps {
  vis: boolean;
  className: string;
  tekst: string;
}

const Feilstripe = (feilstripeProps: FeilstripeProps) => {
  const {
    vis,
    className,
    tekst = "Beklager, det oppstod en feil! Vennligst prøv igjen senere.",
  } = feilstripeProps;
  return (
    <div aria-live="polite" role="alert">
      {vis ? (
        <AlertStripeAdvarsel className={className}>
          <p className="sist">{tekst}</p>
        </AlertStripeAdvarsel>
      ) : null}
    </div>
  );
};

export default Feilstripe;
