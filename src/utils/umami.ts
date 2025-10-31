import umami from "@umami/node";
import { erProd } from "@/utils/miljoUtil";

function getApiKey() {
  return erProd()
    ? "d9c74695-30bc-47e9-b751-bebd1c7472a0"
    : "e75681f5-0a2a-4061-8800-cfa36c982730";
}

export function setIdentifier(veilederident: string) {
  umami.identify({ veilederident });
}

umami.init({
  websiteId: getApiKey(),
  hostUrl: "https://umami.nav.no",
});
