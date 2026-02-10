import React from "react";
import { PersonkortElement } from "./PersonkortElement";
import PersonkortInformasjon from "./PersonkortInformasjon";
import { KontorByggImage } from "../../../img/ImageComponents";
import ErrorBoundary from "../ErrorBoundary";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { ApiErrorException } from "@/api/errors";
import AppSpinner from "@/components/AppSpinner";
import PersonkortChangeEnhet from "@/components/personkort/PersonkortChangeEnhet";
import { Alert } from "@navikt/ds-react";

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
          icon={<img src={KontorByggImage} alt={"Kontorbygg"} />}
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
