import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
  SenOppfolgingVurderingResponseDTO,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import React from "react";
import { BodyShort, Button } from "@navikt/ds-react";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { CheckmarkCircleFillIcon } from "@navikt/aksel-icons";
import { useVurderSenOppfolgingKandidat } from "@/data/senoppfolging/useVurderSenOppfolgingKandidat";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";

const texts = {
  button: "Fullfør vurdering",
  description: "Når du trykker på knappen fjernes hendelsen fra oversikten.",
};

interface Props {
  kandidat: SenOppfolgingKandidatResponseDTO;
}

const VurdertKandidat = ({
  vurdering,
}: {
  vurdering: SenOppfolgingVurderingResponseDTO;
}) => {
  const veilederIdent = vurdering.veilederident;
  const { data: veileder } = useVeilederInfoQuery(veilederIdent);

  return (
    <div className="flex gap-1 items-center">
      <CheckmarkCircleFillIcon
        fontSize="2em"
        color="var(--a-icon-success)"
        title="suksess-ikon"
      />
      <BodyShort size="small">
        {`Vurdert av ${
          veileder?.fulltNavn() ?? veilederIdent
        } ${toDatePrettyPrint(vurdering.createdAt)}`}
      </BodyShort>
    </div>
  );
};

export const VurderSenOppfolging = ({ kandidat }: Props) => {
  const vurderKandidat = useVurderSenOppfolgingKandidat(kandidat.uuid);
  const isFerdigbehandlet =
    kandidat.status === SenOppfolgingStatus.FERDIGBEHANDLET;
  const ferdigbehandletVurdering = kandidat.vurderinger.find(
    (vurdering) => vurdering.type === SenOppfolgingVurderingType.FERDIGBEHANDLET
  );

  return isFerdigbehandlet && ferdigbehandletVurdering ? (
    <VurdertKandidat vurdering={ferdigbehandletVurdering} />
  ) : (
    <>
      {vurderKandidat.isError && (
        <SkjemaInnsendingFeil error={vurderKandidat.error} />
      )}
      <BodyShort size="small" textColor="subtle">
        {texts.description}
      </BodyShort>
      <Button
        className="w-max"
        loading={vurderKandidat.isPending}
        onClick={() =>
          vurderKandidat.mutate({
            type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
          })
        }
      >
        {texts.button}
      </Button>
    </>
  );
};
