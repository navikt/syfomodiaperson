import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { formatDateWithMonthName } from "@/utils/datoUtils";
import DocumentComponentVisning from "@/components/document/DocumentComponentVisning";
import { Accordion } from "@navikt/ds-react";
import { ReferatDTO } from "@/sider/dialogmoter/types/dialogmoteReferatTypes";

const texts = {
  avholdtMote: "Referat fra møte",
};

interface Props {
  mote: DialogmoteDTO;
  referat: ReferatDTO;
  isEndretReferat: boolean;
}

export default function ReferatFraMoteHistorikkEvent({
  mote,
  referat,
  isEndretReferat,
}: Props) {
  const moteDatoTekst = formatDateWithMonthName(mote.tid);
  const suffix = isEndretReferat
    ? ` - Endret ${formatDateWithMonthName(referat.updatedAt)}`
    : "";

  return (
    <>
      <Accordion.Header>{`${texts.avholdtMote} ${moteDatoTekst}${suffix}`}</Accordion.Header>
      <Accordion.Content>
        {referat.document.map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
      </Accordion.Content>
    </>
  );
}
