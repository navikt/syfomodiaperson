import React from "react";
import { MeldingTilBehandlerSkjema } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Alert, Box, Heading } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

const texts = {
  header: "Dialogmelding til behandler",
  alertInfo:
    "Personen har ikke et aktivt sykefravær. Dialogmeldingen skal kun benyttes i sykefraværsoppfølgingen. Meldingen vises til innbyggeren på Min side.",
};

export const MeldingTilBehandler = () => {
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  return (
    <Box background="surface-default" className="p-4 flex flex-col gap-4">
      <Heading level="2" size="medium">
        {texts.header}
      </Heading>
      {!hasActiveOppfolgingstilfelle && (
        <Alert variant="warning" size="small">
          {texts.alertInfo}
        </Alert>
      )}
      <MeldingTilBehandlerSkjema />
    </Box>
  );
};
