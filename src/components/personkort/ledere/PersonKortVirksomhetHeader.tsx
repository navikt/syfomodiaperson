import { formaterOrgnr } from "@/utils";
import {
  BodyShort,
  CopyButton,
  Heading,
  Tooltip,
  VStack,
} from "@navikt/ds-react";

const texts = {
  copyOrganisasjonsnummer: "Kopier organisasjonsnummer",
  copiedOrganisasjonsnummer: "Organisasjonsnummeret er kopiert",
};

interface Props {
  headingId: string;
  virksomhetsnavn: string;
  virksomhetsnummer: string;
}

/** Displays the organisation name and number with a copy button. */
export function PersonKortVirksomhetHeader({
  headingId,
  virksomhetsnavn,
  virksomhetsnummer,
}: Props) {
  return (
    <VStack gap="space-4">
      <Heading
        level="3"
        size="small"
        id={headingId}
        className="min-w-0 break-words"
      >
        {virksomhetsnavn}
      </Heading>
      <div className="flex items-center gap-0.5">
        <BodyShort size="small">{formaterOrgnr(virksomhetsnummer)}</BodyShort>
        <Tooltip content={texts.copyOrganisasjonsnummer}>
          <CopyButton
            copyText={virksomhetsnummer}
            title={texts.copyOrganisasjonsnummer}
            activeText={texts.copiedOrganisasjonsnummer}
            size="xsmall"
          />
        </Tooltip>
      </div>
    </VStack>
  );
}
