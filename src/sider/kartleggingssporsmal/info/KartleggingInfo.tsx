import React from "react";
import { BodyShort, Box, Heading, List, ReadMore } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks.ts";
import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { hasRiskoForLangtidsfravar } from "@/sider/kartleggingssporsmal/info/vurdereBehov.ts";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";

const texts = {
  heading: "Oppsummering av den sykmeldtes situasjon",
  list: {
    hasGjentakendeSykefravar: "Den sykmeldte har gjentagende fravær",
    noGjentakendeSykefravar: "Den sykmeldte har ikke gjentagende fravær",
    hasRiskoForLangtidsfravar:
      "Svarene indikerer behov for vurdering av oppfølging – se veiledning",
    noRiskoForLangtidsfravar:
      "Svarene indikerer ikke behov for videre vurdering av oppfølging – se veiledning",
  },
  gjentakende: {
    definisjon: "Definisjonen på gjentagende sykefravær i Modia er enten:",
    hyppigeFravar:
      "5 tilfeller eller mer med totalt 100 dager fravær eller mer i løpet av en 3 årsperiode, eller",
    langeFravar:
      "2 tilfeller eller mer med totalt 300 dager fravær eller mer i løpet av en 3 årsperiode",
    korteFravar: "Kortere fravær på mindre enn 16 dager telles ikke med.",
  },
};

interface Props {
  answeredQuestions: KartleggingssporsmalSvarResponseDTO;
}

export function KartleggingInfo({ answeredQuestions }: Props) {
  const { hasGjentakendeSykefravar } = useOppfolgingstilfellePersonQuery();

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
              {hasGjentakendeSykefravar
                ? texts.list.hasGjentakendeSykefravar
                : boldRegex(texts.list.noGjentakendeSykefravar, "ikke")}
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
          {hasRiskoForLangtidsfravar(answeredQuestions)
            ? texts.list.hasRiskoForLangtidsfravar
            : boldRegex(texts.list.noRiskoForLangtidsfravar, "ikke")}
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
        )
      )}
    </>
  );
}
