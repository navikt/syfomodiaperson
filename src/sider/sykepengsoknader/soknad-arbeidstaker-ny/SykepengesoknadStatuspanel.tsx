import React, { ReactElement } from "react";
import Statuspanel, {
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";

const texts = {
  status: "Status",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export function SykepengesoknadStatuspanel({ soknad }: Props): ReactElement {
  return (
    <Statuspanel enKolonne>
      <Statusopplysninger>
        <Nokkelopplysning
          label={texts.status}
          className={"nokkelopplysning--statusopplysning"}
        >
          <SoknadStatustekst soknad={soknad} />
        </Nokkelopplysning>
      </Statusopplysninger>
    </Statuspanel>
  );
}
