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
  begrunnelseDescription:
    "Det er valgfritt å skrive begrunnelse. Begrunnelsen vil være synlig i Modia, men vises ikke for den sykmeldte. Begrunnelsen blir ikke journalført.",
};

interface Props {
  kandidat: SenOppfolgingKandidatResponseDTO;
}

export function NewVurderingForm({ kandidat }: Props) {
  const vurderKandidat = useVurderSenOppfolgingKandidat(kandidat.uuid);
  const [begrunnelse, setBegrunnelse] = useState<string>();

  function handleBegrunnelseOnChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setBegrunnelse(e.target.value);
  }

  function handleOnSubmit() {
    vurderKandidat.mutate({
      type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
      begrunnelse: begrunnelse,
    });
  }

  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading size="medium">{texts.heading}</Heading>
      <Textarea
        label="Begrunnelse"
        description={
          <BodyShort size="small" textColor="subtle">
            {texts.begrunnelseDescription}
          </BodyShort>
        }
        onChange={handleBegrunnelseOnChange}
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
