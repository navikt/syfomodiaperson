import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { FortidenImage } from "../../../../../img/ImageComponents";
import { Accordion, BodyLong, BodyShort, Box, Heading } from "@navikt/ds-react";
import React from "react";
import MoteSvarHistorikkEvent from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkEvent";

const texts = {
  header: "Møtesvarhistorikk",
  subtitle: "Oversikt over svar på tidligere innkallinger til dialogmøter",
  ingenSvarHistorikk: "Ingen tidligere møtesvar",
};

interface Props {
  historiskeMoter: DialogmoteDTO[];
}

export function MoteSvarHistorikk({ historiskeMoter }: Props) {
  const hasMoteHistorikk = historiskeMoter.length > 0;

  return (
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
