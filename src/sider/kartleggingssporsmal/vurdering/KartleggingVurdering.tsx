import { Box, Button, Heading, Radio, RadioGroup } from "@navikt/ds-react";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { VurderingAlternativ } from "@/sider/kartleggingssporsmal/types.ts";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil.tsx";
import { PaddingSize } from "@/components/Layout.tsx";
import React, { useState } from "react";
import { SuccessAlert } from "@/sider/kartleggingssporsmal/successAlert/SuccessAlert.tsx";
import { UseMutationResult } from "@tanstack/react-query";

const texts = {
  heading: "Vurdering",
  legend: "Velg alternativet som passer vurderingen",
  RISIKO_FOR_LANGTIDSFRAVAR:
    "Jeg vurderer at den sykmeldte har risiko for et langtidsfravær",
  IKKE_RISIKO_FOR_LANGTIDSFRAVAR:
    "Jeg vurderer at den sykmeldte ikke har risiko for et langtidsfravær",
  button: "Lagre vurdering, fjern oppgaven",
  error: "Du må velge et alternativ",
};

interface Props {
  nyesteKandidat: KartleggingssporsmalKandidatResponseDTO;
  // Vi må ta inn denne fordi visning av flexjar-boksen er knyttet til mutation i Kartleggingssporsmal.tsx
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
        <SkjemaInnsendingFeil
          bottomPadding={PaddingSize.NONE}
          error={vurderSvarMutation.error}
        />
      )}
      {nyesteKandidat.status === KandidatStatus.FERDIGBEHANDLET && (
        <SuccessAlert nyesteKandidat={nyesteKandidat} />
      )}
    </Box>
  );
}
