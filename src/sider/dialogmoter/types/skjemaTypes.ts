import { DialogmotedeltakerBehandlerDTO } from "./dialogmoteTypes";

export interface EndreSkjemaValues extends TidStedSkjemaValues {
  begrunnelseArbeidsgiver: string;
  begrunnelseArbeidstaker: string;
  begrunnelseBehandler?: string;
  behandler?: DialogmotedeltakerBehandlerDTO;
}

export interface TidStedSkjemaValues {
  klokkeslett: string;
  dato: string;
  sted: string;
  videoLink?: string;
}
