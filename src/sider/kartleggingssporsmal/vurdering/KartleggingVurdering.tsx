import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  Label,
  List,
  Radio,
  RadioGroup,
  Textarea,
} from "@navikt/ds-react";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { VurderingAlternativ } from "@/sider/kartleggingssporsmal/types.ts";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil.tsx";
import { useState } from "react";
import { SuccessAlert } from "@/sider/kartleggingssporsmal/successAlert/SuccessAlert.tsx";
import { finnNaisUrlIntern } from "@/utils/miljoUtil.ts";
import { EksternLenke } from "@/components/EksternLenke.tsx";
import { Events, trackEvent } from "@/utils/umami.ts";
import { KartleggingInfo } from "@/sider/kartleggingssporsmal/info/KartleggingInfo.tsx";
import { useKartleggingssporsmalVurderSvar } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks.ts";
import { hasRisikoForLangtidsfravar } from "@/sider/kartleggingssporsmal/info/vurdereBehov.ts";

const VURDERING_MAX_LENGTH = 200;
const LINK_14A = `https://veilarbpersonflate${finnNaisUrlIntern()}/vedtaksstotte`;

const texts = {
  heading: "Vurdering",
  radioLegend: "Velg alternativet som passer",
  textLegend: "Begrunnelse (valgfritt)",
  RISIKO_FOR_LANGTIDSFRAVAR:
    "Jeg vurderer at den sykmeldte har risiko for langtidsfravær og behov for tidlig oppfølging",
  IKKE_RISIKO_FOR_LANGTIDSFRAVAR:
    "Jeg vurderer at den sykmeldte ikke har behov for tidlig oppfølging",
  button: "Lagre vurdering, fjern oppgaven",
  vurderingIkkeValgtError: "Du må velge et alternativ",
  begrunnelseForLangError: `Begrunnelse kan ikke være lengre enn ${VURDERING_MAX_LENGTH} tegn`,
  vurdertRisikoForLangtidsfravar:
    "Det er vurdert risiko for langtidsfravær. Da kan det være aktuelt å gjøre en § 14a-vurdering i ",
  lenkeTilModiaAO: "vedtaksstøtteløsningen i Modia Arbeidsrettet oppfølging.",
};

function logEvent() {
  trackEvent({
    name: Events.LINK_KLIKKET,
    properties: {
      tekst: texts.lenkeTilModiaAO,
      href: LINK_14A,
    },
  });
}

interface Props {
  nyesteKandidat: KartleggingssporsmalKandidatResponseDTO;
  answeredQuestions: KartleggingssporsmalSvarResponseDTO;
}

