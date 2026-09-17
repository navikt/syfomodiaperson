import React from "react";
import { PersonkortElement } from "./PersonkortElement";
import PersonkortInformasjon from "./PersonkortInformasjon";
import ErrorBoundary from "../ErrorBoundary";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { ApiErrorException } from "@/api/errors";
import AppSpinner from "@/components/AppSpinner";
import PersonkortChangeEnhet from "@/components/personkort/PersonkortChangeEnhet";
import { Alert } from "@navikt/ds-react";
import { Buildings3Icon } from "@navikt/aksel-icons";

const texts = {
  enhet: "Enhet",
  notFound: "Fant ikke behandlende enhet for person, prøv igjen senere.",
};

export function PersonkortEnhet() {
  const {
    error,
    data: behandlendeenhet,
    isLoading,
    isFetching,
  } = useBehandlendeEnhetQuery();
  const informasjonNokkelTekster = new Map([["enhetId", texts.enhet]]);
  const apiError = error instanceof ApiErrorException ? error.error : undefined;
  return (
    <ErrorBoundary apiError={apiError}>
      {isLoading || isFetching ? (
        <AppSpinner />
      ) : behandlendeenhet ? (
        <PersonkortElement
          tittel={
            behandlendeenhet.oppfolgingsenhetDTO?.enhet?.navn ??
            behandlendeenhet.geografiskEnhet.navn
          }
          icon={
            <Buildings3Icon
              title="Nav kontor"
              fontSize="1.5rem"
              className="mr-2"
            />
          }
        >
          <div className="flex-col w-fit">
            <PersonkortInformasjon
              informasjonNokkelTekster={informasjonNokkelTekster}
              informasjon={{
                enhetId:
                  behandlendeenhet.oppfolgingsenhetDTO?.enhet?.enhetId ??
                  behandlendeenhet.geografiskEnhet.enhetId,
              }}
            />
            <PersonkortChangeEnhet behandlendeEnhet={behandlendeenhet} />
          </div>
        </PersonkortElement>
      ) : (
        <Alert variant="info" size="small">
          {texts.notFound}
        </Alert>
      )}
    </ErrorBoundary>
  );
}
