import { FormSnapshot } from "@/data/skjemasvar/types/SkjemasvarTypes";

export interface Motebehov {
  id: string;
  opprettetDato: Date;
  opprettetAvNavn: string | null;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  skjemaType: MotebehovSkjemaType.MELD_BEHOV | MotebehovSkjemaType.SVAR_BEHOV;
  formValues: MotebehovFormValuesOutputDTO;
}

export type MotebehovVeilederDTO = Motebehov & {
  innmelderType: MotebehovInnmelder;
};

export type MeldtMotebehov = Motebehov & {
  innmelder: MotebehovInnmelder;
  skjemaType: MotebehovSkjemaType.MELD_BEHOV;
};

export type SvarMotebehov = Motebehov & {
  innmelder: MotebehovInnmelder;
  skjemaType: MotebehovSkjemaType.SVAR_BEHOV;
};

export type Virksomhetsnummer = string;
export type InnsenderKey = [Virksomhetsnummer, MotebehovInnmelder];

export interface MotebehovFormValuesOutputDTO {
  harMotebehov: boolean;
  formSnapshot: FormSnapshot | null;
  begrunnelse: string | null;
  onskerSykmelderDeltar: boolean | null;
  onskerSykmelderDeltarBegrunnelse: string | null;
  onskerTolk: boolean | null;
  tolkSprak: string | null;
}

export enum MotebehovSkjemaType {
  MELD_BEHOV = "MELD_BEHOV",
  SVAR_BEHOV = "SVAR_BEHOV",
}

export enum MotebehovInnmelder {
  ARBEIDSTAKER = "ARBEIDSTAKER",
  ARBEIDSGIVER = "ARBEIDSGIVER",
}
