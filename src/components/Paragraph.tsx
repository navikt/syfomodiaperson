import { BodyLong, Label } from "@navikt/ds-react";

interface ParagraphProps {
  label: string;
  body: string;
}

export const Paragraph = ({ label, body }: ParagraphProps) => {
  return (
    <div className="mb-4">
      <Label size="small">{label}</Label>
      <BodyLong size="small" className="whitespace-pre-wrap">
        {body}
      </BodyLong>
    </div>
  );
};
