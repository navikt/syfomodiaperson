import React, { ReactElement } from "react";
import {
  hasReceivedQuestions,
  isKandidat,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";

interface Props {
  kandidat: KartleggingssporsmalKandidatResponseDTO | undefined;
}

export default function KartleggingssporsmalKandidat({
  kandidat,
}: Props): ReactElement {
  if (!kandidat || !isKandidat(kandidat)) {
    return <div>Personen har ikke blitt kandidat</div>;
  }

  return (
    <div className="mb-4">
      {hasReceivedQuestions(kandidat)
        ? `Personen er kandidat og har mottatt kartleggingsspørsmål (${tilDatoMedManedNavnOgKlokkeslett(
            kandidat.varsletAt
          )})`
        : `Personen er kandidat og har ikke mottatt kartleggingsspørsmål`}
    </div>
  );
}
