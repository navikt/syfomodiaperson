import { log } from "@navikt/digisyfo-npm";
import ponyfill from "fetch-ponyfill";

const ponyfills = ponyfill();

const isEdge = () => {
  return window.navigator.userAgent.indexOf("Edge") > -1;
};

const getFetch = () => {
  // Gjør dette slik fordi enhetstester vil feile dersom fetch overskrives
  if (isEdge()) {
    return ponyfills.fetch;
  }
  return window.fetch;
};

const getHeaders = () => {
  // Gjør dette slik fordi enhetstester vil feile dersom Headers overskrives
  if (isEdge()) {
    return ponyfills.Headers;
  }
  return window.Headers;
};

export const hentLoginUrl = () => {
  if (window.location.href.indexOf("app.adeo.no") > -1) {
    // Prod
    return "https://loginservice.nais.adeo.no/login";
  }
  // Preprod
  return "https://loginservice.nais.preprod.local/login";
};

export const hentRedirectBaseUrl = (windowLocationHref) => {
  if (window.location.href.indexOf("app.adeo.no") > -1) {
    // Prod
    if (windowLocationHref.indexOf("sykefravaer") > -1) {
      return "https://syfomodiaperson.nais.adeo.no";
    } else if (windowLocationHref.indexOf("sykefravaersoppfoelging") > -1) {
      return "https://sykefravaersoppfoelgingfront.nais.adeo.no";
    }
  }
  if (windowLocationHref.indexOf("sykefravaer") > -1) {
    return "https://syfomodiaperson.nais.preprod.local";
  } else if (windowLocationHref.indexOf("sykefravaersoppfoelging") > -1) {
    return "https://sykefravaersoppfoelgingfront-q1.nais.preprod.local";
  }
  return windowLocationHref;
};

export const lagreRedirectUrlILocalStorage = (href) => {
  localStorage.setItem("redirecturl", href);
};

export function get(url) {
  const fetchX = getFetch();
  return fetchX(url, {
    credentials: "include",
  })
    .then((res) => {
      if (res.status === 401) {
        log(res, "Redirect til login");
        lagreRedirectUrlILocalStorage(window.location.href);
        window.location.href = `${hentLoginUrl()}?redirect=${hentRedirectBaseUrl(
          window.location.href
        )}`;
      } else if (res.status > 400) {
        log(res);
        throw new Error("Forespørsel feilet");
      }
      return res.json();
    })
    .catch((err) => {
      log(err);
      throw err;
    });
}

export const post = (url, body) => {
  const fetchX = getFetch();
  const HeadersX = getHeaders();
  return fetchX(url, {
    credentials: "include",
    method: "POST",
    body: JSON.stringify(body),
    headers: new HeadersX({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => {
      if (res.status === 401) {
        log(res, "Redirect til login");
        lagreRedirectUrlILocalStorage(window.location.href);
        window.location.href = `${hentLoginUrl()}?redirect=${hentRedirectBaseUrl(
          window.location.href
        )}`;
        return null;
      } else if (res.status > 400) {
        log(res);
        throw new Error("Forespørsel feilet");
      } else {
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("json")) {
          return res.json();
        }
        return res;
      }
    })
    .catch((err) => {
      log(err);
      throw err;
    });
};
