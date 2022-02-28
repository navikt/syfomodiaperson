import { useCallback } from "react";
import { trackEvent, UserProperties } from "@/amplitude/amplitude";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";

export const texts = {
  click: "Klikker på:",
  pageLoad: "Laster side",
};

export interface loggingMetadata {
  team: string;
  app: string;
  behandlendeEnhetId: string;
  behandlendeEnhetNavn: string;
}

export const useHasLoadedMetaData = (): boolean => {
  const { data } = useBehandlendeEnhetQuery();
  const { valgtEnhet } = useValgtEnhet();
  const harHentetBehandlendeEnhet = !!data?.enhetId;
  const harHentetValgtEnhet = !!valgtEnhet;
  return harHentetBehandlendeEnhet && harHentetValgtEnhet;
};

export const useLoggingMetaData = (): loggingMetadata => {
  const { data: behandlendeEnhet } = useBehandlendeEnhetQuery();

  return {
    team: "iSyfo",
    app: "Syfomodiaperson",
    behandlendeEnhetId: behandlendeEnhet?.enhetId || "",
    behandlendeEnhetNavn: behandlendeEnhet?.navn || "",
  };
};

export const useUserProperties = (): UserProperties => {
  const { valgtEnhet } = useValgtEnhet();

  return {
    valgtEnhet: valgtEnhet,
  };
};

export const useTrackEvent = () => {
  const metaData = useLoggingMetaData();

  return useCallback(
    function (eventName: string, eventData?: Record<string, string>) {
      trackEvent(eventName, Object.assign({}, metaData, eventData));
    },
    [metaData]
  );
};

export const useTrackOnClick = () => {
  const trackEvent = useTrackEvent();

  return function (elementName: string, kontekst?: string) {
    const context = kontekst && { kontekst: kontekst };
    trackEvent(`${texts.click} ${elementName}`, {
      pageName: document.title,
      ...context,
    });
  };
};

export const useTrackPageLoad = () => {
  const trackEvent = useTrackEvent();

  return function (pageName: string, aktivtMenyPunkt: string) {
    trackEvent(`${texts.pageLoad}`, {
      aktivtMenyPunkt: aktivtMenyPunkt,
      pageName: pageName,
    });
  };
};
