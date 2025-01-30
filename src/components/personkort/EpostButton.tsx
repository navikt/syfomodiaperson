import React from "react";
import { BodyShort, CopyButton as CopyButtonAksel } from "@navikt/ds-react";
import { CheckmarkIcon } from "@navikt/aksel-icons";

const textEpostCopied = (epost?: string) => {
  return `${epost} er kopiert!`;
};

interface EpostButtonProps {
  epost: string;
  isActive: boolean;
}

const EpostButton = ({ epost, isActive }: EpostButtonProps) => {
  return (
    <div className="flex px-2 col-sm-3 items-center">
      <BodyShort
        weight={`${isActive ? "semibold" : "regular"}`}
        size="small"
        className={`${isActive ? "strong" : ""}`}
      >
        {epost}
      </BodyShort>
      <CopyButtonAksel
        size="small"
        copyText={epost}
        activeIcon={<CheckmarkIcon title={textEpostCopied(epost)} />}
      />
    </div>
  );
};

export default EpostButton;
