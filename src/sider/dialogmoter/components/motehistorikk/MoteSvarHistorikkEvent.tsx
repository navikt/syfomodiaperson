import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import React, { useState } from "react";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { Accordion, HStack } from "@navikt/ds-react";
import { DialogmoteStedInfo } from "@/sider/dialogmoter/components/DialogmoteStedInfo";
import DialogmoteVeilederInfo from "@/sider/dialogmoter/components/DialogmoteVeilederInfo";
import { MoteSvarHistorikkInnkalling } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkInnkalling";
import { MoteSvarHistorikkEndringer } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkEndringer";

const getHeaderText = (mote: DialogmoteDTO): string => {
  const moteDato = tilDatoMedManedNavn(mote.tid);
  switch (mote.status) {
    case DialogmoteStatus.AVLYST:
      return `Avlyst møte ${moteDato}`;
    case DialogmoteStatus.FERDIGSTILT:
      return `Møte ${moteDato}`;
    default:
      return "";
  }
};

interface Props {
  dialogmote: DialogmoteDTO;
}

export default function MoteSvarHistorikkEvent({ dialogmote }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccordionClick = () => {
    if (!isOpen) {
      Amplitude.logEvent({
        type: EventType.AccordionOpen,
        data: {
          tekst: `Åpne møtesvar-historikk accordion`,
          url: window.location.href,
        },
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header onClick={handleAccordionClick}>
        {getHeaderText(dialogmote)}
      </Accordion.Header>
      <Accordion.Content>
        <HStack gap="4">
          <div>
            <DialogmoteStedInfo dialogmote={dialogmote} />
            <DialogmoteVeilederInfo dialogmote={dialogmote} />
          </div>
          <MoteSvarHistorikkInnkalling dialogmote={dialogmote} />
          <MoteSvarHistorikkEndringer dialogmote={dialogmote} />
        </HStack>
      </Accordion.Content>
    </Accordion.Item>
  );
}
