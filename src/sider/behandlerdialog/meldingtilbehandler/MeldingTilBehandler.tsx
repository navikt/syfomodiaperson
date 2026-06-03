import React from "react";
import { MeldingTilBehandlerSkjema } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Alert, Box, Heading } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useMeldingTilBehandlerDraftQuery } from "@/data/behandlerdialog/meldingtilbehandlerDraftQueryHooks";
import AppSpinner from "@/components/AppSpinner";

const texts = {
  header: "Dialogmelding til behandler",
  alertInfo:
    "Personen har ikke et aktivt oppfølgingstilfelle. Du kan likevel sende en dialogmelding til behandler så lenge henvendelsen gjelder sykefraværsoppfølging. Meldingen blir synlig for innbyggeren på innloggede sider.",
};

export function MeldingTilBehandler() {
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const getMeldingTilBehandlerDraftQuery = useMeldingTilBehandlerDraftQuery();

  return (
    <Box background="default" className="p-4 flex flex-col gap-4">
      <Heading level="2" size="medium">
        {texts.header}
      </Heading>
      {!hasActiveOppfolgingstilfelle && (
        <Alert variant="warning" size="small">
          {texts.alertInfo}
        </Alert>
      )}
      {getMeldingTilBehandlerDraftQuery.isPending ? (
        <AppSpinner />
      ) : (
        <MeldingTilBehandlerSkjema
          meldingTekst={getMeldingTilBehandlerDraftQuery.data?.tekst}
          meldingType={getMeldingTilBehandlerDraftQuery.data?.meldingType}
        />
      )}
    </Box>
  );
}
