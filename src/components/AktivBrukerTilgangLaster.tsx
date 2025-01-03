import React, { ReactElement, ReactNode } from "react";
import AppSpinner from "./AppSpinner";
import Feilmelding from "./Feilmelding";
import { useTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";
import Decorator from "@/decorator/Decorator";
import { ikkeTilgangBegrunnelseTekst } from "@/components/SideLaster";

interface AktivBrukerTilgangLasterProps {
  children: ReactNode;
}

const texts = {
  errorTitle: "Du har ikke tilgang til denne brukeren",
};

const AktivBrukerTilgangLaster = ({
  children,
}: AktivBrukerTilgangLasterProps): ReactElement => {
  const {
    isLoading: henterTilgang,
    isError: hentingTilgangFeilet,
    data: tilgang,
  } = useTilgangQuery();
  const harTilgang = tilgang?.erGodkjent === true;

  let visning;
  if (henterTilgang) {
    visning = <AppSpinner />;
  } else if (!harTilgang) {
    visning = (
      <Feilmelding
        tittel={texts.errorTitle}
        melding={ikkeTilgangBegrunnelseTekst}
      />
    );
  } else if (hentingTilgangFeilet) {
    visning = <Feilmelding />;
  } else {
    visning = children;
  }
  return (
    <>
      <Decorator />
      {visning}
    </>
  );
};

export default AktivBrukerTilgangLaster;
