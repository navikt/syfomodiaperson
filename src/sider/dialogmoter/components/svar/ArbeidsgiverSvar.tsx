import { DialogmotedeltakerArbeidsgiverVarselDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import React from "react";
import { EkspanderbartSvarPanel } from "@/sider/dialogmoter/components/svar/EkspanderbartSvarPanel";
import { SvarIcon } from "@/sider/dialogmoter/components/svar/SvarIcon";
import { SvarDetaljer } from "@/sider/dialogmoter/components/svar/SvarDetaljer";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { getHarAapnetTekst, getSvarTekst } from "@/utils/dialogmoteUtils";
import { arbeidsgiverNavnMedVirksomhet } from "@/utils/motebehovUtils.ts";

const texts = {
  label: "Nærmeste leder:",
};

interface Props {
  varsel: DialogmotedeltakerArbeidsgiverVarselDTO;
  virksomhetsnummer: string;
  defaultClosed?: boolean;
}

export const ArbeidsgiverSvar = ({
  varsel,
  virksomhetsnummer,
  defaultClosed = false,
}: Props) => {
  const { getCurrentNarmesteLeder } = useLedereQuery();
  const narmesteLeder = getCurrentNarmesteLeder(virksomhetsnummer);
  const arbeidsgiverInfo = narmesteLeder
    ? arbeidsgiverNavnMedVirksomhet(
        narmesteLeder.narmesteLederNavn,
        narmesteLeder.virksomhetsnavn || narmesteLeder.virksomhetsnummer,
      )
    : "";

  const svar = varsel?.svar;
  const svarTittelTekst = !svar
    ? getHarAapnetTekst(varsel?.varselType, varsel?.lestDato)
    : getSvarTekst(svar.svarTidspunkt, svar.svarType);

  return (
    <EkspanderbartSvarPanel
      title={{
        icon: <SvarIcon svarType={svar?.svarType} />,
        label: texts.label,
        body: `${arbeidsgiverInfo}, ${svarTittelTekst}`,
      }}
      defaultOpen={!defaultClosed && !!svar}
    >
      <SvarDetaljer svarTekst={svar?.svarTekst} />
    </EkspanderbartSvarPanel>
  );
};
