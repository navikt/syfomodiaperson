import React from "react";
import { MeldingTilBehandlerSkjema } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Alert, Box, Heading } from "@navikt/ds-react";

const texts = {
  header: "Skriv til behandler",
  alertInfo:
    "Dialogmeldingen skal kun benyttes i sykefraværsoppfølgingen. Meldingen vises til innbyggeren på Min side.",
};

export const MeldingTilBehandler = () => {
  return (
    <Box background="surface-default" className="p-4 flex flex-col gap-4">
      <Heading level="2" size="medium">
        {texts.header}
      </Heading>
      <Alert variant="warning" size="small" inline>
        {texts.alertInfo}
      </Alert>
      <MeldingTilBehandlerSkjema />
    </Box>
  );
};
