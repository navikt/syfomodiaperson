import React, { ReactElement } from "react";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import DocumentComponentVisning from "@/components/document/DocumentComponentVisning";
import { Accordion } from "@navikt/ds-react";

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
      <>
        <Accordion.Header>{`${texts.avlystMote} ${moteDatoTekst}`}</Accordion.Header>
        <Accordion.Content>
          {document.map((component, index) => (
            <DocumentComponentVisning
              key={index}
              documentComponent={component}
            />
          ))}
        </Accordion.Content>
      </>
    );
  }

  return (
    <>
      {ferdigstilteReferat.map((referat) => {
        const suffix = referat.endring
          ? ` - Endret ${tilDatoMedManedNavn(referat.updatedAt)}`
          : "";

        return (
          <>
            <Accordion.Header>{`${texts.avholdtMote} ${moteDatoTekst}${suffix}`}</Accordion.Header>
            <Accordion.Content>
              {referat.document.map((component, index) => (
                <DocumentComponentVisning
                  key={index}
                  documentComponent={component}
                />
              ))}
            </Accordion.Content>
          </>
        );
      })}
    </>
  );
}
