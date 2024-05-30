import {
  DialogmotedeltakerBehandlerVarselDTO,
  DialogmotedeltakerBehandlerVarselSvarDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { getSvarTekst } from "@/utils/dialogmoteUtils";
import { EkspanderbartSvarPanel } from "@/components/dialogmote/svar/EkspanderbartSvarPanel";
import { SvarIcon } from "@/components/dialogmote/svar/SvarIcon";
import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { SvarDetaljer } from "@/components/dialogmote/svar/SvarDetaljer";

const texts = {
  label: "Behandleren:",
  svarIkkeMottatt: "har ikke gitt svar",
  begrunnelseMottattHeader: "Begrunnelse mottatt",
};

interface DeltakerBehandlerSvarDetaljerProps {
  svarList: DialogmotedeltakerBehandlerVarselSvarDTO[];
}

const DeltakerBehandlerSvarDetaljer = ({
  svarList,
}: DeltakerBehandlerSvarDetaljerProps) => {
  const begrunnelseHeaderTekst = (
    svar: DialogmotedeltakerBehandlerVarselSvarDTO
  ) =>
    `${texts.begrunnelseMottattHeader} ${tilLesbarDatoMedArUtenManedNavn(
      svar.createdAt
    )}`;

  if (svarList.length > 1) {
    return (
      <>
        {svarList
          .filter((svar) => svar.tekst)
          .map((svar, idx) => (
            <SvarDetaljer
              key={idx}
              label={begrunnelseHeaderTekst(svar)}
              svarTekst={svar.tekst}
            />
          ))}
      </>
    );
  }

  const svar = svarList[0];

  return (
    <SvarDetaljer
      label={svar && begrunnelseHeaderTekst(svar)}
      svarTekst={svar?.tekst}
    />
  );
};

interface BehandlerSvarProps {
  varsel: DialogmotedeltakerBehandlerVarselDTO;
  behandlerNavn: string;
}

export const BehandlerSvar = ({
  varsel,
  behandlerNavn,
}: BehandlerSvarProps) => {
  const latestSvar: DialogmotedeltakerBehandlerVarselSvarDTO | undefined =
    varsel.svar[0];
  const svarTittelTekst = !latestSvar
    ? texts.svarIkkeMottatt
    : getSvarTekst(
        latestSvar.createdAt,
        latestSvar.svarType,
        varsel.svar.length
      );

  return (
    <EkspanderbartSvarPanel
      title={{
        icon: <SvarIcon svarType={latestSvar?.svarType} />,
        label: texts.label,
        body: `${behandlerNavn}, ${svarTittelTekst}`,
      }}
      defaultOpen={!!latestSvar}
    >
      <DeltakerBehandlerSvarDetaljer svarList={varsel.svar} />
    </EkspanderbartSvarPanel>
  );
};
