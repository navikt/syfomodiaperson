import React, { ReactElement, ReactNode } from "react";
import AppSpinner from "./AppSpinner";
import Feilmelding from "./Feilmelding";
import { useTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";

interface Props {
  henter: boolean;
  hentingFeilet: boolean;
  children: ReactNode;
  className?: string;
}

const texts = {
  errorTitle: "Du har ikke tilgang til denne tjenesten",
};

export const ikkeTilgangBegrunnelseTekst = `
    Du har ikke tilgang til å se denne personen.
    Det kan være fordi du ikke har tilgang til «sykefraværsoppfølging»,
    personen har en geografisk tilhørighet som du ikke har tilgang til
    eller at det kreves særskilt tilgang for å se informasjon om denne personen. 
  `;

export default function SideLaster({
  henter,
  hentingFeilet,
  children,
  className,
}: Props): ReactElement {
  const {
    isLoading: henterTilgang,
    isError: hentingTilgangFeilet,
    data: tilgang,
  } = useTilgangQuery();
  const harTilgang = tilgang?.erGodkjent === true;

  if (henter || henterTilgang) {
    return <AppSpinner />;
  }
  if (!harTilgang) {
    return (
      <Feilmelding
        tittel={texts.errorTitle}
        melding={ikkeTilgangBegrunnelseTekst}
      />
    );
  }
  if (hentingFeilet || hentingTilgangFeilet) {
    return <Feilmelding />;
  }
  return (
    <div className={`w-full ${className ? className : ""}`}>{children}</div>
  );
}
