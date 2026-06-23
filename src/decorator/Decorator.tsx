import React, { useLayoutEffect, useRef } from "react";
import { decoratorConfig } from "./decoratorConfig";
import { fullNaisUrlIntern } from "@/utils/miljoUtil.ts";
import { useValgtEnhet } from "@/context/ValgtEnhetContext.tsx";
import { usePostAktivBruker } from "@/data/modiacontext/usePostAktivBruker.ts";
import { useValgtPersonident } from "@/hooks/useValgtBruker.ts";

const Decorator = () => {
  const valgtEnhet = useValgtEnhet();
  const valgtPersonident = useValgtPersonident();
  const postAktivBruker = usePostAktivBruker();
  const decoratorRef = useRef<InternarbeidsflateDecoratorElement>(null);

  useLayoutEffect(() => {
    const handlePersonsokSubmit = (nyttFnr: string) => {
      postAktivBruker.mutate(nyttFnr, {
        onSuccess: () => {
          const host = "syfomodiaperson";
          const path = `/sykefravaer`;
          window.location.href = fullNaisUrlIntern(host, path);
        },
      });
    };

    const decoratorElement = decoratorRef.current;
    if (!decoratorElement) return;

    const onEnhetChanged = (event: CustomEvent<EnhetChangedDetail>) => {
      const { enhet } = event.detail;
      if (enhet) valgtEnhet.setValgtEnhet(enhet);
    };

    const onFnrChanged = (event: CustomEvent<FnrChangedDetail>) => {
      const { fnr } = event.detail;
      if (fnr && fnr !== valgtPersonident) handlePersonsokSubmit(fnr);
    };

    decoratorElement.addEventListener("fnr-changed", onFnrChanged);
    decoratorElement.addEventListener("enhet-changed", onEnhetChanged);

    return () => {
      decoratorElement.removeEventListener("fnr-changed", onFnrChanged);
      decoratorElement.removeEventListener("enhet-changed", onEnhetChanged);
    };
  });

  return (
    <internarbeidsflate-decorator
      ref={decoratorRef}
      app-name={decoratorConfig.appName}
      fetch-active-user-on-mount={String(
        decoratorConfig.fetchActiveUserOnMount,
      )}
      fetch-active-enhet-on-mount={String(
        decoratorConfig.fetchActiveEnhetOnMount,
      )}
      show-enheter={String(decoratorConfig.showEnheter)}
      show-search-area={String(decoratorConfig.showSearchArea)}
      show-hotkeys={String(decoratorConfig.showHotkeys)}
      enable-hotkeys={String(decoratorConfig.enableHotkeys)}
      environment={decoratorConfig.environment}
      url-format={decoratorConfig.urlFormat}
      proxy={decoratorConfig.proxy}
      fnr-sync-mode={decoratorConfig.fnrSyncMode}
    />
  );
};

export default Decorator;
