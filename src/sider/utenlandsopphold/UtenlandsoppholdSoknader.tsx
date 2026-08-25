import React, { useState } from "react";
import { Alert, BodyShort, Box, Button, Loader, Table } from "@navikt/ds-react";
import { useSoknaderQuery } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import {
  Soknad,
  SoknadStatusDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import {
  tilLesbarDatoMedArUtenManedNavn,
  tilLesbarPeriodeMedArUtenManednavn,
} from "@/utils/datoUtils";
import { Link } from "react-router-dom";
import { useNotification } from "@/context/notification/NotificationContext.tsx";

const TIDLIGST_INNSENDT_TIDSPUNKT_FOR_BEHANDLING_I_MODIA = new Date(
  // 1. august 2026
  2026,
  7,
  1,
);

const texts = {
  infotrygdInfo:
    "Pass på at en søknad ikke blir behandlet både i Infotrygd og i Modia. Det er ikke lagt inn sperre mot slik dobbeltbehandling per nå.",
  pending: "Henter søknader...",
  error: "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
  innsendtTidspunkt: "Innsendt tidspunkt",
  periode: "Søkt periode",
  saksbehandling: "Saksbehandling",
  saksbehandlingVedtak: (fattetTidspunkt: Date, fattetAv: string) =>
    `Behandlet ${tilLesbarDatoMedArUtenManedNavn(fattetTidspunkt)} av ${fattetAv}`,
  saksbehandlingIngenVedtak: "Ikke behandlet i Modia",
  status: "Status",
  startBehandling: "Start behandling",
  statusTextSoknadBehandlesIInfotrygd: "Må behandles i Infotrygd",
  ingenSoknader: "Ingen mottatte søknader eller fattede vedtak",
};

export const statusTexts: { [key in SoknadStatusDTO]: string } = {
  [SoknadStatusDTO.MOTTATT]: "Mottatt",
  [SoknadStatusDTO.INNVILGET]: "Innvilget",
  [SoknadStatusDTO.DELVIS_INNVILGET]: "Delvis innvilget",
  [SoknadStatusDTO.AVSLAG]: "Avslått",
};

function getStatusColumn(soknad: Soknad) {
  const kanBehandlesIModia =
    soknad.innsendtTidspunkt >
    TIDLIGST_INNSENDT_TIDSPUNKT_FOR_BEHANDLING_I_MODIA;

  if (!soknad.vedtak) {
    if (kanBehandlesIModia) {
      return (
        <Button
          as={Link}
          to={`/sykefravaer/utenlandsopphold/${soknad.soknadId}`}
          size="small"
          variant="secondary"
        >
          {texts.startBehandling}
        </Button>
      );
    } else {
      return <em>{texts.statusTextSoknadBehandlesIInfotrygd}</em>;
    }
  }

  return statusTexts[soknad.status] ?? soknad.status; // Forslag: Kan gjøres om til feks grønn, gul og rød Tag etterhvert
}

function sorterEtterInnsendtTidspunktNyestForst(soknader: Soknad[]) {
  return [...soknader].sort(
    (a, b) => b.innsendtTidspunkt.getTime() - a.innsendtTidspunkt.getTime(),
  );
}

export function UtenlandsoppholdSoknader() {
  const { data, isPending, isError } = useSoknaderQuery();

  const { notification } = useNotification();
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      {notification && isNotificationVisible && (
        <Alert
          variant="success"
          closeButton
          onClose={() => setIsNotificationVisible(false)}
        >
          {notification.message}
        </Alert>
      )}

      <Alert variant="info">{texts.infotrygdInfo}</Alert>

      <Box background="default" padding="space-16" className="flex flex-col">
        {isPending ? (
          <Loader size="xlarge" title={texts.pending} />
        ) : isError ? (
          <Alert size="small" variant="error">
            {texts.error}
          </Alert>
        ) : !data.soknader.length ? (
          <BodyShort>{texts.ingenSoknader}</BodyShort>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">
                  {texts.innsendtTidspunkt}
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">{texts.periode}</Table.HeaderCell>
                <Table.HeaderCell scope="col">
                  {texts.saksbehandling}
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">{texts.status}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sorterEtterInnsendtTidspunktNyestForst(data.soknader).map(
                (soknad) => (
                  <Table.Row key={soknad.soknadId}>
                    <Table.HeaderCell scope="row">
                      {tilLesbarDatoMedArUtenManedNavn(
                        soknad.innsendtTidspunkt,
                      )}
                    </Table.HeaderCell>
                    <Table.DataCell>
                      {soknad.soktePerioder.map((periode, index) => (
                        <div key={index}>
                          {tilLesbarPeriodeMedArUtenManednavn(
                            periode.fom,
                            periode.tom,
                          )}
                        </div>
                      ))}
                    </Table.DataCell>
                    {soknad.vedtak ? (
                      <Table.DataCell>
                        {texts.saksbehandlingVedtak(
                          soknad.vedtak.fattetTidspunkt,
                          soknad.vedtak.fattetAv,
                        )}
                      </Table.DataCell>
                    ) : (
                      <Table.DataCell>
                        <i>{texts.saksbehandlingIngenVedtak}</i>
                      </Table.DataCell>
                    )}
                    <Table.DataCell>{getStatusColumn(soknad)}</Table.DataCell>
                  </Table.Row>
                ),
              )}
            </Table.Body>
          </Table>
        )}
      </Box>
    </div>
  );
}
