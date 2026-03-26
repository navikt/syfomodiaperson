import React, { ReactElement, ReactNode } from "react";
import AppSpinner from "./AppSpinner";
import Feilmelding from "./Feilmelding";
import { useGetTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";
import Decorator from "@/decorator/Decorator";
import { ikkeTilgangBegrunnelseTekst } from "@/components/side/SideLaster";

interface AktivBrukerTilgangLasterProps {
  children: ReactNode;
}

const texts = {
  errorTitle: "Du har ikke tilgang til denne brukeren",
};

export default function AktivBrukerTilgangLaster({
  children,
}: AktivBrukerTilgangLasterProps): ReactElement {
  const getTilgangQuery = useGetTilgangQuery();
  const harTilgang = getTilgangQuery.data?.erGodkjent === true;

  let visning;
  if (getTilgangQuery.isLoading) {
    visning = <AppSpinner />;
  } else if (!harTilgang) {
    visning = (
      <Feilmelding
        tittel={texts.errorTitle}
        melding={ikkeTilgangBegrunnelseTekst}
      />
    );
  } else if (getTilgangQuery.isError) {
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
}
