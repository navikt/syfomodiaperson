import { useState } from "react";
import { Accordion } from "@navikt/ds-react";
import { formatDateWithMonthName } from "@/utils/datoUtils";
import { KartleggingssporsmalSkjemasvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalSkjemasvar";
import {
  isFerdigbehandletAndVurdert,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { useKartleggingssporsmalSvarQuery } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import { FerdigbehandletInfoCard } from "@/sider/kartleggingssporsmal/ferdigbehandletInfoCard/FerdigbehandletInfoCard.tsx";

const texts = {
  header: (createdAt: Date) =>
    `Sykmeldte svarte ${formatDateWithMonthName(createdAt)}`,
  vurdertAv: "Vurdert av",
  vurdering: "Vurdering",
};

interface Props {
  tidligereKandidat: KartleggingssporsmalKandidatResponseDTO;
}

export function HistorikkElement({ tidligereKandidat }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: svar } = useKartleggingssporsmalSvarQuery(tidligereKandidat);

  if (!svar) return null;

  const handleAccordionClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header onClick={handleAccordionClick}>
        {texts.header(svar.createdAt)}
      </Accordion.Header>
      <Accordion.Content>
        <div className="flex flex-col gap-4">
          <KartleggingssporsmalSkjemasvar formSnapshot={svar.formSnapshot} />

          {isFerdigbehandletAndVurdert(tidligereKandidat) && (
            <FerdigbehandletInfoCard kandidat={tidligereKandidat} />
          )}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
