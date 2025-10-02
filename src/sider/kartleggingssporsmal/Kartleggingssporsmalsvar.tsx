import React, { ReactElement } from "react";
import { KartleggingssporsmalsvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Skjemasvar } from "@/sider/dialogmoter/motebehov/skjema/Skjemasvar";

interface Props {
  kartleggingssporsmalsvar: KartleggingssporsmalsvarResponseDTO;
}

export default function Kartleggingssporsmalsvar({
  kartleggingssporsmalsvar,
}: Props): ReactElement {
  return (
    <>
      <div>
        {`Svar mottatt: ${tilDatoMedManedNavnOgKlokkeslett(
          kartleggingssporsmalsvar.createdAt
        )}`}
      </div>
      <Skjemasvar formSnapshot={kartleggingssporsmalsvar.formSnapshot} />
    </>
  );
}
