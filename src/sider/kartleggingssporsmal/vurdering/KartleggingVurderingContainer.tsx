import { DraftTextDTO, useDraftQuery } from "@/hooks/useDraftQuery";
import AppSpinner from "@/components/AppSpinner";
import { KartleggingssporsmalKandidatResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { KartleggingVurdering } from "@/sider/kartleggingssporsmal/vurdering/KartleggingVurdering.tsx";

interface Props {
  nyesteKandidat: KartleggingssporsmalKandidatResponseDTO;
}

export function KartleggingVurderingContainer({ nyesteKandidat }: Props) {
  const draft = useDraftQuery<DraftTextDTO>("kartleggingssporsmal-vurdering");

  return draft.isPending ? (
    <AppSpinner />
  ) : (
    <KartleggingVurdering
      nyesteKandidat={nyesteKandidat}
      begrunnelseUtkast={draft.data?.begrunnelse}
    />
  );
}
