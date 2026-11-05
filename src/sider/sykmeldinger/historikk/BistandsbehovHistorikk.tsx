import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import {
  getAllBehandledePersonOppgaver,
  getAllUbehandledePersonOppgaver,
} from "@/utils/personOppgaveUtils";
import { BistandsbehovHistorikkItem } from "@/sider/sykmeldinger/historikk/BistandsbehovHistorikkItem.tsx";

const texts = {
  header: "Historikk",
  noOppgaver: "Det finnes ingen tidligere bistandsbehov.",
  loading: "Laster historikk …",
  error: "Kunne ikke hente historikken.",
};

interface Props {
  oppgaver: PersonOppgave[];
  isLoading: boolean;
  isError: boolean;
}

export default function BistandsbehovHistorikk({
  oppgaver,
  isLoading,
  isError,
}: Props) {
  const bistandsbehovOppgaver = [
    ...getAllBehandledePersonOppgaver(
      oppgaver,
      PersonOppgaveType.BEHANDLER_BER_OM_BISTAND,
    ),
    ...getAllUbehandledePersonOppgaver(
      oppgaver,
      PersonOppgaveType.BEHANDLER_BER_OM_BISTAND,
    ),
  ].sort((a, b) => b.opprettet.getTime() - a.opprettet.getTime());

  return (
    <Box
      padding="space-24"
      background="default"
      className="flex flex-col gap-8 mb-2"
    >
      <div>
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        {!isLoading && !isError && bistandsbehovOppgaver.length === 0 && (
          <BodyShort size="small">{texts.noOppgaver}</BodyShort>
        )}
        {isLoading && <BodyShort size="small">{texts.loading}</BodyShort>}
        {isError && <BodyShort size="small">{texts.error}</BodyShort>}
      </div>
      {!isLoading && !isError && (
        <Accordion>
          {bistandsbehovOppgaver.map((oppgave) => (
            <BistandsbehovHistorikkItem oppgave={oppgave} key={oppgave.uuid} />
          ))}
        </Accordion>
      )}
    </Box>
  );
}
