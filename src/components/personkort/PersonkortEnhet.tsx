import React from "react";
import PersonkortElement from "./PersonkortElement";
import PersonkortInformasjon from "./PersonkortInformasjon";
import { KontorByggImage } from "../../../img/ImageComponents";
import ErrorBoundary from "../ErrorBoundary";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { ApiErrorException } from "@/api/errors";
import AppSpinner from "@/components/AppSpinner";
import PersonkortFeilmelding from "@/components/personkort/PersonkortFeilmelding";

const texts = {
  enhet: "Enhet",
  notFound: "Fant ikke behandlende enhet for person, prøv igjen senere.",
};

const PersonkortEnhet = () => {
  const {
    error,
    data: behandlendeenhet,
    isLoading,
  } = useBehandlendeEnhetQuery();
  const informasjonNokkelTekster = new Map([["enhetId", texts.enhet]]);
  const apiError = error instanceof ApiErrorException ? error.error : undefined;
  return (
    <ErrorBoundary apiError={apiError}>
      {isLoading ? (
        <AppSpinner />
      ) : behandlendeenhet ? (
        <PersonkortElement
          tittel={behandlendeenhet.navn}
          imgUrl={KontorByggImage}
          imgAlt="Kontorbygg"
        >
          <PersonkortInformasjon
            informasjonNokkelTekster={informasjonNokkelTekster}
            informasjon={{ enhetId: behandlendeenhet.enhetId }}
          />
        </PersonkortElement>
      ) : (
        <PersonkortFeilmelding>{texts.notFound}</PersonkortFeilmelding>
      )}
    </ErrorBoundary>
  );
};

export default PersonkortEnhet;
