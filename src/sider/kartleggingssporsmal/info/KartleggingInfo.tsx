import React from "react";
import { Box, Heading, List } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks.ts";
import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { hasRiskoForLangtidsfravar } from "@/sider/kartleggingssporsmal/info/vurdereBehov.ts";

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
};

interface KartleggingInfoProps {
  answeredQuestions: KartleggingssporsmalSvarResponseDTO;
}

export const KartleggingInfo = ({
  answeredQuestions,
}: KartleggingInfoProps) => {
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
          {hasGjentakendeSykefravar
            ? texts.list.hasGjentakendeSykefravar
            : boldRegex(texts.list.noGjentakendeSykefravar, "ikke")}
        </List.Item>

        <List.Item>
          {hasRiskoForLangtidsfravar(answeredQuestions)
            ? texts.list.hasRiskoForLangtidsfravar
            : boldRegex(texts.list.noRiskoForLangtidsfravar, "ikke")}
        </List.Item>
      </List>
    </Box>
  );
};

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
