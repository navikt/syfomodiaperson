import { Alert, BodyShort } from "@navikt/ds-react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils.ts";
import React from "react";
import { KartleggingssporsmalKandidatResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";

const texts = {
  svarVurdert: "Svarene er vurdert",
  svarVurdertAv: "Oppgaven er behandlet av",
};

interface SuccessAlertProps {
  nyesteKandidat: KartleggingssporsmalKandidatResponseDTO;
}

export const SuccessAlert = ({ nyesteKandidat }: SuccessAlertProps) => (
  <Alert size="medium" variant="success">
    <BodyShort size="small" weight="semibold" className="mb-2">
      {`${texts.svarVurdert} ${tilLesbarDatoMedArstall(
        nyesteKandidat.vurdering?.vurdertAt
      )}`}
    </BodyShort>
    <BodyShort size="small">
      {`${texts.svarVurdertAv} ${nyesteKandidat.vurdering?.vurdertBy}`}
    </BodyShort>
  </Alert>
);
