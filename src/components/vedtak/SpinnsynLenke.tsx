import Lenke from "nav-frontend-lenker";
import React from "react";
import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { ExternalLink } from "@navikt/ds-icons";
import { useTrackOnClick } from "@/data/logging/loggingHooks";

const spinnsynUrl = () =>
  fullNaisUrlIntern("spinnsyn-frontend-interne", "/syk/sykepenger");

const texts = {
  seVedtak: "Se vedtak",
};

export const SpinnsynLenke = () => {
  const navbruker = useNavBrukerData();
  const trackOnClick = useTrackOnClick();

  return (
    <Lenke
      onClick={() => trackOnClick(texts.seVedtak)}
      href={spinnsynUrl()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{`Se vedtakene slik ${navbruker.navn} ser dem på nav.no`}</span>
      <ExternalLink />
    </Lenke>
  );
};
