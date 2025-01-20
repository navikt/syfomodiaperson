import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { Accordion, BodyShort, Box } from "@navikt/ds-react";
import React from "react";
import MoteSvarHistorikkEvent from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkEvent";
import DialogmoteHistorikkHeader from "@/sider/dialogmoter/components/motehistorikk/DialogmoteHistorikkHeader";

const texts = {
  header: "Møtesvarhistorikk",
  subtitle: "Oversikt over svar på tidligere dialogmøter",
  ingenSvarHistorikk: "Ingen tidligere møtesvar",
};

interface Props {
  historiskeMoter: DialogmoteDTO[];
}

export function MoteSvarHistorikk({ historiskeMoter }: Props) {
  const hasMoteHistorikk = historiskeMoter.length > 0;

  return (
    <Box background="surface-default" padding="6">
      <DialogmoteHistorikkHeader
        title={texts.header}
        subtitle={texts.subtitle}
      />
      {hasMoteHistorikk ? (
        <Accordion>
          {historiskeMoter.map((mote, index) => (
            <MoteSvarHistorikkEvent dialogmote={mote} key={index} />
          ))}
        </Accordion>
      ) : (
        <BodyShort>{texts.ingenSvarHistorikk}</BodyShort>
      )}
    </Box>
  );
}
