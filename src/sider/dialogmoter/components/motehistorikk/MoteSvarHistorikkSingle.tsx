import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { Box } from "@navikt/ds-react";
import React from "react";
import { MoteSvarHistorikkInnkalling } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkInnkalling.tsx";
import { MoteSvarHistorikkEndringer } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkEndringer.tsx";
import DialogmoteHistorikkHeader from "@/sider/dialogmoter/components/motehistorikk/DialogmoteHistorikkHeader.tsx";

const texts = {
  motesvarHeading: "Møtesvar",
  motesvarSubheading: "Viser alle svar for det aktuelle møtet",
};

interface Props {
  dialogmote: DialogmoteDTO;
}

export function MoteSvarHistorikkSingle({ dialogmote }: Props) {
  return (
    <Box background="default" className="flex flex-col gap-4 p-6">
      <DialogmoteHistorikkHeader
        title={texts.motesvarHeading}
        subtitle={texts.motesvarSubheading}
      />
      <MoteSvarHistorikkInnkalling dialogmote={dialogmote} />
      <MoteSvarHistorikkEndringer dialogmote={dialogmote} />
    </Box>
  );
}
