import { useId } from "react";
import {
  BodyShort,
  Box,
  Heading,
  HGrid,
  Link,
  List,
  Tag,
  VStack,
} from "@navikt/ds-react";
import { Buildings2Icon } from "@navikt/aksel-icons";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { getVirksomhetsnavn } from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import { useVirksomheterQueries } from "@/data/virksomhet/virksomhetQueryHooks";
import { useNaringskodeQueries } from "@/data/virksomhet/ssbQueryHooks";
import { toNaringskodeRequest } from "@/utils/naringskodeUtil";
import { PersonKortVirksomhetHeader } from "./PersonKortVirksomhetHeader";
import { PersonKortVirksomhetLedere } from "./PersonKortVirksomhetLedere";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { lederHasActiveSykmelding } from "@/utils/ledereUtils";

const texts = {
  bransje: "Bransje",
  loadingBransje: "Laster bransje",
  bransjeError: "Klarte ikke hente bransje",
  lesMerOmBransjer: "Les mer om bransjer",
  activeSykmelding: "Sykmeldt nå",
  sykmeldingsstatus: "Sykmeldingsstatus",
  naermesteLeder: "Nærmeste leder",
  arbeidsgiverForskutterer: "Forskuttering",
};

function arbeidsgiverForskuttererToText(
  arbeidsgiverForskutterer?: boolean,
): string {
  if (arbeidsgiverForskutterer === undefined) {
    return "Forskuttering ikke oppgitt";
  }
  return arbeidsgiverForskutterer
    ? "Arbeidsgiver forskutterer"
    : "Arbeidsgiver forskutterer ikke";
}

interface Props {
  ledere?: NarmesteLederRelasjonDTO[];
  arbeidsgiverForskutterer?: boolean;
  virksomhetsnavn: string;
  virksomhetsnummer: string;
  sykmeldinger: SykmeldingOldFormat[];
}

/** Fetches and displays organisation details, employer status and leaders. */
export function PersonKortVirksomhet({
  virksomhetsnavn,
  virksomhetsnummer,
  arbeidsgiverForskutterer,
  sykmeldinger,
  ledere = [],
}: Props) {
  const virksomhetHeadingId = useId();
  const ledereHeadingId = useId();
  const virksomheter = useVirksomheterQueries([virksomhetsnummer]);
  const virksomhet = virksomheter.data[0];
  const naringskoder = virksomhet ? toNaringskodeRequest(virksomhet) : [];
  const naringskodeHierarkier = useNaringskodeQueries(naringskoder);
  const bransjer = naringskodeHierarkier.data.flatMap((hierarki) =>
    hierarki.hierarki.filter((kode) => kode.parentCode === null),
  );
  const firstBransje = bransjer[0];
  const isLoading = virksomheter.isPending || naringskodeHierarkier.isPending;
  const hasError = virksomheter.isError || naringskodeHierarkier.isError;

  return (
    <Box
      as="section"
      aria-labelledby={virksomhetHeadingId}
      background="neutral-soft"
      borderRadius="8"
      padding="space-16"
      className="mb-6"
    >
      <HGrid columns="auto minmax(0, 1fr)" gap="space-8" align="start">
        <Buildings2Icon aria-hidden fontSize="1.5rem" />
        <VStack gap="space-16" className="min-w-0">
          <PersonKortVirksomhetHeader
            headingId={virksomhetHeadingId}
            virksomhetsnummer={virksomhetsnummer}
            virksomhetsnavn={
              (virksomhet && getVirksomhetsnavn(virksomhet)) ||
              virksomhetsnavn ||
              virksomhetsnummer
            }
          />

          {(bransjer.length > 0 || isLoading || hasError) && (
            <VStack gap="space-4">
              <Heading level="4" size="xsmall">
                {texts.bransje}
              </Heading>
              {bransjer.length === 1 && firstBransje ? (
                <BodyShort size="small">
                  {firstBransje.shortName ?? firstBransje.name}
                </BodyShort>
              ) : bransjer.length > 1 ? (
                <List size="small" className="m-0">
                  {bransjer.map((bransje, index) => (
                    <List.Item key={`${bransje.code}-${index}`}>
                      {bransje.shortName ?? bransje.name}
                    </List.Item>
                  ))}
                </List>
              ) : null}
              {isLoading && (
                <BodyShort size="small">{texts.loadingBransje}</BodyShort>
              )}
              {hasError && (
                <BodyShort size="small">{texts.bransjeError}</BodyShort>
              )}
              {bransjer.length > 0 && (
                <Link
                  href="https://dataportal.ssb.no/classifications/6/codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={"max-w-fit"}
                >
                  {texts.lesMerOmBransjer}
                </Link>
              )}
            </VStack>
          )}

          <VStack gap="space-4">
            <Heading level="4" size="xsmall">
              {texts.arbeidsgiverForskutterer}
            </Heading>
            <BodyShort size="small">
              {arbeidsgiverForskuttererToText(arbeidsgiverForskutterer)}
            </BodyShort>
          </VStack>

          {lederHasActiveSykmelding(virksomhetsnummer, sykmeldinger) && (
            <VStack gap="space-4" align="start">
              <Heading level="4" size="xsmall">
                {texts.sykmeldingsstatus}
              </Heading>
              <Tag
                size="small"
                data-color="info"
                variant="outline"
                className="max-w-fit"
              >
                {texts.activeSykmelding}
              </Tag>
            </VStack>
          )}

          {ledere.length > 0 && (
            <VStack gap="space-4">
              <Heading level="4" size="xsmall" id={ledereHeadingId}>
                {texts.naermesteLeder}
              </Heading>
              <section
                aria-labelledby={ledereHeadingId}
                className="overflow-x-auto"
              >
                <PersonKortVirksomhetLedere ledere={ledere} />
              </section>
            </VStack>
          )}
        </VStack>
      </HGrid>
    </Box>
  );
}
