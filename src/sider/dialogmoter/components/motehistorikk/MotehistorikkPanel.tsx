import { FortidenImage } from "../../../../../img/ImageComponents";
import React from "react";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { MoteHistorikkUnntak } from "@/sider/dialogmoter/components/motehistorikk/MoteHistorikkUnntak";
import { Accordion, BodyLong, BodyShort, Box, Heading } from "@navikt/ds-react";
import MoteHistorikkEvent from "@/sider/dialogmoter/components/motehistorikk/MoteHistorikkEvent";

const texts = {
  header: "Møtehistorikk",
  subtitle:
    "Oversikt over tidligere dialogmøter som ble innkalt i Modia (inkluderer ikke historikk fra Arena).",
  ingenHistoriskeMoter: "Ingen tidligere møtehistorikk",
};

interface Props {
  dialogmoteunntak: UnntakDTO[];
  historiskeMoter: DialogmoteDTO[];
}

export function MotehistorikkPanel({
  historiskeMoter,
  dialogmoteunntak,
}: Props) {
  const hasMotehistorikk =
    historiskeMoter.length > 0 || dialogmoteunntak.length > 0;

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
      {hasMotehistorikk ? (
        <Accordion>
          {historiskeMoter.map((mote, index) => (
            <MoteHistorikkEvent key={index} mote={mote} />
          ))}
          {dialogmoteunntak.map((unntak, index) => (
            <MoteHistorikkUnntak key={index} unntak={unntak} />
          ))}
        </Accordion>
      ) : (
        <BodyShort>{texts.ingenHistoriskeMoter}</BodyShort>
      )}
    </Box>
  );
}
