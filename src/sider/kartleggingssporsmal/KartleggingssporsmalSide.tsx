import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Alert, BodyShort, Box, Heading, List } from "@navikt/ds-react";
import * as Tredelt from "@/components/side/TredeltSide";
import SideLaster from "@/components/side/SideLaster";
import {
  hasMottattKartleggingssporsmal,
  KandidatStatus,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import {
  useKartleggingssporsmalKandidaterQuery,
  useKartleggingssporsmalSvarQuery,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { EksternLenke } from "@/components/EksternLenke";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { KartleggingssporsmalSkjemasvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalSkjemasvar";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { KartleggingssporsmalHistorikk } from "@/sider/kartleggingssporsmal/historikk/KartleggingssporsmalHistorikk";
import { KartleggingVurdering } from "@/sider/kartleggingssporsmal/vurdering/KartleggingVurdering.tsx";
import { SuccessAlert } from "@/sider/kartleggingssporsmal/successAlert/SuccessAlert.tsx";
import LumiSurvey from "@/components/lumi/LumiSurvey.tsx";
import { kartleggingssporsmalSurvey } from "@/components/lumi/kartleggingssporsmalSurvey.ts";
import { ReactElement } from "react";
import { SyketilfelleList } from "@/components/syketilfelleList/SyketilfelleList.tsx";
import { KartleggingssporsmalRutine } from "@/sider/kartleggingssporsmal/info/KartleggingssporsmalRutine.tsx";

const texts = {
  title: "Kartleggingsspørsmål",
  kandidat: "Spørsmålene ble sendt",
  svart: "Den sykmeldte svarte",
  ikkeSvart: "Den sykmeldte har ikke svart",
  extraInfo:
    "Ved manglende svar vil vi automatisk sende et nytt varsel på SMS etter syv dager, du trenger ikke å purre manuelt. Den sykmeldte er ikke pålagt å svare. Det skal derfor ikke sendes forhåndsvarsel for brudd på folketrygdloven § 8-8 dersom det ikke kommer inn et svar.",
  extraInfoReservert:
    "Den sykmeldte er ikke pålagt å svare. Det skal derfor ikke sendes forhåndsvarsel for brudd på folketrygdloven § 8-8 dersom det ikke kommer inn et svar.",
  reservertWarning: {
    header: "Brukeren er reservert fra digital kommunikasjon",
    info1: "Ring eller benytt brev per post om du vil kontakte den sykmeldte.",
    info2:
      "Selv om den sykmeldte ikke får varsel om kartleggingsspørsmålene på SMS vil de være tilgjengelig på innloggede sider, og derfra er det mulig å svare på spørsmålene.",
  },
  ikkeKandidatInfo1: "Den sykmeldte har ikke mottatt kartleggingsspørsmål.",
  ikkeKandidatInfo2:
    "Alle sykmeldte i Norge mottar spørsmålene ved uke 6, bortsett fra de som",
  ikkeKandidatKriterier: [
    "er 67 år eller eldre",
    "ikke har en arbeidsgiver",
    "har et gjeldende § 14a-vedtak for inneværende oppfølgingsperiode",
    'har mottatt spørsmålene om "Snart slutt på sykepengene" innen siste 6 måneder',
  ],
  behovsrettetLink: "Les mer om behovsrettet sykefraværsoppfølging på Navet",
  behovsrettetUrl:
    "https://navno.sharepoint.com/:u:/r/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Behovsrettet-oppf%C3%B8lging.aspx?csf=1&web=1&e=e73C3c",
};

export default function KartleggingssporsmalSide(): ReactElement {
  const { toggles } = useFeatureToggles();

  const getKandidater = useKartleggingssporsmalKandidaterQuery();
  const kandidater = getKandidater.data || [];
  const nyesteKandidat = kandidater[0];

  const getKartleggingssporsmalSvar =
    useKartleggingssporsmalSvarQuery(nyesteKandidat);
  const answeredQuestions = getKartleggingssporsmalSvar.data;

  const { brukerKanIkkeVarslesDigitalt } = useKontaktinfoQuery();

  const isSurveyVisible =
    toggles.isFlexjarKartleggingssporsmalEnabled &&
    answeredQuestions &&
    nyesteKandidat?.status === KandidatStatus.FERDIGBEHANDLET;

  const lumiSurvey = isSurveyVisible ? (
    <LumiSurvey
      surveyId={"modia-kartleggingssporsmal"}
      survey={kartleggingssporsmalSurvey}
      context={{
        tags: { formIdentifier: answeredQuestions.formSnapshot.formIdentifier },
      }}
      behavior={{
        questionLayout: "steps",
        dismissCooldownDays: 42,
      }}
    />
  ) : null;

  const isPending =
    getKandidater.isPending || getKartleggingssporsmalSvar.isLoading;
  const isError = getKandidater.isError || getKartleggingssporsmalSvar.isError;

  const behandletWithoutVurdering =
    nyesteKandidat?.status === KandidatStatus.FERDIGBEHANDLET &&
    !nyesteKandidat?.vurdering?.vurderingAlternativ;

  return (
    <Side
      tittel={texts.title}
      aktivtMenypunkt={Menypunkter.KARTLEGGINGSSPORSMAL}
      lumi={lumiSurvey}
    >
      <Sidetopp tittel={texts.title} />

      <SideLaster isLoading={isPending} isError={isError}>
        {nyesteKandidat && hasMottattKartleggingssporsmal(nyesteKandidat) ? (
          <Tredelt.Container>
            <Tredelt.FirstColumn className="-xl:mb-2">
              <Box
                background="default"
                className="flex flex-col p-6 gap-4 mb-2"
              >
                {answeredQuestions ? (
                  <>
                    <BodyShort size="small" weight="semibold">
                      {`${texts.svart} ${tilLesbarDatoMedArstall(
                        answeredQuestions.createdAt,
                      )}`}
                    </BodyShort>
                    <BodyShort size="small" weight="semibold">
                      {`${texts.kandidat} ${tilLesbarDatoMedArstall(
                        nyesteKandidat.varsletAt,
                      )}`}
                    </BodyShort>
                    <KartleggingssporsmalSkjemasvar
                      formSnapshot={answeredQuestions.formSnapshot}
                    />

                    {behandletWithoutVurdering && (
                      <SuccessAlert nyesteKandidat={nyesteKandidat} />
                    )}
                  </>
                ) : (
                  <>
                    {brukerKanIkkeVarslesDigitalt && (
                      <Alert variant="warning" size="small">
                        <Heading size="xsmall">
                          {texts.reservertWarning.header}
                        </Heading>
                        <BodyShort size="small" spacing>
                          {texts.reservertWarning.info1}
                        </BodyShort>
                        <BodyShort size="small" spacing>
                          {texts.reservertWarning.info2}
                        </BodyShort>
                      </Alert>
                    )}
                    <BodyShort size="small" weight="semibold">
                      {texts.ikkeSvart}
                    </BodyShort>
                    <BodyShort size="small" weight="semibold">
                      {`${texts.kandidat} ${tilLesbarDatoMedArstall(
                        nyesteKandidat.varsletAt,
                      )}`}
                    </BodyShort>
                    {brukerKanIkkeVarslesDigitalt ? (
                      <BodyShort size="small">
                        {texts.extraInfoReservert}
                      </BodyShort>
                    ) : (
                      <BodyShort size="small">{texts.extraInfo}</BodyShort>
                    )}
                  </>
                )}
              </Box>
              {!behandletWithoutVurdering &&
                answeredQuestions &&
                nyesteKandidat.status !== KandidatStatus.KANDIDAT && (
                  <KartleggingVurdering
                    nyesteKandidat={nyesteKandidat}
                    answeredQuestions={answeredQuestions}
                  />
                )}
              <KartleggingssporsmalHistorikk
                tidligereKandidater={kandidater.slice(1)}
              />
            </Tredelt.FirstColumn>
            <Tredelt.SecondColumn>
              <KartleggingssporsmalRutine />
              <SyketilfelleList />
              {answeredQuestions && <UtdragFraSykefravaeret />}
            </Tredelt.SecondColumn>
          </Tredelt.Container>
        ) : (
          <Box
            background="default"
            padding="space-24"
            className="flex flex-col gap-4"
          >
            <BodyShort size="small" weight="semibold">
              {texts.ikkeKandidatInfo1}
            </BodyShort>
            <div>
              <BodyShort size="small" spacing>
                {texts.ikkeKandidatInfo2}
              </BodyShort>
              <Box asChild>
                <List size="small">
                  {texts.ikkeKandidatKriterier.map((text, index) => (
                    <List.Item key={index}>{text}</List.Item>
                  ))}
                </List>
              </Box>
            </div>
            <EksternLenke href={texts.behovsrettetUrl}>
              {texts.behovsrettetLink}
            </EksternLenke>
          </Box>
        )}
      </SideLaster>
    </Side>
  );
}
