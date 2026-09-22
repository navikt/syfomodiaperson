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
import { VurderingAlternativ } from "@/sider/tidligoppfolging/types.ts";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil.tsx";
import { useState } from "react";
import { SuccessAlert } from "@/sider/tidligoppfolging/successAlert/SuccessAlert.tsx";
import { finnNaisUrlIntern } from "@/utils/miljoUtil.ts";
import { EksternLenke } from "@/components/EksternLenke.tsx";
import { Events, trackEvent } from "@/utils/umami.ts";
import { TidligOppfolgingInfo } from "@/sider/tidligoppfolging/info/TidligOppfolgingInfo.tsx";
import { useKartleggingssporsmalVurderSvar } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks.ts";
import { hasRisikoForLangtidsfravar } from "@/sider/tidligoppfolging/info/vurdereBehov.ts";

const VURDERING_MAX_LENGTH = 200;
const LINK_14A = `https://veilarbpersonflate${finnNaisUrlIntern()}/vedtaksstotte`;

const texts = {
  heading: "Vurder tidlig oppfølging",
  radioLegend: "Velg alternativet som passer vurderingen",
  textLegend: "Begrunnelse (valgfritt)",
  RISIKO_FOR_LANGTIDSFRAVAR:
    "Jeg vurderer at den sykmeldte har risiko for langtidsfravær og behov for tidlig oppfølging",
  IKKE_RISIKO_FOR_LANGTIDSFRAVAR:
    "Jeg vurderer at den sykmeldte ikke har behov for tidlig oppfølging",
  button: "Lagre vurdering, fjern oppgaven",
  vurderingIkkeValgtError: "Du må velge et alternativ",
  begrunnelseForLangError: `Begrunnelse kan ikke være lengre enn ${VURDERING_MAX_LENGTH} tegn`,
  vurdertRisikoForLangtidsfravar:
    "Det er vurdert behov for tidlig oppfølging. Da kan det være aktuelt å gjøre en § 14a-vurdering i ",
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

export function TidligOppfolgingVurdering({
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
    <Box background="default" className="p-6 gap-4 flex flex-col mb-2">
      <Heading size={"medium"}>{texts.heading}</Heading>
      <TidligOppfolgingInfo />

      <Label size="small">
        Basert på informasjonen som er tilgjengelig her og nå, vurder to
        faktorer:
      </Label>

      <List size="small" as="ol">
        <List.Item>
          Er det risiko for langtidsfravær (mer enn 9 mnd sykefravær)?
        </List.Item>
        <List.Item>
          Er det hensiktsmessig at Nav gir oppfølging på nåværende tidspunkt?
        </List.Item>
      </List>

      <BodyShort size="small">
        Begge faktorer må være til stede for at det skal være behov for tidlig
        oppfølging fra Nav på nåværende tidspunkt.
      </BodyShort>
      <BodyShort size="small">
        Husk at det er arbeidsgiver som har hovedansvaret for oppfølging, særlig
        tidlig i sykefraværet.
      </BodyShort>

      <RadioGroup
        legend={texts.radioLegend}
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
        <Radio value="RISIKO_FOR_LANGTIDSFRAVAR">
          {texts.RISIKO_FOR_LANGTIDSFRAVAR}
        </Radio>
        <Radio value="IKKE_RISIKO_FOR_LANGTIDSFRAVAR">
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
