import { DraftTextDTO, useDraftQuery } from "@/hooks/useDraftQuery";
import { AvslagForm } from "@/sider/arbeidsuforhet/avslag/AvslagForm";
import { VurderingResponseDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import AppSpinner from "@/components/AppSpinner";

interface Props {
  sisteVurdering: VurderingResponseDTO;
}

export default function AvslagFormContainer({ sisteVurdering }: Props) {
  const draft = useDraftQuery<DraftTextDTO>("arbeidsuforhet-avslag");

  return draft.isPending ? (
    <AppSpinner />
  ) : (
    <AvslagForm
      sisteVurdering={sisteVurdering}
      begrunnelseUtkast={draft.data?.begrunnelse}
    />
  );
}
