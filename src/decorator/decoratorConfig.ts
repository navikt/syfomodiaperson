import {
  DecoratorProps,
  Enhet,
  Environment,
  UrlFormat,
} from "./decoratorProps";
import { erAnsattDev, erDev, erLokal, erProd } from "@/utils/miljoUtil";

const decoratorConfig = (
  initValueFnr: string,
  setFnr: (fnr: string) => void,
  setEnhet: (enhet: string) => void
): DecoratorProps => {
  return {
    appName: "Sykefraværsoppfølging",
    fetchActiveEnhetOnMount: true,
    fetchActiveUserOnMount: true,
    onEnhetChanged: (enhetId?: string | null, enhet?: Enhet) => {
      setEnhet(enhetId || enhet?.enhetId || "");
    },
    onFnrChanged: (fnr?: string | null) => {
      if (fnr && fnr !== initValueFnr) {
        setFnr(fnr);
      }
    },
    showEnheter: true,
    showSearchArea: true,
    showHotkeys: false,
    environment: getEnvironment(),
    urlFormat: getUrlFormat(),
    proxy: "/modiacontextholder",
  };
};

const getEnvironment = (): Environment => {
  if (erProd()) {
    return "prod";
  } else if (erDev()) {
    return "q2";
  } else {
    return "local";
  }
};

const getUrlFormat = (): UrlFormat => {
  if (erAnsattDev()) {
    return "ANSATT";
  } else if (erLokal()) {
    return "LOCAL";
  } else return "NAV_NO";
};

export default decoratorConfig;
