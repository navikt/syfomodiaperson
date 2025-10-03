import React, { ReactElement } from "react";
import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Skjemasvar } from "@/sider/dialogmoter/motebehov/skjema/Skjemasvar";

interface Props {
  kartleggingssporsmalSvar: KartleggingssporsmalSvarResponseDTO;
}

export default function KartleggingssporsmalSvar({
  kartleggingssporsmalSvar,
}: Props): ReactElement {
  return (
    <>
      <div>
        {`Svar mottatt: ${tilDatoMedManedNavnOgKlokkeslett(
          kartleggingssporsmalSvar.createdAt
        )}`}
      </div>
      <Skjemasvar formSnapshot={kartleggingssporsmalSvar.formSnapshot} />
    </>
  );
}
