import React from "react";
import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { EksternLenke } from "@/components/EksternLenke";
import { Heading } from "@navikt/ds-react";

const texts = {
  vedtak: "Vedtak",
};

export const spinnsynUrl = function () {
  return fullNaisUrlIntern("spinnsyn-frontend-interne", "/syk/sykepenger");
};

export const SpinnsynLenke = () => {
  const { navn } = useNavBrukerData();

  return (
    <div>
      <Heading size="small" level="3">
        {texts.vedtak}
      </Heading>
      <EksternLenke
        href={spinnsynUrl()}
      >{`Se vedtakene slik ${navn} ser dem på nav.no`}</EksternLenke>
    </div>
  );
};
