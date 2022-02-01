import React, { ReactElement, ReactNode } from "react";
import AppSpinner from "./AppSpinner";
import Feilmelding from "./Feilmelding";
import { hentBegrunnelseTekst } from "@/utils/tilgangUtils";
import { useTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";

interface SideLasterProps {
  henter: boolean;
  hentingFeilet: boolean;
  children: ReactNode;
}

const texts = {
  errorTitle: "Du har ikke tilgang til denne tjenesten",
};

const SideLaster = ({
  henter,
  hentingFeilet,
  children,
}: SideLasterProps): ReactElement => {
  const {
    isLoading: henterTilgang,
    isError: hentingTilgangFeilet,
    data: tilgang,
  } = useTilgangQuery();
  const harTilgang = tilgang?.harTilgang === true;

  if (henter || henterTilgang) {
    return <AppSpinner />;
  }
  if (!harTilgang) {
    return (
      <Feilmelding
        tittel={texts.errorTitle}
        melding={hentBegrunnelseTekst(tilgang?.begrunnelse || null)}
      />
    );
  }
  if (hentingFeilet || hentingTilgangFeilet) {
    return <Feilmelding />;
  }
  return <>{children}</>;
};

export default SideLaster;
