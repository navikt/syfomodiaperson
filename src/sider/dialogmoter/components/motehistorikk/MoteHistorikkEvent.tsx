import React, { ReactElement } from "react";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import ForhandsvisDocumentAccordionItem from "@/sider/dialogmoter/components/motehistorikk/ForhandsvisDocumentAccordionItem";
import { DocumentComponentVisning } from "@/components/document/DocumentComponentVisning";

const texts = {
  avlystMote: "Avlysning av møte",
  avholdtMote: "Referat fra møte",
};

interface Props {
  mote: DialogmoteDTO;
}

export default function MoteHistorikkEvent({ mote }: Props): ReactElement {
  const isMoteAvlyst = mote.status === DialogmoteStatus.AVLYST;
  const { ferdigstilteReferat } = useDialogmoteReferat(mote);
  const moteDatoTekst = tilDatoMedManedNavn(mote.tid);

  if (isMoteAvlyst) {
    const document =
      mote.arbeidstaker.varselList.find(
        (varsel) => varsel.varselType === MotedeltakerVarselType.AVLYST
      )?.document || [];

    return (
      <ForhandsvisDocumentAccordionItem
        header={`${texts.avlystMote} ${moteDatoTekst}`}
      >
        {document.map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
      </ForhandsvisDocumentAccordionItem>
    );
  }

  return (
    <>
      {ferdigstilteReferat.map((referat, index) => {
        const suffix = referat.endring
          ? ` - Endret ${tilDatoMedManedNavn(referat.updatedAt)}`
          : "";

        return (
          <ForhandsvisDocumentAccordionItem
            key={index}
            header={`${texts.avholdtMote} ${moteDatoTekst}${suffix}`}
          >
            {referat.document.map((component, index) => (
              <DocumentComponentVisning
                key={index}
                documentComponent={component}
              />
            ))}
          </ForhandsvisDocumentAccordionItem>
        );
      })}
    </>
  );
}
