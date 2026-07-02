import React from "react";
import { Alert, BodyShort, Box, Button, Loader, Table } from "@navikt/ds-react";
import { useSoknaderQuery } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import {
  Soknad,
  SoknadStatusDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArUtenManednavn,
} from "@/utils/datoUtils";

const texts = {
  pending: "Henter søknader...",
  error: "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
  innsendtTidspunkt: "Innsendt tidspunkt",
  periode: "Søkt periode",
  status: "Status",
  startBehandling: "Start behandling",
  ingenSoknader: "Ingen mottatte søknader eller fattede vedtak",
};

const statusTexts: { [key in SoknadStatusDTO]: string } = {
  [SoknadStatusDTO.MOTTATT]: "Mottatt",
  [SoknadStatusDTO.INNVILGET]: "Innvilget",
};

function getStatusColumn(soknad: Soknad) {
  if (!soknad.vedtak) {
    return (
      // TODO: Legge på onclick til vedtaksiden her
      <Button size="small" variant="secondary">
        {texts.startBehandling}
      </Button>
    );
  }
  return statusTexts[soknad.status] ?? soknad.status; // Forslag: Kan gjøres om til feks grønn, gul og rød Tag etterhvert
}

function sorterEtterInnsendtTidspunktNyestForst(soknader: Soknad[]) {
  return [...soknader].sort(
    (a, b) => b.innsendtTidspunkt.getTime() - a.innsendtTidspunkt.getTime(),
  );
}

export function Utenlandsopphold() {
  const { data, isPending, isError } = useSoknaderQuery();

  return (
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
              <Table.HeaderCell scope="col">{texts.status}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sorterEtterInnsendtTidspunktNyestForst(data.soknader).map(
              (soknad) => (
                <Table.Row key={soknad.soknadId}>
                  <Table.HeaderCell scope="row">
                    {tilLesbarDatoMedArstall(soknad.innsendtTidspunkt)}
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
                  <Table.DataCell>{getStatusColumn(soknad)}</Table.DataCell>
                </Table.Row>
              ),
            )}
          </Table.Body>
        </Table>
      )}
    </Box>
  );
}
