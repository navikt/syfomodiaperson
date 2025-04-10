import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { VurderAktivitetskrav } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { AktivitetskravHistorikk } from "@/sider/aktivitetskrav/historikk/AktivitetskravHistorikk";
import { StartNyVurdering } from "./vurdering/StartNyVurdering";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Alert } from "@navikt/ds-react";

const texts = {
  noTilfelle:
    "Vi finner ingen aktiv sykmelding på denne personen. Du kan likevel vurdere aktivitetskravet hvis det er behov for det.",
};

export const AktivitetskravSide = () => {
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const { data } = useAktivitetskravQuery();

  const aktivitetskrav = data.find(
    (aktivitetskrav) =>
      aktivitetskrav.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT &&
      aktivitetskrav.status !== AktivitetskravStatus.LUKKET
  );
  const showStartNyVurdering = !aktivitetskrav || aktivitetskrav.inFinalState;

  return (
    <div className="w-full">
      {!hasActiveOppfolgingstilfelle && (
        <Alert
          contentMaxWidth={false}
          variant="warning"
          size="small"
          className="mb-4"
        >
          {texts.noTilfelle}
        </Alert>
      )}
      {showStartNyVurdering ? (
        <StartNyVurdering aktivitetskrav={aktivitetskrav} />
      ) : (
        <VurderAktivitetskrav aktivitetskrav={aktivitetskrav} />
      )}
      <AktivitetskravHistorikk />
    </div>
  );
};
