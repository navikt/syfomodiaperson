import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, Label, List } from "@navikt/ds-react";
import { useSenOppfolgingSvarQuery } from "@/data/senoppfolging/useSenOppfolgingSvarQuery";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { VurderSenOppfolging } from "@/sider/senoppfolging/VurderSenOppfolging";

const texts = {
  heading: "Sykmeldtes svar",
  oppfolging: "Vurder videre oppfølging",
  vurderFolgende: "Basert på svarene kan du vurdere følgende",
  rutine: [
    "§14a-vedtak: Hvis den sykmeldte har svart at han eller hun trenger oppfølging, skal det gjøres et §14a-vedtak i Arena",
    "Dialogmøte: Vurder om det burde kalles inn til et dialogmøte",
    "Kontakt bruker: Ta kontakt med den sykmeldte for å avklare behov for videre oppfølging",
    "Kontakt arbeidsgiver: Ta kontakt med arbeidsgiver for å avklare tilretteleggingsmuligheter",
    "Kontakt behandler: Ta kontakt med behandler for å innhente medisinske opplysninger",
    "AAP: Vurder om den sykmeldte bør søke om AAP",
  ],
  ikkeVarslet: {
    info1:
      "Den sykmeldte har ikke mottatt varsel om at det snart er slutt på sykepengene enda.",
    info2:
      "Når den sykmeldte har mindre enn 90 dager igjen av sykepengene, vil han eller hun få et varsel om å svare på spørsmål rundt sin situasjon på innloggede sider.",
    info3:
      "Når spørsmålene er besvart, vil du få en oppgave i oversikten din om å vurdere videre oppfølging. Svarene fra den sykmeldte dukker opp på denne siden.",
  },
};

export default function SenOppfolging(): ReactElement {
  const { data: svar } = useSenOppfolgingSvarQuery();
  const svardato = svar && tilLesbarDatoMedArUtenManedNavn(svar.createdAt);
  const { data: kandidater } = useSenOppfolgingKandidatQuery();
  const kandidat = kandidater[0];

  return svar ? (
    <>
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4 mb-2"
      >
        <Heading size="medium">{texts.heading}</Heading>
        <BodyShort size="small">Den sykmeldte svarte {svardato}.</BodyShort>
        {svar &&
          svar?.questionResponses.map((response, index) => (
            <div key={index}>
              <Label size="small">{response.questionText}</Label>
              <BodyShort size="small">{response.answerText}</BodyShort>
            </div>
          ))}
      </Box>
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4 mb-2"
      >
        <Heading size="medium">{texts.oppfolging}</Heading>
        <List as="ul" title={texts.vurderFolgende} size="small">
          {texts.rutine.map((text, index) => (
            <List.Item key={index}>{text}</List.Item>
          ))}
        </List>
        {kandidat && <VurderSenOppfolging kandidat={kandidat} />}
      </Box>
    </>
  ) : (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4"
    >
      <BodyShort size="small">{texts.ikkeVarslet.info1}</BodyShort>
      <BodyShort size="small">{texts.ikkeVarslet.info2}</BodyShort>
      <BodyShort size="small">{texts.ikkeVarslet.info3}</BodyShort>
    </Box>
  );
}
