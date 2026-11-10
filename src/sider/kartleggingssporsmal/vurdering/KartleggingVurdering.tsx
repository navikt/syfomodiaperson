import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  LocalAlert,
  Textarea,
} from "@navikt/ds-react";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { VurderingAlternativ } from "@/sider/kartleggingssporsmal/types.ts";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil.tsx";
import { useState } from "react";
import { FerdigbehandletInfoCard } from "@/sider/kartleggingssporsmal/ferdigbehandletInfoCard/FerdigbehandletInfoCard.tsx";
import { finnNaisUrlIntern } from "@/utils/miljoUtil.ts";
import { EksternLenke } from "@/components/EksternLenke.tsx";
import { Events, trackEvent } from "@/utils/umami.ts";
import { KartleggingInfo } from "@/sider/kartleggingssporsmal/info/KartleggingInfo.tsx";
import { useKartleggingssporsmalVurderSvar } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks.ts";
import { useDebouncedCallback } from "use-debounce";
import {
  DraftTextDTO,
  useDeleteDraft,
  useSaveDraft,
} from "@/hooks/useDraftQuery";
import { DraftSaveStatus } from "@/components/DraftSaveStatus";
import { RadioCard, RadioCardGroup } from "@navikt/ds-react/PREVIEW";

const DRAFT_CATEGORY = "kartleggingssporsmal-vurdering";

const VURDERING_MAX_LENGTH = 200;
const LINK_14A = `https://veilarbpersonflate${finnNaisUrlIntern()}/vedtaksstotte`;

const texts = {
  heading: "Vurdering",
  radioLegend: "Velg alternativet som passer",
  rutine: {
    intro:
      "Her skal du vurdere om den sykmeldte har risiko for langtidsfravær og behov for tidlig oppfølging. Ta utgangspunkt i veiledningen på høyre side når du vurderer saken.",
    vurderRisiko: {
      heading: "Vurder om svarene indikerer risiko for langtidsfravær",
      info: "Når svarene fra den sykmeldte ikke indikerer risiko for langvarig sykefravær, skal saken som hovedregel ikke følges opp videre på dette tidspunktet.",
    },
    vurderKontakt: {
      heading:
        "Vurder om det er behov for kontakt med Nav der det indikeres risiko",
      info: "Se på svarene og annen tilgjengelig informasjon i saken. Vurder ut fra de samlede opplysningene om det er behov for å forstå situasjonen bedre, eller om det ikke er behov for oppfølging fra Nav på nåværende tidspunkt.",
    },
    behovForOppfolging: {
      heading: "Dersom det er behov for oppfølging fra Nav",
      info: "Vurder hvordan du skal følge opp saken. Dette kan innebære kontakt med den sykmeldte per telefon eller digital dialog, individuell samtale, eller dialogmøte med arbeidsgiver. Planlegg videre oppfølging før du avslutter oppgaven.",
    },
    info: "Vurderingen av svarene skal gjøres basert på ",
    linkText:
      "rutine for bruk av kartleggingsspørsmålene i sykefraværsoppfølgingen.",
  },
  textLegend: "Begrunnelse (valgfritt)",
  textDescription:
    "Brukes kun for å dokumentere vurderingen internt og blir ikke synlig for den sykmeldte. Den sykmeldte kan alltid be om innsyn i egen sak.",
  radioOptions: {
    RISIKO_FOR_LANGTIDSFRAVAR:
      "Jeg vurderer at den sykmeldte har risiko for langtidsfravær og behov for tidlig oppfølging",
    IKKE_RISIKO_FOR_LANGTIDSFRAVAR:
      "Jeg vurderer at den sykmeldte ikke har behov for tidlig oppfølging",
    risikoDescription: "Velg denne der du har satt i gang videre oppfølging.",
    ikkeRisikoDescription:
      "Velg denne der det ikke er risiko, eller der det er risiko, men ikke behov for oppfølging fra Nav på nåværende tidspunkt.",
  },
  button: "Lagre vurdering, fjern oppgaven",
  vurderingLagret: "Vurderingen er lagret",
  vurderingIkkeValgtError: "Du må velge et alternativ",
  begrunnelseForLangError: `Begrunnelse kan ikke være lengre enn ${VURDERING_MAX_LENGTH} tegn`,
  vurdertRisikoForLangtidsfravar:
    "Det er vurdert risiko for langtidsfravær. Da kan det være aktuelt å gjøre en § 14a-vurdering i ",
  lenkeTilModiaAO: "vedtaksstøtteløsningen i Modia Arbeidsrettet oppfølging.",
};

function logLinkEvent(tekst: string, href: string) {
  trackEvent({
    name: Events.LINK_KLIKKET,
    properties: {
      tekst,
      href,
    },
  });
}

interface Props {
  nyesteKandidat: KartleggingssporsmalKandidatResponseDTO;
  begrunnelseUtkast?: string;
}

