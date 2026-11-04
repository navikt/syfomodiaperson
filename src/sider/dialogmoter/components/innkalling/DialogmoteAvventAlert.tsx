import { InfoCard } from "@navikt/ds-react";
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { formatDateWithMonthName } from "@/utils/datoUtils";
import { AvventDTO } from "@/data/dialogmotekandidat/dialogmotekandidatTypes";

interface Props {
  avvent: AvventDTO;
}

const texts = {
  avventerTil: (dato: string) => `Avventer til ${dato}`,
  avventer: "Avventer",
};

export function DialogmoteAvventAlert({ avvent }: Props) {
  return (
    <InfoCard data-color="warning" size="small" className="mb-4">
      <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
        <InfoCard.Title>
          {avvent.frist
            ? texts.avventerTil(formatDateWithMonthName(new Date(avvent.frist)))
            : texts.avventer}
        </InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>{avvent.beskrivelse}</InfoCard.Content>
    </InfoCard>
  );
}
