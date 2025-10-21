import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import * as Tredelt from "@/components/side/TredeltSide";
import SideLaster from "@/components/side/SideLaster";
import { isKandidat } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import {
  useKartleggingssporsmalKandidatQuery,
  useKartleggingssporsmalSvarQuery,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import {
  tilDatoMedManedNavnOgKlokkeslett,
  tilLesbarDatoMedArstall,
} from "@/utils/datoUtils";
import { EksternLenke } from "@/components/EksternLenke";
import { Skjemasvar } from "@/components/skjemasvar/Skjemasvar";

const texts = {
  title: "Kartleggingsspørsmål",
  vurdereOppgaveText: "Behovet er vurdert, fjern oppgaven",
  kandidat: "Spørsmålene ble sendt",
  ikkeSvart: "Den sykmeldte har ikke svart",
  svarMottatt: "Svar mottatt",
  extraInfo:
    "Ved manglende svar vil vi automatisk sende et nytt varsel på SMS etter syv dager, du trenger ikke å purre manuelt. Den sykmeldte er ikke pålagt å svare. Det skal derfor ikke sendes forhåndsvarsel for brudd på medvirkningsplikten kap § 8.8 dersom det ikke kommer inn et svar.",
  ikkeKandidatInfo1:
    "Den sykmeldte har ikke mottatt kartleggingsspørsmål da personen ikke er kandidat for å motta disse.",
  ikkeKandidatInfo2:
    "Når spørsmålene er besvart, vil du få en oppgave i oversikten din om å vurdere svarene. Svarene fra den sykmeldte dukker opp på denne siden.",
  link: "Slik ser spørsmålene ut for den sykmeldte",
  demoUrl: "https://demo.ekstern.dev.nav.no/syk/kartleggingssporsmal",
  rutineSteps: {
    description:
      "Svarene fra den sykmeldte skal være til hjelp for å identifisere hvem som har økt risiko for langvarig fravær og som kan ha behov for oppfølging. Bruk svarene i dialog med den sykmeldte for å kartlegge behov. Svarene må sees i sammenheng med andre opplysninger Nav har om situasjonen til den sykmeldte.",
    heading1: "Ikke behov for kartlegging",
    info1:
      "Personer som svarer at de blir sykmeldte mindre enn seks måneder, har god relasjon til arbeidsgiver og som skal tilbake i jobben som man er sykmeldt fra, har som hovedregel ikke behov for nærmere samtale med Nav.",
    heading2: "Behov for kartlegging",
    info2:
      "Det er en sterk predikator for at den sykmeldte blir langvarig sykmeldt dersom personen svarer at hen kommer til å være sykmeldt mer enn seks måneder. Dersom vedkommende også har svart usikkerhet knyttet til jobbsituasjonen eller dårlig relasjon med arbeidsgiver gir dette grunn til å undersøke saken nærmere.",
    link: "Bruk Bli kjent og forstå behov",
    url: "",
  },
};

export default function KartleggingssporsmalSide(): ReactElement {
  const getKandidat = useKartleggingssporsmalKandidatQuery();
  const kandidat = getKandidat.data;
  const getKartleggingssporsmalSvar = useKartleggingssporsmalSvarQuery(
    isKandidat(kandidat)
  );
  const answeredQuestions = getKartleggingssporsmalSvar.data?.formResponse;

  const isLoading =
    getKandidat.isLoading || getKartleggingssporsmalSvar.isLoading;
  const isError = getKandidat.isError || getKartleggingssporsmalSvar.isError;

  return (
    <Side
      tittel={texts.title}
      aktivtMenypunkt={Menypunkter.KARTLEGGINGSSPORSMAL}
    >
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        {kandidat && isKandidat(kandidat) ? (
          <Tredelt.Container>
            <Tredelt.FirstColumn className="-xl:mb-2">
              <Box
                background="surface-default"
                className="p-6 gap-6 [&>*]:mb-4"
              >
                {answeredQuestions ? (
                  <>
                    <div>
                      {`${
                        texts.svarMottatt
                      }: ${tilDatoMedManedNavnOgKlokkeslett(
                        answeredQuestions.createdAt
                      )}`}
                    </div>
                    <Skjemasvar formSnapshot={answeredQuestions.formSnapshot} />
                    <Button variant="primary" size="small" className="mt-4">
                      {texts.vurdereOppgaveText}
                    </Button>
                  </>
                ) : (
                  <>
                    <BodyShort size="small" weight="semibold">
                      {texts.ikkeSvart}
                    </BodyShort>
                    <BodyShort size="small" weight="semibold">
                      {`${texts.kandidat} ${tilLesbarDatoMedArstall(
                        kandidat.varsletAt
                      )}`}
                    </BodyShort>
                    <EksternLenke href={texts.demoUrl}>
                      {texts.link}
                    </EksternLenke>
                    <BodyShort size="small">{texts.extraInfo}</BodyShort>
                  </>
                )}
              </Box>
            </Tredelt.FirstColumn>
            <Tredelt.SecondColumn>
              <Box background="surface-default" padding="6">
                <BodyShort size="small" className="mb-4">
                  {texts.rutineSteps.description}
                </BodyShort>
                <Heading level="3" size="small">
                  {texts.rutineSteps.heading1}
                </Heading>
                <BodyShort size="small" className="mb-4">
                  {texts.rutineSteps.info1}
                </BodyShort>
                <Heading level="3" size="small">
                  {texts.rutineSteps.heading2}
                </Heading>
                <BodyShort size="small" className="mb-4">
                  {texts.rutineSteps.info2}
                </BodyShort>
                <EksternLenke href={texts.rutineSteps.url}>
                  {texts.rutineSteps.link}
                </EksternLenke>
              </Box>
            </Tredelt.SecondColumn>
          </Tredelt.Container>
        ) : (
          <Box
            background="surface-default"
            padding="6"
            className="flex flex-col gap-4"
          >
            <BodyShort size="small">{texts.ikkeKandidatInfo1}</BodyShort>
            <BodyShort size="small">{texts.ikkeKandidatInfo2}</BodyShort>
          </Box>
        )}
      </SideLaster>
    </Side>
  );
}
