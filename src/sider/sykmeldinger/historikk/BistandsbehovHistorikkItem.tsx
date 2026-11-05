import { Accordion } from "@navikt/ds-react";
import { isBehandletOppgave } from "@/utils/personOppgaveUtils";
import { formatDateWithMonthName } from "@/utils/datoUtils";
import { Paragraph } from "@/components/Paragraph";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave.ts";

const texts = {
  received: "Mottatt",
  status: "Status",
  processed: "Behandlet",
  processedBy: "Behandlet av",
  unprocessedStatus: "Ubehandlet",
  processedStatus: "Behandlet",
};

interface Props {
  oppgave: PersonOppgave;
}

export function BistandsbehovHistorikkItem({ oppgave }: Props) {
  const { data: veilederinfo } = useVeilederInfoQuery(
    oppgave.behandletVeilederIdent ?? "",
  );
  const isBehandlet = isBehandletOppgave(oppgave);
  const header = `Bistandsbehov - ${formatDateWithMonthName(oppgave.opprettet)}`;

  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>
        <Paragraph
          label={texts.received}
          body={formatDateWithMonthName(oppgave.opprettet)}
        />
        <Paragraph
          label={texts.status}
          body={isBehandlet ? texts.processedStatus : texts.unprocessedStatus}
        />
        {isBehandlet &&
          oppgave.behandletTidspunkt &&
          oppgave.behandletVeilederIdent && (
            <>
              <Paragraph
                label={texts.processed}
                body={formatDateWithMonthName(oppgave.behandletTidspunkt)}
              />
              <Paragraph
                label={texts.processedBy}
                body={
                  veilederinfo?.fulltNavn() || oppgave.behandletVeilederIdent
                }
              />
            </>
          )}
      </Accordion.Content>
    </Accordion.Item>
  );
}
