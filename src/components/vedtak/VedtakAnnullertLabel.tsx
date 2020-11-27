import * as React from "react";
import { EtikettFokus } from "nav-frontend-etiketter";

const texts = {
  label: "Behandles på nytt",
};

const VedtakAnnullertLabel = () => {
  return <EtikettFokus>{texts.label}</EtikettFokus>;
};

export default VedtakAnnullertLabel;
