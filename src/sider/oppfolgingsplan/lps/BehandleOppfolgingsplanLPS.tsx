import React from "react";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";
import { StatusKanImage } from "../../../../img/ImageComponents";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import { BodyShort, Button } from "@navikt/ds-react";

const texts = {
  marker: "Marker som behandlet",
};

interface Props {
  oppfolgingsplanLPS: OppfolgingsplanLPS;
}

export default function BehandleOppfolgingsplanLPS({
  oppfolgingsplanLPS,
}: Props) {
  const { data: personoppgaver } = usePersonoppgaverQuery();
  const personoppgave = personoppgaver.find(
    (personoppgave) => personoppgave.referanseUuid === oppfolgingsplanLPS.uuid
  );
  const behandlePersonoppgave = useBehandlePersonoppgave();

  return (
    <>
      {personoppgave && !personoppgave.behandletTidspunkt && (
        <Button
          variant="secondary"
          size="small"
          onClick={() => behandlePersonoppgave.mutate(personoppgave.uuid)}
          loading={behandlePersonoppgave.isPending}
        >
          {texts.marker}
        </Button>
      )}
      {personoppgave && personoppgave.behandletTidspunkt && (
        <BodyShort size="small" className="flex gap-1 items-center">
          <img
            src={StatusKanImage}
            alt="Ferdig behandlet"
            className="w-6 h-6"
          />
          {`Ferdigbehandlet: ${toDatePrettyPrint(
            personoppgave.behandletTidspunkt
          )} av ${personoppgave.behandletVeilederIdent}`}
        </BodyShort>
      )}
    </>
  );
}
