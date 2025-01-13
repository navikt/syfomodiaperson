import React from "react";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { MoteHistorikkUnntak } from "@/sider/dialogmoter/components/motehistorikk/MoteHistorikkUnntak";
import { Accordion, BodyShort, Box } from "@navikt/ds-react";
import MoteHistorikkEvent from "@/sider/dialogmoter/components/motehistorikk/MoteHistorikkEvent";
import DialogmoteHistorikkHeader from "@/sider/dialogmoter/components/motehistorikk/DialogmoteHistorikkHeader";

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
    <Box background="surface-default" padding="6">
      <DialogmoteHistorikkHeader
        title={texts.header}
        subtitle={texts.subtitle}
      />
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
