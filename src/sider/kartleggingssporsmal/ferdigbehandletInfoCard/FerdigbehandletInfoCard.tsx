import { InfoCard } from "@navikt/ds-react";
import { InformationSquareIcon } from "@navikt/aksel-icons";
import { formatDateWithYear } from "@/utils/datoUtils.ts";

import { KartleggingssporsmalKandidatResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";

const texts = {
  svarVurdert: "Svarene er vurdert",
  svarVurdertAv: "Oppgaven er behandlet av",
};

interface Props {
  nyesteKandidat: KartleggingssporsmalKandidatResponseDTO;
}

export function FerdigbehandletInfoCard({ nyesteKandidat }: Props) {
  return (
    <InfoCard data-color="info" size="small">
      <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
        <InfoCard.Title>
          {`${texts.svarVurdert} ${formatDateWithYear(
            nyesteKandidat.vurdering?.vurdertAt,
          )}`}
        </InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        {`${texts.svarVurdertAv} ${nyesteKandidat.vurdering?.vurdertBy}`}
      </InfoCard.Content>
    </InfoCard>
  );
}
