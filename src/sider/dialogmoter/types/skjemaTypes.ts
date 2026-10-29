import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { DialogmotedeltakerBehandlerDTO } from "./dialogmoteTypes";

export interface EndreSkjemaValues extends TidStedSkjemaValues {
  begrunnelseArbeidsgiver: string;
  begrunnelseArbeidstaker: string;
  fritekstBehandler?: string;
  behandler?: DialogmotedeltakerBehandlerDTO;
  nyBehandler?: BehandlerDTO;
}

export interface TidStedSkjemaValues {
  klokkeslett: string;
  dato: string;
  sted: string;
  videoLink?: string;
}
