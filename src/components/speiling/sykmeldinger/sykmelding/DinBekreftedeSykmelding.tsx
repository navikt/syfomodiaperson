import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import ArbeidsgiversSykmelding from "./ArbeidsgiversSykmelding";
import BekreftetSykmeldingStatuspanel from "../sykmeldingstatuspanel/BekreftetSykmeldingStatuspanel";
import DineSykmeldingOpplysninger from "./sykmeldingOpplysninger/DineSykmeldingOpplysninger";
import Utvidbar from "../../../Utvidbar";
import {
  PersonHoverImage,
  PersonImage,
} from "../../../../../img/ImageComponents";

const texts = {
  tittel: "Dine opplysinger",
};

interface DinBekreftedeSykmeldingProps {
  dinSykmelding: SykmeldingOldFormat;
  arbeidsgiversSykmelding: SykmeldingOldFormat;
}

const DinBekreftedeSykmelding = (
  dinBekreftedeSykmeldingProps: DinBekreftedeSykmeldingProps
) => {
  const { dinSykmelding, arbeidsgiversSykmelding } =
    dinBekreftedeSykmeldingProps;
  return (
    <div>
      <BekreftetSykmeldingStatuspanel sykmelding={dinSykmelding} />
      <Utvidbar
        className="blokk"
        erApen
        tittel={texts.tittel}
        ikon={PersonImage}
        ikonHover={PersonHoverImage}
        ikonAltTekst="Du"
        variant="lysebla"
        Overskrift="h2"
      >
        <DineSykmeldingOpplysninger sykmelding={dinSykmelding} />
      </Utvidbar>
      {dinSykmelding.valgtArbeidssituasjon === "ARBEIDSTAKER" && (
        <div className="blokk">
          <ArbeidsgiversSykmelding sykmelding={arbeidsgiversSykmelding} />
        </div>
      )}
    </div>
  );
};

export default DinBekreftedeSykmelding;
