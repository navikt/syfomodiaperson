import { FortidenImage } from "../../../../../img/ImageComponents";
import { BodyLong, Heading } from "@navikt/ds-react";
import React from "react";

interface Props {
  title: string;
  subtitle: string;
}

export default function DialogmoteHistorikkHeader({ title, subtitle }: Props) {
  return (
    <div className="flex flex-row mb-4">
      <img src={FortidenImage} alt="moteikon" className="w-12 mr-4" />
      <div className="flex flex-col">
        <Heading level="2" size="medium" className="">
          {title}
        </Heading>
        <BodyLong size="small">{subtitle}</BodyLong>
      </div>
    </div>
  );
}
