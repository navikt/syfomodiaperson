import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import {
  hasAnsweredKartleggingssporsmal,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { HistorikkElement } from "@/sider/kartleggingssporsmal/historikk/HistorikkElement.tsx";

const texts = {
  header: "Historikk",
  subHeader: "Tidligere svar på kartleggingsspørsmål",
};

interface Props {
  tidligereKandidater: KartleggingssporsmalKandidatResponseDTO[];
}

export function KartleggingssporsmalHistorikk({ tidligereKandidater }: Props) {
  const kandidaterMedSvar = tidligereKandidater.filter((kandidat) =>
    hasAnsweredKartleggingssporsmal(kandidat),
  );

  if (kandidaterMedSvar.length === 0) {
    return null;
  }

  return (
    <Box
      background="default"
      padding="space-32"
      className="flex flex-col mb-4 gap-8"
    >
      <div>
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        <BodyShort size="small">{texts.subHeader}</BodyShort>
      </div>
      <Accordion>
        {kandidaterMedSvar.map((kandidat) => (
          <HistorikkElement
            key={kandidat.kandidatUuid}
            tidligereKandidat={kandidat}
          />
        ))}
      </Accordion>
    </Box>
  );
}
