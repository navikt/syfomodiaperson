import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { FortidenImage } from "../../../../img/ImageComponents";
import { Accordion, BodyLong, Box, Heading, Label } from "@navikt/ds-react";
import React from "react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { DialogmoteVeilederInfo } from "@/components/dialogmote/DialogmoteVeilederInfo";
import { DialogmoteStedInfo } from "@/components/dialogmote/DialogmoteStedInfo";
import { ArbeidsgiverSvar } from "@/components/dialogmote/svar/ArbeidsgiverSvar";
import { ArbeidstakerSvar } from "@/components/dialogmote/svar/ArbeidstakerSvar";
import { BehandlerSvar } from "@/components/dialogmote/svar/BehandlerSvar";

const texts = {
  header: "Møtesvarhistorikk",
  subtitle: "Oversikt over svar på tidligere innkallinger til dialogmøter",
};

interface Props {
  dialogmote: DialogmoteDTO;
}

const InnkallingSvar = ({ dialogmote }: Props) => {
  const innkallingArbeidstaker = dialogmote.arbeidstaker.varselList.find(
    ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
  );
  const innkallingArbeidsgiver = dialogmote.arbeidsgiver.varselList.find(
    ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
  );
  const innkallingBehandler =
    dialogmote.behandler &&
    dialogmote.behandler.varselList.find(
      ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
    );

  return (
    <div className="mt-4">
      <Label size="small">{`Innkalling sendt ${tilDatoMedManedNavn(
        dialogmote.createdAt
      )} - svar:`}</Label>
      <div className="flex flex-col gap-4">
        {innkallingArbeidsgiver && (
          <ArbeidsgiverSvar
            varsel={innkallingArbeidsgiver}
            virksomhetsnummer={dialogmote.arbeidsgiver.virksomhetsnummer}
            defaultClosed
          />
        )}
        {innkallingArbeidstaker && (
          <ArbeidstakerSvar varsel={innkallingArbeidstaker} defaultClosed />
        )}
        {innkallingBehandler && (
          <BehandlerSvar
            varsel={innkallingBehandler}
            behandlerNavn={dialogmote.behandler.behandlerNavn}
          />
        )}
      </div>
    </div>
  );
};

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

interface MoteSvarHistorikkProps {
  historiskeMoter: DialogmoteDTO[];
}

export const MoteSvarHistorikk = ({
  historiskeMoter,
}: MoteSvarHistorikkProps) => (
  <Box background="surface-default" className="p-8">
    <div className="flex flex-row mb-4">
      <img src={FortidenImage} alt="moteikon" className="w-12 mr-4" />
      <div className="flex flex-col">
        <Heading level="2" size="medium" className="">
          {texts.header}
        </Heading>
        <BodyLong size="small">{texts.subtitle}</BodyLong>
      </div>
    </div>
    <Accordion>
      {historiskeMoter.map((mote, index) => (
        <Accordion.Item key={index}>
          <Accordion.Header>{getHeaderText(mote)}</Accordion.Header>
          <Accordion.Content>
            <DialogmoteStedInfo dialogmote={mote} />
            <DialogmoteVeilederInfo dialogmote={mote} />
            <InnkallingSvar dialogmote={mote} />
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  </Box>
);
