import { MerInformasjonImage } from "../../img/ImageComponents";
import React from "react";
import { Tooltip } from "@navikt/ds-react";

export default function ImportantInformationIcon() {
  return (
    <Tooltip content="Utdypende informasjon" className="z-20">
      <img
        height={18}
        width={18}
        alt="Viktig informasjon"
        src={MerInformasjonImage}
        className="max-w-[18px]"
      />
    </Tooltip>
  );
}