export function KartleggingVurdering({
  nyesteKandidat,
  begrunnelseUtkast,
}: Props) {
  const vurderSvar = useKartleggingssporsmalVurderSvar();
  const [isSuccessAlertDismissed, setIsSuccessAlertDismissed] = useState(false);
  const [utkastSavedTime, setUtkastSavedTime] = useState<Date>();
  const saveDraft = useSaveDraft<DraftTextDTO>(DRAFT_CATEGORY);
  const deleteDraft = useDeleteDraft(DRAFT_CATEGORY);

  const debouncedAutoSaveDraft = useDebouncedCallback((tekst: string) => {
    if (!tekst) {
      return;
    }
    saveDraft.mutate(
      { begrunnelse: tekst },
      {
        onSuccess: () => setUtkastSavedTime(new Date()),
        onError: () => setUtkastSavedTime(undefined),
      },
    );
  }, 750);

  const [vurdering, setVurdering] = useState<{
    vurderingAlternativ: VurderingAlternativ | null;
    vurderingFritekst: string | null;
  }>({
    vurderingAlternativ: nyesteKandidat.vurdering?.vurderingAlternativ ?? null,
    vurderingFritekst:
      nyesteKandidat.vurdering?.vurderingFritekst ?? begrunnelseUtkast ?? null,
  });

  const [vurderingError, setVurderingError] = useState<{
    vurderingAlternativError: string | null;
    vurderingFritekstError: string | null;
  }>({
    vurderingAlternativError: null,
    vurderingFritekstError: null,
  });

  const isFerdigbehandlet =
    nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET;
  const isVurdertRisikoForLangtidsfravar =
    nyesteKandidat.vurdering?.vurderingAlternativ ===
    "RISIKO_FOR_LANGTIDSFRAVAR";

  return (
    <Box background="default" className="flex flex-col p-6 gap-4 mb-2">
      <Heading size={"medium"}>{texts.heading}</Heading>
      <BodyShort size="small">{texts.rutine.intro}</BodyShort>
      <KartleggingInfo />

      <RadioCardGroup
        legend={texts.radioLegend}
        className="mt-4"
        size="small"
        value={vurdering.vurderingAlternativ}
        readOnly={nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET}
        error={vurderingError.vurderingAlternativError}
        onChange={(e: VurderingAlternativ) =>
          setVurdering((vurderingParam) => ({
            ...vurderingParam,
            vurderingAlternativ: e,
          }))
        }
      >
        <RadioCard
          value="RISIKO_FOR_LANGTIDSFRAVAR"
          description={texts.radioOptions.risikoDescription}
        >
          {texts.radioOptions.RISIKO_FOR_LANGTIDSFRAVAR}
        </RadioCard>
        <RadioCard
          value="IKKE_RISIKO_FOR_LANGTIDSFRAVAR"
          description={texts.radioOptions.ikkeRisikoDescription}
        >
          {texts.radioOptions.IKKE_RISIKO_FOR_LANGTIDSFRAVAR}
        </RadioCard>
      </RadioCardGroup>
      <Textarea
        label={texts.textLegend}
        className="mt-4"
        size="small"
        description={texts.textDescription}
        value={vurdering.vurderingFritekst ?? ""}
        maxLength={VURDERING_MAX_LENGTH}
        readOnly={isFerdigbehandlet}
        error={vurderingError.vurderingFritekstError}
        onChange={(e) => {
          setVurdering((vurderingParam) => ({
            ...vurderingParam,
            vurderingFritekst: e.target.value,
          }));
          debouncedAutoSaveDraft(e.target.value);
        }}
      />
      {!isFerdigbehandlet && (
        <DraftSaveStatus
          isSaveError={saveDraft.isError}
          savedTime={utkastSavedTime}
        />
      )}

      {nyesteKandidat.status === KandidatStatus.SVAR_MOTTATT && (
        <Button
          variant="primary"
          className="w-fit"
          onClick={() => {
            setVurderingError({
              vurderingAlternativError: null,
              vurderingFritekstError: null,
            });

            if (!vurdering.vurderingAlternativ) {
              setVurderingError((vurderingErrorParam) => ({
                ...vurderingErrorParam,
                vurderingAlternativError: texts.vurderingIkkeValgtError,
              }));
              return;
            }
            if (
              vurdering.vurderingFritekst &&
              vurdering.vurderingFritekst.length > VURDERING_MAX_LENGTH
            ) {
              setVurderingError((vurderingErrorParam) => ({
                ...vurderingErrorParam,
                vurderingFritekstError: texts.begrunnelseForLangError,
              }));
              return;
            }

            vurderSvar.mutate(
              {
                kandidatUuid: nyesteKandidat.kandidatUuid,
                vurderingAlternativ: vurdering.vurderingAlternativ,
                vurderingFritekst: vurdering.vurderingFritekst ?? undefined,
              },
              {
                onSuccess: () => {
                  setUtkastSavedTime(undefined);
                  debouncedAutoSaveDraft.cancel();
                  deleteDraft.mutate(undefined);
                },
              },
            );
          }}
          loading={vurderSvar.isPending}
        >
          {texts.button}
        </Button>
      )}

      {vurderSvar.isError && <SkjemaInnsendingFeil error={vurderSvar.error} />}

      {vurderSvar.isSuccess && !isSuccessAlertDismissed && (
        <LocalAlert status="success" size="small">
          <LocalAlert.Header>
            <LocalAlert.Title>{texts.vurderingLagret}</LocalAlert.Title>
            <LocalAlert.CloseButton
              onClick={() => setIsSuccessAlertDismissed(true)}
            />
          </LocalAlert.Header>
        </LocalAlert>
      )}

      {isFerdigbehandlet && (
        <FerdigbehandletInfoCard nyesteKandidat={nyesteKandidat} />
      )}
      {isFerdigbehandlet && isVurdertRisikoForLangtidsfravar && (
        <BodyLong size="small">
          {texts.vurdertRisikoForLangtidsfravar}
          <EksternLenke
            href={LINK_14A}
            onClick={() => logLinkEvent(texts.lenkeTilModiaAO, LINK_14A)}
          >
            {texts.lenkeTilModiaAO}
          </EksternLenke>
        </BodyLong>
      )}
    </Box>
  );
}
