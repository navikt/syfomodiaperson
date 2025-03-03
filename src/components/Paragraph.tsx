import { BodyLong, BodyShort, Label } from "@navikt/ds-react";
import React from "react";

interface ParagraphProps {
  label: string;
  body: string;
}

export const Paragraph = ({ label, body }: ParagraphProps) => {
  return (
    <div className="mb-4">
      <Label size="small">{label}</Label>
      <BodyLong size="small">{body}</BodyLong>
    </div>
  );
};

export const ParagraphLarge = ({ label, body }: ParagraphProps) => {
  return (
    <div className="mb-4">
      <div className={"navds-label text-xl mt-0 mb-2"}>{label}</div>
      <BodyShort size={"small"} className={"leading-7"}>
        {body}
      </BodyShort>
    </div>
  );
};