export function KartleggingVurdering({
  nyesteKandidat,
  answeredQuestions,
}: Props) {
  const vurderSvar = useKartleggingssporsmalVurderSvar();

  const [vurdering, setVurdering] = useState<{
    vurderingAlternativ: VurderingAlternativ | null;
    vurderingFritekst: string | null;
  }>({
    vurderingAlternativ: nyesteKandidat.vurdering?.vurderingAlternativ ?? null,
    vurderingFritekst: nyesteKandidat.vurdering?.vurderingFritekst ?? null,
  });

  const [vurderingError, setVurderingError] = useState<{
    vurderingAlternativError: string | null;
    vurderingFritekstError: string | null;
  }>({
    vurderingAlternativError: null,
    vurderingFritekstError: null,
  });

  const shouldShowBegrunnelse =
    vurdering.vurderingAlternativ &&
    (vurdering.vurderingAlternativ === "RISIKO_FOR_LANGTIDSFRAVAR" ||
      hasRisikoForLangtidsfravar(answeredQuestions));

  return (
    <Box background="default" className="flex flex-col p-6 gap-4 mb-2">
      <Heading size={"medium"}>{texts.heading}</Heading>
      <BodyShort size="small">
        Her skal du vurdere om den sykmeldte har risiko for langtidsfravær og
        behov for tidlig oppfølging. Ta utgangspunkt i veiledningen på høyre
        side når du vurderer saken.
      </BodyShort>
      <KartleggingInfo />

      <List as="ol" className="[&>ol]:space-y-6">
        <List.Item>
          <Label size="small">
            Vurder først om det er risiko for langtidsfravær
          </Label>
          <BodyShort size="small">
            Bruk svarene på kartleggingsspørsmålene for å vurdere om det er
            risiko for langtidsfravær.
          </BodyShort>
        </List.Item>
        <List.Item>
          <Label size="small">
            Vurder oppfølging fra Nav - der det er risiko{" "}
          </Label>
          <BodyShort size="small">
            Se på svarene og annen tilgjengelig informasjon i saken. Ta stilling
            til om den sykmeldte kan ha behov for tidlig oppfølging fra Nav,
            eller om det ikke er behov på nåværende tidspunkt.
          </BodyShort>
        </List.Item>

        <List.Item>
          <Label size="small">Dersom det er behov for oppfølging fra Nav</Label>
          <BodyShort size="small">
            Vurder hvordan du skal følge opp saken. Dette kan innebære kontakt
            med den sykmeldte per telefon eller digital dialog, individuell
            samtale, eller dialogmøte med arbeidsgiver.
          </BodyShort>
        </List.Item>
      </List>
      <BodyShort size="small">
        Husk at den sykmeldte fanges opp på senere oppfølgingspunkter i
        sykefraværet, og at arbeidsgiver har hovedansvaret for oppfølgingen.
      </BodyShort>

      <RadioGroup
        legend={texts.radioLegend}
        className="mt-2"
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
        <Radio
          value="RISIKO_FOR_LANGTIDSFRAVAR"
          description="Velg denne der du har satt i gang videre oppfølging."
        >
          {texts.RISIKO_FOR_LANGTIDSFRAVAR}
        </Radio>
        <Radio
          value="IKKE_RISIKO_FOR_LANGTIDSFRAVAR"
          description="Velg denne der det ikke er risiko, eller der det er risiko, men ikke behov for oppfølging fra Nav på nåværende tidspunkt."
        >
          {texts.IKKE_RISIKO_FOR_LANGTIDSFRAVAR}
        </Radio>
      </RadioGroup>
      {shouldShowBegrunnelse && (
        <Textarea
          label={texts.textLegend}
          value={vurdering.vurderingFritekst ?? ""}
          maxLength={VURDERING_MAX_LENGTH}
          readOnly={nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET}
          error={vurderingError.vurderingFritekstError}
          onChange={(e) =>
            setVurdering((vurderingParam) => ({
              ...vurderingParam,
              vurderingFritekst: e.target.value,
            }))
          }
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
              shouldShowBegrunnelse &&
              vurdering.vurderingFritekst &&
              vurdering.vurderingFritekst.length > VURDERING_MAX_LENGTH
            ) {
              setVurderingError((vurderingErrorParam) => ({
                ...vurderingErrorParam,
                vurderingFritekstError: texts.begrunnelseForLangError,
              }));
              return;
            }

            vurderSvar.mutate({
              kandidatUuid: nyesteKandidat.kandidatUuid,
              vurderingAlternativ: vurdering.vurderingAlternativ,
              vurderingFritekst: shouldShowBegrunnelse
                ? (vurdering.vurderingFritekst ?? undefined)
                : undefined,
            });
          }}
          loading={vurderSvar.isPending}
        >
          {texts.button}
        </Button>
      )}

      {vurderSvar.isError && <SkjemaInnsendingFeil error={vurderSvar.error} />}

      {nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET && (
        <SuccessAlert nyesteKandidat={nyesteKandidat} />
      )}
      {nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET &&
        shouldShowBegrunnelse && (
          <BodyLong size="small">
            {texts.vurdertRisikoForLangtidsfravar}
            <EksternLenke href={LINK_14A} onClick={logEvent}>
              {texts.lenkeTilModiaAO}
            </EksternLenke>
          </BodyLong>
        )}
    </Box>
  );
}
