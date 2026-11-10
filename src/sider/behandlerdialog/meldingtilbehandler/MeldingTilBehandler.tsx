import { MeldingTilBehandlerSkjema } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { BodyShort, Box, Heading, InfoCard } from "@navikt/ds-react";
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useMeldingTilBehandlerDraftQuery } from "@/data/behandlerdialog/meldingtilbehandlerDraftQueryHooks";
import AppSpinner from "@/components/AppSpinner";

const texts = {
  header: "Dialogmelding til behandler",
  ingenAktivtTilfelleTitle: "Personen har ikke et aktivt oppfølgingstilfelle",
  ingenAktivtTilfelleBody:
    "Du kan likevel sende en dialogmelding til behandler så lenge henvendelsen gjelder sykefraværsoppfølging. Meldingen blir synlig for innbyggeren på innloggede sider.",
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
        <InfoCard data-color="warning" size="small">
          <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
            <InfoCard.Title as="h3">
              {texts.ingenAktivtTilfelleTitle}
            </InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            <BodyShort size="small">{texts.ingenAktivtTilfelleBody}</BodyShort>
          </InfoCard.Content>
        </InfoCard>
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
