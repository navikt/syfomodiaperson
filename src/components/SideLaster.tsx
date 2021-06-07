import React, { ReactElement } from "react";
import AppSpinner from "./AppSpinner";
import Feilmelding from "./Feilmelding";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";
import { useAppSelector } from "../hooks/hooks";

interface SideLasterProps {
  henter: boolean;
  hentingFeilet: boolean;
  children: ReactElement[] | ReactElement;
}

const texts = {
  errorTitle: "Du har ikke tilgang til denne tjenesten",
};

const SideLaster = ({
  henter,
  hentingFeilet,
  children,
}: SideLasterProps): ReactElement => {
  const tilgangState = useAppSelector((state) => state.tilgang);
  if (henter || !tilgangState.hentingForsokt) {
    return <AppSpinner />;
  }
  if (hentingFeilet || tilgangState.hentingFeilet) {
    return <Feilmelding />;
  }
  if (!tilgangState.data.harTilgang) {
    return (
      <Feilmelding
        tittel={texts.errorTitle}
        melding={hentBegrunnelseTekst(tilgangState.data.begrunnelse)}
      />
    );
  }
  return <>{children}</>;
};

export default SideLaster;
