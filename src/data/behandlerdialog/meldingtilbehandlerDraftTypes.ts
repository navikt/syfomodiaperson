import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";

export interface MeldingTilBehandlerDraftDTO {
  tekst: string;
  meldingsType?: string;
  behandler?: BehandlerDTO;
}
