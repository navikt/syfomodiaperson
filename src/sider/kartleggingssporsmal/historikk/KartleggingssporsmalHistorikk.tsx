import React, { useState } from "react";
import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { KartleggingssporsmalSkjemasvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalSkjemasvar";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { Paragraph } from "@/components/Paragraph";
import { KartleggingssporsmalKandidatResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { useKartleggingssporsmalSvarQuery } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";

const texts = {
  header: "Historikk",
  subHeader: "Tidligere svar på kartleggingsspørsmål",
  vurdertAv: "Vurdert av",
};

interface Props {
  kandidater: KartleggingssporsmalKandidatResponseDTO[];
}

export function KartleggingssporsmalHistorikk({ kandidater }: Props) {
  const kandidaterMedSvar = kandidater.filter(
    (kandidat) =>
      kandidat.status === "SVAR_MOTTATT" ||
      kandidat.status === "FERDIGBEHANDLET"
  );

  if (kandidaterMedSvar.length === 0) {
    return null;
  }

  return (
    <Box
      background="surface-default"
      padding="8"
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
          <HistorikkElement key={kandidat.kandidatUuid} kandidat={kandidat} />
        ))}
      </Accordion>
    </Box>
  );
}

interface HistorikkElementProps {
  kandidat: KartleggingssporsmalKandidatResponseDTO;
}

function HistorikkElement({ kandidat }: HistorikkElementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: veilederinfo } = useVeilederInfoQuery(
    kandidat.vurdering?.vurdertBy || ""
  );
  const { data: svar } = useKartleggingssporsmalSvarQuery(kandidat);

  if (!svar) {
    return null;
  }

  const header = `Sykmeldte svarte ${tilDatoMedManedNavn(kandidat.svarAt)}`;

  const handleAccordionClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header onClick={handleAccordionClick}>
        {header}
      </Accordion.Header>
      <Accordion.Content>
        <div className="flex flex-col gap-4">
          <KartleggingssporsmalSkjemasvar formSnapshot={svar.formSnapshot} />
          {veilederinfo && (
            <Paragraph
              label={texts.vurdertAv}
              body={veilederinfo.fulltNavn()}
            />
          )}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
