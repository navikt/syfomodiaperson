import { BehandlingsutfallDTO } from "./BehandlingsutfallDTO";
import { SporsmalSvarDTO } from "./SporsmalSvarDTO";

export enum ArbeidssituasjonType {
  NAERINGSDRIVENDE = "NAERINGSDRIVENDE",
  FRILANSER = "FRILANSER",
  ARBEIDSTAKER = "ARBEIDSTAKER",
  ARBEIDSLEDIG = "ARBEIDSLEDIG",
  ANNET = "ANNET",
}

export enum SykmeldingStatus {
  NY = "NY",
  SENDT = "SENDT",
  UTGAATT = "UTGAATT",
  AVBRUTT = "AVBRUTT",
  BEKREFTET = "BEKREFTET",
  TIL_SENDING = "TIL_SENDING",
}

export interface NaermesteLeder {
  navn: string;
  epost: string;
  mobil: string;
  orgnummer: string;
  organisasjonsnavn: string;
  aktivTom: string;
}

export interface Arbeidsgiver {
  navn: string;
  orgnummer: string;
  naermesteLeder?: NaermesteLeder;
}

export interface SykmeldingDiagnose {
  diagnose?: string;
  diagnosekode: string;
  diagnosesystem: string;
  diagnosetekst?: string;
}

export interface SykmeldingPeriodeDTO {
  fom: Date;
  tom: Date;
  grad?: number;
  behandlingsdager?: number;
  reisetilskudd?: boolean;
  avventende?: string;
  redusertVenteperiode?: boolean;
}

export interface Datospenn {
  fom?: string;
  tom?: string;
}

export interface FriskmeldingDTO {
  arbeidsfoerEtterPerioden?: boolean;
  hensynPaaArbeidsplassen?: string;
  antarReturSammeArbeidsgiver?: boolean;
  antattDatoReturSammeArbeidsgiver?: Date;
  antarReturAnnenArbeidsgiver?: boolean;
  tilbakemeldingReturArbeid?: Date;
  utenArbeidsgiverAntarTilbakeIArbeid?: boolean;
  utenArbeidsgiverAntarTilbakeIArbeidDato?: Date;
  utenArbeidsgiverTilbakemelding?: Date;
}

export interface UtenlandskSykmeldingDTO {
  land: string;
}

export interface SykmeldingOldFormat {
  id: string;
  mottattTidspunkt: Date;
  startLegemeldtFravaer?: Date;
  skalViseSkravertFelt: boolean;
  identdato?: string;
  status: SykmeldingStatus;
  naermesteLederStatus?: string;
  innsendtArbeidsgivernavn?: string;
  valgtArbeidssituasjon?: string;
  behandlingsutfall: BehandlingsutfallDTO;
  mottakendeArbeidsgiver?: {
    navn: string;
    virksomhetsnummer: string;
    juridiskOrgnummer: string;
  };
  orgnummer?: string;
  sendtdato: string;
  sporsmal: {
    harForsikring?: boolean;
    arbeidssituasjon?: string;
    fravaersperioder?: Datospenn[];
    harAnnetFravaer?: boolean;
    egenmeldingsdager?: string[];
  };
  pasient: {
    fnr?: string;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
  };
  arbeidsgiver?: string;
  stillingsprosent?: number;
  yrkesbetegnelse?: string;
  diagnose: {
    hoveddiagnose?: SykmeldingDiagnose;
    bidiagnoser?: SykmeldingDiagnose[];
    fravaersgrunnLovfestet?: string;
    fravaerBeskrivelse?: string;
    svangerskap?: boolean;
    yrkesskade?: boolean;
    yrkesskadeDato?: Date;
  };
  mulighetForArbeid: {
    perioder: SykmeldingPeriodeDTO[];
    aktivitetIkkeMulig433?: string[];
    aktivitetIkkeMulig434?: string[];
    aarsakAktivitetIkkeMulig433?: string;
    aarsakAktivitetIkkeMulig434?: string;
  };
  friskmelding: FriskmeldingDTO;
  /**
   * Ytre key representerer et sett med opplysninger sendt inn i uke 7 (key: 6.3), 17 (key: 6.4) og 39 (key: 6.5).
   * Indre key representerer spørsmålene.
   * Verdien er et `SporsmalSvarDTO` -objekt som inneholder spørsmålet og det tilhørende svaret.
   */
  utdypendeOpplysninger: Map<string, Map<string, SporsmalSvarDTO>>;
  arbeidsevne: {
    tilretteleggingArbeidsplass?: string;
    tiltakNAV?: string;
    tiltakAndre?: string;
  };
  meldingTilNav: {
    navBoerTaTakISaken?: boolean;
    navBoerTaTakISakenBegrunnelse?: string;
  };
  innspillTilArbeidsgiver?: string;
  tilbakedatering: {
    dokumenterbarPasientkontakt?: Date;
    tilbakedatertBegrunnelse?: string;
  };
  bekreftelse: {
    utstedelsesdato?: Date;
    sykmelder?: string;
    sykmelderTlf?: string;
  };
  egenmeldt?: boolean;
  papirsykmelding?: boolean;
  harRedusertArbeidsgiverperiode?: boolean;
  utenlandskSykmelding?: UtenlandskSykmeldingDTO;
}

export function erSykmeldingUtenArbeidsgiver(
  sykmelding: SykmeldingOldFormat
): boolean {
  return (
    !sykmelding.orgnummer && sykmelding.status === SykmeldingStatus.BEKREFTET
  );
}

export function finnAvventendeSykmeldingTekst(
  sykmelding: SykmeldingOldFormat
): string | undefined {
  const avventendePeriode =
    sykmelding.mulighetForArbeid.perioder &&
    sykmelding.mulighetForArbeid.perioder.find(
      (periode) => !!periode.avventende
    );
  return avventendePeriode?.avventende;
}
