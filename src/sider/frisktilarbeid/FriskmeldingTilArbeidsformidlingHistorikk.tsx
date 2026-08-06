import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import { isActiveExistingVedtak } from "@/data/frisktilarbeid/frisktilarbeidTypes.ts";
import React from "react";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery.ts";
import { VisBrev } from "@/components/VisBrev.tsx";
import { tilDatoMedManedNavn } from "@/utils/datoUtils.ts";

const texts = {
  header: "Historikk",
  subHeader:
    "Alle vedtak på § 8-5 Friskmelding til Arbeidsformidling fattet i Modia.",
  ingenVedtak:
    "Det er ikke fattet noen vedtak på § 8-5 Friskmelding til Arbeidsformidling i Modia.",
  aktivtVedtak: "Aktivt vedtak",
  tidligereVedtak: "Tidligere vedtak",
  periode: "Periode",
  begrunnelse: "Begrunnelse",
  vurdertAv: "Vurdert av",
};

export function FriskmeldingTilArbeidsformidlingHistorikk() {
  const { data: alleVedtak } = useVedtakQuery();

  return (
    <Box
      background="default"
      padding="space-32"
      className="flex flex-col my-4 gap-8"
    >
      <div>
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        <BodyShort size="small">
          {alleVedtak.length > 0 ? texts.subHeader : texts.ingenVedtak}
        </BodyShort>
      </div>
      <Accordion>
        {alleVedtak.map((vedtak) => (
          <Accordion.Item>
            <Accordion.Header>
              {isActiveExistingVedtak(vedtak)
                ? texts.aktivtVedtak
                : texts.tidligereVedtak}{" "}
              - {tilDatoMedManedNavn(vedtak.createdAt)}
            </Accordion.Header>
            <Accordion.Content>
              <BodyShort size="small" weight="semibold">
                {texts.periode}
              </BodyShort>
              <BodyShort size="small" className="mb-4">
                {tilDatoMedManedNavn(vedtak.fom)} -{" "}
                {tilDatoMedManedNavn(vedtak.tom)}
              </BodyShort>
              <BodyShort size="small" weight="semibold">
                {texts.begrunnelse}
              </BodyShort>
              <BodyShort size="small" className="mb-4">
                {vedtak.begrunnelse}
              </BodyShort>
              <BodyShort size="small" weight="semibold">
                {texts.vurdertAv}
              </BodyShort>
              <BodyShort size="small" className="mb-4">
                {vedtak.veilederident}
              </BodyShort>
              <VisBrev
                document={vedtak.document}
                buttonText="Se sendt vedtak"
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  );
}
