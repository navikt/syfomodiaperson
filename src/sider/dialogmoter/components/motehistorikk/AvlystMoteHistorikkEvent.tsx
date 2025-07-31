import {
  DialogmoteDTO,
  MotedeltakerVarselType,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { Accordion } from "@navikt/ds-react";
import DocumentComponentVisning from "@/components/document/DocumentComponentVisning";
import React from "react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";

const texts = {
  avlystMote: "Avlysning av møte",
};

interface Props {
  mote: DialogmoteDTO;
}

export default function AvlystMoteHistorikkEvent({ mote }: Props) {
  const moteDatoTekst = tilDatoMedManedNavn(mote.tid);
  const document =
    mote.arbeidstaker.varselList.find(
      (varsel) => varsel.varselType === MotedeltakerVarselType.AVLYST
    )?.document || [];

  return (
    <>
      <Accordion.Header>{`${texts.avlystMote} ${moteDatoTekst}`}</Accordion.Header>
      <Accordion.Content>
        {document.map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
      </Accordion.Content>
    </>
  );
}
