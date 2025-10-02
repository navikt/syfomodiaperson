import React, { ReactElement } from "react";
import {
  hasReceivedQuestions,
  isKandidat,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartlegging/kartleggingTypes";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";

interface Props {
  kartleggingData: KartleggingssporsmalKandidatResponseDTO | undefined;
}

export default function KartleggingskandidatStatus({
  kartleggingData,
}: Props): ReactElement {
  if (!kartleggingData || !isKandidat(kartleggingData)) {
    return <div>Personen har ikke blitt kandidat</div>;
  }

  return (
    <div className="mb-4">
      {hasReceivedQuestions(kartleggingData)
        ? `Personen er kandidat og har mottatt kartleggingsspørsmål (${tilDatoMedManedNavnOgKlokkeslett(
            kartleggingData.varsletAt
          )})`
        : `Personen er kandidat og har ikke mottatt kartleggingsspørsmål`}
    </div>
  );
}
