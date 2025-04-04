import React, { ReactElement } from "react";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import Sykepengetekst from "../../../utils/soknad-felles/Sykepengetekst";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";

const texts = {
  status: "Status",
  tittel: "Utbetaling av sykepenger",
};

interface StatusOgSykepengeopplysningerProps {
  soknad: SykepengesoknadDTO;
}

const StatusOgSykepengeopplysninger = (
  statusOgSykepengeopplysningerProps: StatusOgSykepengeopplysningerProps
) => {
  const { soknad } = statusOgSykepengeopplysningerProps;
  return (
    <Statusopplysninger>
      <StatusNokkelopplysning tittel={texts.status}>
        <SoknadStatustekst soknad={soknad} />
      </StatusNokkelopplysning>
      <StatusNokkelopplysning tittel={texts.tittel}>
        <Sykepengetekst soknad={soknad} />
      </StatusNokkelopplysning>
    </Statusopplysninger>
  );
};

interface SykepengesoknadStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const SykepengesoknadStatuspanel = ({
  soknad,
}: SykepengesoknadStatuspanelProps): ReactElement => {
  return (
    <Statuspanel enKolonne>
      <StatusOgSykepengeopplysninger soknad={soknad} />
    </Statuspanel>
  );
};

export default SykepengesoknadStatuspanel;
