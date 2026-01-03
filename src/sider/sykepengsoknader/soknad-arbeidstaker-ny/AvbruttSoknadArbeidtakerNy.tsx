import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import Statuspanel, {
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

const texts = {
  tittel: "Søknad om sykepenger",
  avbrutt: "Avbrutt av den sykmeldte",
  avbruttTittel: "Dato avbrutt",
  status: "Status",
};

interface AvbruttSoknadArbeidstakerStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const AvbruttSoknadArbeidstakerStatuspanel = ({
  soknad,
}: AvbruttSoknadArbeidstakerStatuspanelProps) => {
  return (
    <Statuspanel>
      <Statusopplysninger>
        <Nokkelopplysning
          label={texts.status}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>{texts.avbrutt}</p>
        </Nokkelopplysning>
        <Nokkelopplysning
          label={texts.avbruttTittel}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
        </Nokkelopplysning>
      </Statusopplysninger>
    </Statuspanel>
  );
};

interface AvbruttSoknadArbeidstakerProps {
  soknad: SykepengesoknadDTO;
}

const AvbruttSoknadArbeidstaker = ({
  soknad,
}: AvbruttSoknadArbeidstakerProps): ReactElement => {
  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      <AvbruttSoknadArbeidstakerStatuspanel soknad={soknad} />
      <SykmeldingUtdragContainer soknad={soknad} />
      <TilbakeTilSoknader />
    </div>
  );
};

export default AvbruttSoknadArbeidstaker;
