import React from "react";
import {
  BodyShort,
  Box,
  Heading,
  List,
  ReadMore,
  Link,
} from "@navikt/ds-react";

import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks.ts";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { Link as RouterLink } from "react-router-dom";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import dayjs from "dayjs";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

const texts = {
  heading: "Oppsummering av den sykmeldtes situasjon",
  list: {
    hasGjentakendeSykefravar: "Den sykmeldte har gjentakende fravær",
    noGjentakendeSykefravar: "Den sykmeldte har ikke gjentakende fravær",
    hasBedtOmBistand:
      "Behandler har de siste seks månedene bedt om bistand fra Nav",
    notBedtOmBistand:
      "Behandler har ikke bedt om bistand fra Nav de siste seks månedene",
  },
  bistand: {
    readMore: "Relaterte sykmeldinger",
  },
  gjentakende: {
    definisjon: "Definisjonen på gjentakende sykefravær i Modia er enten:",
    hyppigeFravar:
      "5 tilfeller eller mer med totalt 100 dager fravær eller mer i løpet av en 3 årsperiode, eller",
    langeFravar:
      "2 tilfeller eller mer med totalt 300 dager fravær eller mer i løpet av en 3 årsperiode",
    korteFravar: "Kortere fravær på mindre enn 16 dager telles ikke med.",
  },
};

export function KartleggingInfo() {
  const { hasGjentakendeSykefravar } = useOppfolgingstilfellePersonQuery();
  const { data: oppgaver } = usePersonoppgaverQuery();
  const { sykmeldinger } = useGetSykmeldingerQuery();

  const relevanteSykmeldinger = handleOppgaver(oppgaver, sykmeldinger);

  return (
    <Box
      background="accent-soft"
      borderColor="brand-blue"
      borderWidth="1"
      className="flex flex-col rounded p-4 mt-2 gap-4"
    >
      <Heading size="small">{texts.heading}</Heading>
      <List as="ul" size="small">
        <List.Item>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span>
                {hasGjentakendeSykefravar
                  ? texts.list.hasGjentakendeSykefravar
                  : boldRegex(texts.list.noGjentakendeSykefravar, "ikke")}
              </span>
              <ArrowsCirclepathIcon className="ml-2" />
            </div>
            <ReadMore header="Hva er gjentakende sykefravær?" size="small">
              <BodyShort size="small">{texts.gjentakende.definisjon}</BodyShort>
              <List size="small" className="mb-2">
                <List.Item>{texts.gjentakende.hyppigeFravar}</List.Item>
                <List.Item>{texts.gjentakende.langeFravar}</List.Item>
              </List>
              <BodyShort size="small">
                {texts.gjentakende.korteFravar}
              </BodyShort>
            </ReadMore>
          </div>
        </List.Item>
        <List.Item>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span>
                {relevanteSykmeldinger.length > 0
                  ? texts.list.hasBedtOmBistand
                  : boldRegex(texts.list.notBedtOmBistand, "ikke")}
              </span>
            </div>
            {relevanteSykmeldinger.length > 0 && (
              <ReadMore header={texts.bistand.readMore} size="small">
                <List>
                  {relevanteSykmeldinger.map((sykmelding, index) => (
                    <List.Item key={`relatert-sykmelding-${index}`}>
                      <Link
                        as={RouterLink}
                        to={`/sykefravaer/sykmeldinger/${sykmelding.id}`}
                      >{`Utstedt ${dayjs(sykmelding.bekreftelse.utstedelsesdato).format("DD.MM.YYYY")}, av ${sykmelding.bekreftelse.sykmelder}`}</Link>
                    </List.Item>
                  ))}
                </List>
              </ReadMore>
            )}
          </div>
        </List.Item>
      </List>
    </Box>
  );
}

function boldRegex(text: string, searchTerm: string) {
  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <strong key={i}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function handleOppgaver(
  oppgaver: PersonOppgave[],
  sykmeldinger: SykmeldingOldFormat[],
) {
  const nyeOppgaver = oppgaver.filter(
    (oppgave) =>
      oppgave.type === PersonOppgaveType.BEHANDLER_BER_OM_BISTAND &&
      dayjs(oppgave.opprettet).add(6, "months").isAfter(dayjs()),
  );

  return sykmeldinger.filter((sykmelding) =>
    nyeOppgaver.some((oppgave) => oppgave.referanseUuid === sykmelding.id),
  );
}
