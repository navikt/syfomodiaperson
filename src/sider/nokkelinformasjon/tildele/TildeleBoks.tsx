import { HGrid } from "@navikt/ds-react";
import { Card } from "@/components/Card";
import TildelOppfolgingsenhetModal from "@/components/personkort/tildele/TildelOppfolgingsenhetModal";
import React, { useRef } from "react";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { OppfolgingsenhetInnhold } from "@/components/personkort/tildele/OppfolgingsenhetInnhold";

//TODO: Rename
export const TildeleBoks = () => {
  const { toggles } = useFeatureToggles();
  const tildelOppfolgingsenhetModalRef = useRef<HTMLDialogElement>(null);

  return (
    toggles.isTildelOppfolgingsenhetEnabled && (
      <HGrid
        gap={"4"}
        className={"mb-4"}
        columns={2}
        maxWidth={{ xl: "1440px" }}
      >
        <Card>
          <OppfolgingsenhetInnhold modalRef={tildelOppfolgingsenhetModalRef} />
          <TildelOppfolgingsenhetModal ref={tildelOppfolgingsenhetModalRef} />
        </Card>
      </HGrid>
    )
  );
};
