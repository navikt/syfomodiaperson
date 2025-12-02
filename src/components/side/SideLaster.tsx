import React, { ReactElement, ReactNode } from "react";
import AppSpinner from "../AppSpinner";
import Feilmelding from "../Feilmelding";
import { useGetTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";

interface Props {
  isLoading: boolean;
  isError: boolean;
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
  isLoading,
  isError,
  children,
  className,
}: Props): ReactElement {
  const getTilgangQuery = useGetTilgangQuery();
  const harTilgang = getTilgangQuery.data?.erGodkjent === true;

  if (isLoading || getTilgangQuery.isLoading) {
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
  if (isError || getTilgangQuery.isError) {
    return <Feilmelding />;
  }
  return (
    <div className={`w-full ${className ? className : ""}`}>{children}</div>
  );
}
