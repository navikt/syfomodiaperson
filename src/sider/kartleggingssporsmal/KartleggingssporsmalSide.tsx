import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Alert, BodyShort, Box, Button, Heading, List } from "@navikt/ds-react";
import * as Tredelt from "@/components/side/TredeltSide";
import SideLaster from "@/components/side/SideLaster";
import {
  isKandidat,
  KandidatStatus,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import {
  useKartleggingssporsmalKandidatQuery,
  useKartleggingssporsmalSvarQuery,
  useKartleggingssporsmalVurderSvar,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { EksternLenke } from "@/components/EksternLenke";
import { Skjemasvar } from "@/components/skjemasvar/Skjemasvar";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { PaddingSize } from "@/components/Layout";

const texts = {
  title: "Kartleggingsspørsmål",
  vurdereOppgaveText: "Svarene er vurdert, fjern oppgaven",
  kandidat: "Spørsmålene ble sendt",
  svart: "Den sykmeldte svarte",
  ikkeSvart: "Den sykmeldte har ikke svart",
  svarVurdert: "Svarene er vurdert",
  svarVurdertAv: "Oppgaven er behandlet av",
  extraInfo:
    "Ved manglende svar vil vi automatisk sende et nytt varsel på SMS etter syv dager, du trenger ikke å purre manuelt. Den sykmeldte er ikke pålagt å svare. Det skal derfor ikke sendes forhåndsvarsel for brudd på folketrygdloven § 8-8 dersom det ikke kommer inn et svar.",
  ikkeKandidatInfo1: "Den sykmeldte har ikke mottatt kartleggingsspørsmål.",
  ikkeKandidatInfo2:
    "Alle sykmeldte i Norge ved uke seks mottar spørsmålene, bortsett fra de som:",
  ikkeKandidatKriterier: [
    "Er 67 år eller eldre",
    "Ikke har en arbeidsgiver",
    "Har et gjeldende § 14a-vedtak for inneværende oppfølgingsperiode",
  ],
  behovsrettetLink: "Les mer om behovsrettet sykefraværsoppfølging på Navet",
  behovsrettetUrl:
    "https://navno.sharepoint.com/:u:/r/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Behovsrettet-oppf%C3%B8lging.aspx?csf=1&web=1&e=e73C3c",
  link: "Slik ser spørsmålene ut for den sykmeldte",
  demoUrl: "https://demo.ekstern.dev.nav.no/syk/kartleggingssporsmal",
  rutineSteps: {
    heading1: "Slik vurderer du svarene",
    info1:
      "Svarene fra den sykmeldte skal være til hjelp for å identifisere hvem som har økt risiko for langvarig fravær og som kan ha behov for oppfølging. Bruk svarene i dialog med den sykmeldte for å kartlegge behov. Svarene må sees i sammenheng med andre opplysninger Nav har om situasjonen til den sykmeldte. I det den sykmeldte sender inn svarene vil de automatisk bli journalført.",
    heading2: "Ikke behov for kartlegging",
    info2:
      "Personer som svarer at de blir sykmeldte mindre enn seks måneder, har god relasjon til arbeidsgiver og som skal tilbake i jobben som man er sykmeldt fra, har som hovedregel ikke behov for nærmere samtale med Nav.",
    heading3: "Behov for kartlegging",
    info3:
      "Det er en sterk predikator for at den sykmeldte blir langvarig sykmeldt dersom personen svarer at hen kommer til å være sykmeldt mer enn seks måneder. Dersom vedkommende også har svart usikkerhet knyttet til jobbsituasjonen eller dårlig relasjon med arbeidsgiver gir dette grunn til å undersøke saken nærmere.",
    link: 'Bruk også "Bli kjent og forstå behov"',
    url: "https://navno.sharepoint.com/:u:/r/sites/fag-og-ytelser-veileder-for-arbeidsrettet-brukeroppfolging/SitePages/Start.aspx?csf=1&web=1&e=qc76DU#bli-kjent-og-forst%C3%A5-behov",
  },
};

function PilotInfo() {
  return (
    <Box
      background="surface-selected"
      borderColor="border-alt-3"
      borderWidth="1"
      className="flex flex-col rounded p-4 mt-2 gap-4"
    >
      <Heading size="small">
        Send inn feil, mangler eller annet du lurer på
      </Heading>
      <div>
        <BodyShort size="small">
          Generelle tilbakemeldinger sendes på Teams.
        </BodyShort>
        <EksternLenke
          href={
            "https://teams.microsoft.com/l/channel/19%3A53f937eda2124d29938e4278a1cb106c%40thread.tacv2/Pilot%20kartleggingssp%C3%B8rsm%C3%A5l?groupId=05b6c0d2-b6db-4440-96b4-4de66c09b3c6&tenantId=62366534-1ec3-4962-8869-9b5535279d0b&ngc=true"
          }
        >
          Gå til Pilot kartlegginsspørsmål-kanalen
        </EksternLenke>
      </div>
      <div>
        <BodyShort size="small">
          Tilbakemeldinger om en spesifikk sykmeldt kan du melde i Porten med
          tittel [Pilot Modia syfo].
        </BodyShort>
        <EksternLenke
          href={
            "https://jira.adeo.no/plugins/servlet/desk/portal/541/create/1401"
          }
        >
          Meld sak i Porten
        </EksternLenke>
      </div>
    </Box>
  );
}

export default function KartleggingssporsmalSide(): ReactElement {
  const getKandidat = useKartleggingssporsmalKandidatQuery();
  const kandidat = getKandidat.data;
  const getKartleggingssporsmalSvar =
    useKartleggingssporsmalSvarQuery(kandidat);
  const answeredQuestions = getKartleggingssporsmalSvar.data;
  const vurderSvar = useKartleggingssporsmalVurderSvar();

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
                    <BodyShort size="small" weight="semibold">
                      {`${texts.svart} ${tilLesbarDatoMedArstall(
                        answeredQuestions.createdAt
                      )}`}
                    </BodyShort>
                    <BodyShort size="small" weight="semibold">
                      {`${texts.kandidat} ${tilLesbarDatoMedArstall(
                        kandidat.varsletAt
                      )}`}
                    </BodyShort>
                    <EksternLenke href={texts.demoUrl}>
                      {texts.link}
                    </EksternLenke>
                    <Skjemasvar formSnapshot={answeredQuestions.formSnapshot} />
                    {kandidat.status === KandidatStatus.SVAR_MOTTATT && (
                      <>
                        <Button
                          variant="primary"
                          size="medium"
                          onClick={() =>
                            vurderSvar.mutate(kandidat.kandidatUuid)
                          }
                          loading={vurderSvar.isPending}
                        >
                          {texts.vurdereOppgaveText}
                        </Button>
                        {vurderSvar.isError && (
                          <SkjemaInnsendingFeil
                            bottomPadding={PaddingSize.NONE}
                            error={vurderSvar.error}
                          />
                        )}
                      </>
                    )}
                    {kandidat.status === KandidatStatus.FERDIGBEHANDLET && (
                      <Alert size="medium" variant="success">
                        <BodyShort
                          size="small"
                          weight="semibold"
                          className="mb-2"
                        >
                          {`${texts.svarVurdert} ${tilLesbarDatoMedArstall(
                            kandidat.vurdering?.vurdertAt
                          )}`}
                        </BodyShort>
                        <BodyShort size="small">
                          {`${texts.svarVurdertAv} ${kandidat.vurdering?.vurdertBy}`}
                        </BodyShort>
                      </Alert>
                    )}
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
              <Box background="surface-default" padding="6" className="mb-4">
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
                <Heading level="3" size="small">
                  {texts.rutineSteps.heading3}
                </Heading>
                <BodyShort size="small" className="mb-4">
                  {texts.rutineSteps.info3}
                </BodyShort>
                <EksternLenke href={texts.rutineSteps.url} className="mb-2">
                  {texts.rutineSteps.link}
                </EksternLenke>
                <PilotInfo />
              </Box>
              {answeredQuestions && <UtdragFraSykefravaeret />}
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
            <List size="small">
              {texts.ikkeKandidatKriterier.map((text, index) => (
                <List.Item key={index}>{text}</List.Item>
              ))}
            </List>
            <EksternLenke href={texts.behovsrettetUrl}>
              {texts.behovsrettetLink}
            </EksternLenke>
          </Box>
        )}
      </SideLaster>
    </Side>
  );
}
