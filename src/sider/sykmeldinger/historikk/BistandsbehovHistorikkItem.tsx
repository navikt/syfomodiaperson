import { Accordion } from "@navikt/ds-react";
import { formatDateWithMonthName } from "@/utils/datoUtils";
import { Paragraph } from "@/components/Paragraph";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave.ts";

const texts = {
  received: "Mottatt",
  status: "Status",
  processed: "Behandlet",
  processedBy: "Behandlet av",
  processedStatus: "Behandlet",
};

interface Props {
  oppgave: PersonOppgave;
}

export function BistandsbehovHistorikkItem({ oppgave }: Props) {
  const { data: veilederinfo } = useVeilederInfoQuery(
    oppgave.behandletVeilederIdent ?? "",
  );
  if (!oppgave.behandletTidspunkt || !oppgave.behandletVeilederIdent) {
    return null;
  }

  const header = `Bistandsbehov - ${formatDateWithMonthName(oppgave.behandletTidspunkt)}`;

  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>
        <Paragraph
          label={texts.received}
          body={formatDateWithMonthName(oppgave.opprettet)}
        />
        <Paragraph label={texts.status} body={texts.processedStatus} />
        <Paragraph
          label={texts.processed}
          body={formatDateWithMonthName(oppgave.behandletTidspunkt)}
        />
        <Paragraph
          label={texts.processedBy}
          body={veilederinfo?.fulltNavn() || oppgave.behandletVeilederIdent}
        />
      </Accordion.Content>
    </Accordion.Item>
  );
}
