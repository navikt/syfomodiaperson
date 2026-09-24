import { BodyLong, Heading } from "@navikt/ds-react";

interface Props {
  title: string;
  subtitle: string;
}

export default function DialogmoteHistorikkHeader({ title, subtitle }: Props) {
  return (
    <div className="flex flex-row mb-4">
      <div className="flex flex-col">
        <Heading level="2" size="medium" className="">
          {title}
        </Heading>
        <BodyLong size="small">{subtitle}</BodyLong>
      </div>
    </div>
  );
}
