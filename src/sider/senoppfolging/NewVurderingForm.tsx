import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import React, { useState } from "react";
import { BodyShort, Box, Button, Heading, Textarea } from "@navikt/ds-react";
import { useVurderSenOppfolgingKandidat } from "@/data/senoppfolging/useVurderSenOppfolgingKandidat";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";

const texts = {
  heading: "Vurdering",
  missingBegrunnelse: "Du må skrive en begrunnelse",
  button: "Fullfør vurdering",
  description: "Når du fullfører vurderingen fjernes hendelsen fra oversikten.",
  begrunnelseLabel: "Begrunnelse (valgfritt)",
  begrunnelseDescription:
    "Begrunnelsen vil være synlig i Modia, men vises ikke for den sykmeldte på innloggede sider. Innbyggeren kan kreve innsyn i det du skriver her. Begrunnelsen blir ikke journalført.",
};

interface Props {
  kandidat: SenOppfolgingKandidatResponseDTO;
  setIsSubmitted: (isSubmitted: boolean) => void;
}

export function NewVurderingForm({ kandidat, setIsSubmitted }: Props) {
  const vurderKandidat = useVurderSenOppfolgingKandidat(kandidat.uuid);
  const [begrunnelse, setBegrunnelse] = useState<string>();

  function handleOnSubmit() {
    vurderKandidat.mutate(
      {
        type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
        begrunnelse: begrunnelse,
      },
      { onSuccess: () => setIsSubmitted(true) }
    );
  }

  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading size="medium">{texts.heading}</Heading>
      <Textarea
        label={texts.begrunnelseLabel}
        description={
          <BodyShort size="small" textColor="subtle">
            {texts.begrunnelseDescription}
          </BodyShort>
        }
        onChange={(e) => setBegrunnelse(e.target.value)}
        maxLength={1000}
      />
      <BodyShort size="small" textColor="subtle">
        {texts.description}
      </BodyShort>
      <Button
        className="w-max"
        loading={vurderKandidat.isPending}
        onClick={handleOnSubmit}
      >
        {texts.button}
      </Button>
      {vurderKandidat.isError && (
        <SkjemaInnsendingFeil error={vurderKandidat.error} />
      )}
    </Box>
  );
}
