import {
  BodyLong,
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
} from "@navikt/ds-react";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { VurderingAlternativ } from "@/sider/kartleggingssporsmal/types.ts";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil.tsx";
import React, { useState } from "react";
import { SuccessAlert } from "@/sider/kartleggingssporsmal/successAlert/SuccessAlert.tsx";
import { UseMutationResult } from "@tanstack/react-query";
import { finnNaisUrlIntern } from "@/utils/miljoUtil.ts";
import { EksternLenke } from "@/components/EksternLenke.tsx";
import { Events, trackEvent } from "@/utils/umami.ts";
import { KartleggingInfo } from "@/sider/kartleggingssporsmal/info/KartleggingInfo.tsx";

const texts = {
  heading: "Vurdering",
  legend: "Velg alternativet som passer vurderingen",
  RISIKO_FOR_LANGTIDSFRAVAR:
    "Jeg vurderer at den sykmeldte har risiko for langtidsfravær og behov for oppfølging",
  IKKE_RISIKO_FOR_LANGTIDSFRAVAR:
    "Jeg vurderer at den sykmeldte ikke har behov for oppfølging",
  button: "Lagre vurdering, fjern oppgaven",
  error: "Du må velge et alternativ",
  vurdertRisikoForLangtidsfravar:
    "Det er vurdert risiko for langtidsfravær. Da kan det være aktuelt å gjøre en § 14a-vurdering i ",
  lenkeTilModiaAO: "vedtaksstøtteløsningen i Modia Arbeidsrettet oppfølging.",
};

const lenke14a = `https://veilarbpersonflate${finnNaisUrlIntern()}/vedtaksstotte`;

function logEvent() {
  trackEvent({
    name: Events.LINK_KLIKKET,
    properties: {
      tekst: texts.lenkeTilModiaAO,
      href: lenke14a,
    },
  });
}

interface Props {
  nyesteKandidat: KartleggingssporsmalKandidatResponseDTO;
  answeredQuestions: KartleggingssporsmalSvarResponseDTO;
  // Vi må ta inn vurderSvarMutation fordi visning av tilbakemeldingsboksen er knyttet til mutation i KartleggingssporsmalSide.tsx
  // Kan unngå dette når man har én vurderingsside, ikke to ulike måter å vurdere på
  vurderSvarMutation: UseMutationResult<
    KartleggingssporsmalKandidatResponseDTO,
    Error,
    {
      kandidatUuid: string;
      vurderingAlternativ?: VurderingAlternativ;
    },
    unknown
  >;
}

export function KartleggingVurdering({
  nyesteKandidat,
  answeredQuestions,
  vurderSvarMutation,
}: Props) {
  const [chosenAlternative, setChosenAlternative] =
    useState<VurderingAlternativ | null>(
      nyesteKandidat.vurdering?.vurderingAlternativ ?? null
    );
  const [chosenAlternativeError, setChosenAlternativeError] = useState<
    string | null
  >(null);

  return (
    <Box background="default" className="p-6 gap-6 [&>*]:mb-4 mb-4">
      <KartleggingInfo answeredQuestions={answeredQuestions} />

      <Heading size={"medium"}>{texts.heading}</Heading>
      <RadioGroup
        legend={texts.legend}
        size="small"
        value={chosenAlternative}
        readOnly={nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET}
        error={chosenAlternativeError}
        onChange={(e: VurderingAlternativ) => setChosenAlternative(e)}
      >
        <Radio value="RISIKO_FOR_LANGTIDSFRAVAR">
          {texts.RISIKO_FOR_LANGTIDSFRAVAR}
        </Radio>
        <Radio value="IKKE_RISIKO_FOR_LANGTIDSFRAVAR">
          {texts.IKKE_RISIKO_FOR_LANGTIDSFRAVAR}
        </Radio>
      </RadioGroup>
      {nyesteKandidat.status === KandidatStatus.SVAR_MOTTATT && (
        <Button
          variant="primary"
          size="medium"
          onClick={() => {
            if (chosenAlternative) {
              vurderSvarMutation.mutate({
                kandidatUuid: nyesteKandidat.kandidatUuid,
                vurderingAlternativ: chosenAlternative,
              });
            } else {
              setChosenAlternativeError(texts.error);
            }
          }}
          loading={vurderSvarMutation.isPending}
        >
          {texts.button}
        </Button>
      )}
      {vurderSvarMutation.isError && (
        <SkjemaInnsendingFeil error={vurderSvarMutation.error} />
      )}
      {nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET && (
        <SuccessAlert nyesteKandidat={nyesteKandidat} />
      )}
      {nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET &&
        chosenAlternative === "RISIKO_FOR_LANGTIDSFRAVAR" && (
          <BodyLong size="small">
            {texts.vurdertRisikoForLangtidsfravar}
            <EksternLenke href={lenke14a} onClick={logEvent}>
              {texts.lenkeTilModiaAO}
            </EksternLenke>
          </BodyLong>
        )}
    </Box>
  );
}
