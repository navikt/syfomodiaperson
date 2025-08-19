import React, { ReactElement } from "react";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";

const texts = {
  status: "Status",
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
