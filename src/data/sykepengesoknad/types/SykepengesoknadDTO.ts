export enum VisningskriterieDTO {
  NEI = "NEI",
  JA = "JA",
  CHECKED = "CHECKED",
}

export enum SvarTypeDTO {
  JA_NEI = "JA_NEI",
  DATO = "DATO",
  TIMER = "TIMER",
  PROSENT = "PROSENT",
  BEKREFTELSESPUNKTER = "BEKREFTELSESPUNKTER",
  OPPSUMMERING = "OPPSUMMERING",
  CHECKBOX = "CHECKBOX",
  CHECKBOX_GRUPPE = "CHECKBOX_GRUPPE",
  CHECKBOX_PANEL = "CHECKBOX_PANEL",
  PERIODER = "PERIODER",
  FRITEKST = "FRITEKST",
  COMBOBOX_SINGLE = "COMBOBOX_SINGLE",
  COMBOBOX_MULTIPLE = "COMBOBOX_MULTIPLE",
  LAND = "LAND",
  IKKE_RELEVANT = "IKKE_RELEVANT",
  INFO_BEHANDLINGSDAGER = "INFO_BEHANDLINGSDAGER",
  TALL = "TALL",
  GRUPPE_AV_UNDERSPORSMAL = "GRUPPE_AV_UNDERSPORSMAL",
  RADIO_GRUPPE = "RADIO_GRUPPE",
  RADIO_GRUPPE_TIMER_PROSENT = "RADIO_GRUPPE_TIMER_PROSENT",
  RADIO = "RADIO",
  RADIO_GRUPPE_UKEKALENDER = "RADIO_GRUPPE_UKEKALENDER",
  BELOP = "BELOP",
  KILOMETER = "KILOMETER",
  DATOER = "DATOER",
  PERIODE = "PERIODE",
  KVITTERING = "KVITTERING",
}

enum UtgiftTyper {
  OFFENTLIG_TRANSPORT = "Offentlig transport",
  TAXI = "Taxi",
  PARKERING = "Parkering",
  ANNET = "Annet",
}

export interface Kvittering {
  blobId: string;
  belop: number; // Beløp i heltall øre
  typeUtgift: keyof typeof UtgiftTyper;
  opprettet?: string;
}

export interface SvarDTO {
  verdi: string;
}

export interface ArbeidsgiverDTO {
  navn: string;
  orgnummer: string;
}

export interface SporsmalDTO {
  id?: string;
  tag: string;
  sporsmalstekst?: string;
  undertekst?: string;
  svartype?: SvarTypeDTO;
  min: string;
  max: string;
  pavirkerAndreSporsmal: boolean;
  kriterieForVisningAvUndersporsmal?: VisningskriterieDTO;
  svar: SvarDTO[];
  undersporsmal: SporsmalDTO[];
}

export enum Soknadstype {
  SELVSTENDIGE_OG_FRILANSERE = "SELVSTENDIGE_OG_FRILANSERE",
  OPPHOLD_UTLAND = "OPPHOLD_UTLAND",
  ARBEIDSTAKERE = "ARBEIDSTAKERE",
  ARBEIDSLEDIG = "ARBEIDSLEDIG",
  BEHANDLINGSDAGER = "BEHANDLINGSDAGER",
  ANNET_ARBEIDSFORHOLD = "ANNET_ARBEIDSFORHOLD",
  REISETILSKUDD = "REISETILSKUDD",
  GRADERT_REISETILSKUDD = "GRADERT_REISETILSKUDD",
  FRISKMELDT_TIL_ARBEIDSFORMIDLING = "FRISKMELDT_TIL_ARBEIDSFORMIDLING",
}

export enum Soknadstatus {
  NY = "NY",
  TIL_SENDING = "TIL_SENDING",
  SENDT = "SENDT",
  FREMTIDIG = "FREMTIDIG",
  UTKAST_TIL_KORRIGERING = "UTKAST_TIL_KORRIGERING",
  KORRIGERT = "KORRIGERT",
  AVBRUTT = "AVBRUTT",
  UTGAATT = "UTGAATT",
  SLETTET = "SLETTET",
}

export interface SykepengesoknadDTO {
  id: string;
  sykmeldingId?: string;
  soknadstype: Soknadstype;
  status: Soknadstatus;
  fom: Date;
  tom: Date;
  opprettetDato: Date;
  avbruttDato?: Date;
  sendtTilNAVDato?: Date;
  sendtTilArbeidsgiverDato?: Date;
  sporsmal: SporsmalDTO[];
  korrigerer?: string;
  korrigertAv?: string;
  arbeidsgiver?: ArbeidsgiverDTO;
  _erOppdelt?: boolean;
}
