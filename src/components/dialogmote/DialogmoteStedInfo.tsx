import { BodyShort } from "@navikt/ds-react";
import React from "react";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";

const texts = {
  moteSted: "Sted",
};

interface DialomoteStedInfoProps {
  dialogmote: DialogmoteDTO;
}

export const DialogmoteStedInfo = ({ dialogmote }: DialomoteStedInfoProps) => (
  <BodyShort size="small">{`${texts.moteSted}: ${dialogmote.sted}`}</BodyShort>
);
