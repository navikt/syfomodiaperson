import React from "react";
import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { MoteHistorikkUnntak } from "@/sider/dialogmoter/components/motehistorikk/MoteHistorikkUnntak";
import { Accordion, BodyShort, Box } from "@navikt/ds-react";
import MoteHistorikkEvent from "@/sider/dialogmoter/components/motehistorikk/MoteHistorikkEvent";
import DialogmoteHistorikkHeader from "@/sider/dialogmoter/components/motehistorikk/DialogmoteHistorikkHeader";
import { IkkeAktuellVurdering } from "@/sider/dialogmoter/hooks/useGetDialogmoteIkkeAktuell";
import MoteHistorikkIkkeAktuell from "@/sider/dialogmoter/components/motehistorikk/MoteHistorikkIkkeAktuell";

const texts = {
  header: "Møtehistorikk",
  subtitle:
    "Oversikt over tidligere dialogmøter som ble innkalt i Modia (inkluderer ikke historikk fra Arena).",
  ingenHistoriskeMoter: "Ingen tidligere møtehistorikk",
  avlystMote: "Avlysning av møte",
  avholdtMote: "Referat fra møte",
};

interface HistorikkEvent {
  eventDate: Date;
  content: React.ReactNode;
}

function createHistorikkEvents(
  historiskeMoter: DialogmoteDTO[],
  dialogmoteunntak: UnntakDTO[],
  dialogmoteikkeaktuell: IkkeAktuellVurdering[]
): HistorikkEvent[] {
  return [
    ...dialogmoteHistorikkEvents(historiskeMoter),
    ...dialogmoteUnntakEvents(dialogmoteunntak),
    ...dialogmoteIkkeAktuellEvents(dialogmoteikkeaktuell),
  ].sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
}

function dialogmoteHistorikkEvents(
  historiskeMoter: DialogmoteDTO[]
): HistorikkEvent[] {
  return historiskeMoter.map((mote) => ({
    eventDate: new Date(mote.tid),
    content: <MoteHistorikkEvent mote={mote} />,
  }));
}

function dialogmoteUnntakEvents(
  dialogmoteunntak: UnntakDTO[]
): HistorikkEvent[] {
  return dialogmoteunntak.map((unntak) => ({
    eventDate: new Date(unntak.createdAt),
    content: <MoteHistorikkUnntak unntak={unntak} />,
  }));
}

function dialogmoteIkkeAktuellEvents(
  dialogmoteikkeaktuell: IkkeAktuellVurdering[]
): HistorikkEvent[] {
  return dialogmoteikkeaktuell.map((ikkeaktuell) => ({
    eventDate: new Date(ikkeaktuell.createdAt),
    content: <MoteHistorikkIkkeAktuell ikkeAktuellVurdering={ikkeaktuell} />,
  }));
}

interface Props {
  historiskeMoter: DialogmoteDTO[];
  dialogmoteunntak: UnntakDTO[];
  dialogmoteikkeaktuell: IkkeAktuellVurdering[];
}

export default function MotehistorikkPanel({
  historiskeMoter,
  dialogmoteunntak,
  dialogmoteikkeaktuell,
}: Props) {
  const historikkEvents = createHistorikkEvents(
    historiskeMoter,
    dialogmoteunntak,
    dialogmoteikkeaktuell
  );

  return (
    <Box background="surface-default" padding="6">
      <DialogmoteHistorikkHeader
        title={texts.header}
        subtitle={texts.subtitle}
      />
      {historikkEvents.length > 0 ? (
        <Accordion>
          {historikkEvents.map((event, index) => (
            <Accordion.Item key={index}>{event.content}</Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <BodyShort>{texts.ingenHistoriskeMoter}</BodyShort>
      )}
    </Box>
  );
}
