const texts = {
  oppfolgingsgrunn: {
    taKontaktSykmeldt: "Ta kontakt med den sykmeldte",
    taKontaktArbeidsgiver: "Ta kontakt med arbeidsgiver",
    taKontaktBehandler: "Ta kontakt med behandler",
    vurderDialogmoteSenere: "Vurder behov for dialogmøte",
    folgOppEtterNesteSykmelding: "Følg opp etter neste sykmelding",
    vurderTiltakBehov: "Vurder behov for tiltak",
    vurderArbeidsuforhet: "Vurder §8-4 - Arbeidsuførhet",
    friskmeldingTilArbeidsformidling:
      "Vurder §8-5 - Friskmelding til arbeidsformidling",
    vurder14a: "Vurder §14a",
    vurderAnnenYtelse: "Vurder annen ytelse",
    samtaleMedBruker: "Samtale med bruker",
    deltarForsokForsterketOppfolging:
      "Deltar i forsøk med forsterket oppfølging",
    annet: "Annet",
  },
};

export interface OppfolgingsoppgaveRequestDTO {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  tekst?: string;
  frist: string;
}

export interface EditOppfolgingsoppgaveRequestDTO {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  tekst?: string;
  frist: string;
}

export interface OppfolgingsoppgaveResponseDTO {
  uuid: string;
  updatedAt: Date;
  isActive: boolean;
  createdAt: Date;
  removedBy: string | null;
  versjoner: OppfolgingsoppgaveVersjonResponseDTO[];
}

export interface OppfolgingsoppgaveVersjonResponseDTO {
  uuid: string;
  createdAt: Date;
  createdBy: string;
  tekst: string | null;
  oppfolgingsgrunn: Oppfolgingsgrunn;
  frist: string | null;
}

export enum Oppfolgingsgrunn {
  TA_KONTAKT_SYKEMELDT = "TA_KONTAKT_SYKEMELDT",
  TA_KONTAKT_ARBEIDSGIVER = "TA_KONTAKT_ARBEIDSGIVER",
  TA_KONTAKT_BEHANDLER = "TA_KONTAKT_BEHANDLER",
  VURDER_DIALOGMOTE_SENERE = "VURDER_DIALOGMOTE_SENERE",
  FOLG_OPP_ETTER_NESTE_SYKMELDING = "FOLG_OPP_ETTER_NESTE_SYKMELDING",
  VURDER_TILTAK_BEHOV = "VURDER_TILTAK_BEHOV",
  VURDER_ARBEIDSUTFORHET = "VURDER_ARBEIDSUFORHET",
  FRISKMELDING_TIL_ARBEIDSFORMIDLING = "FRISKMELDING_TIL_ARBEIDSFORMIDLING",
  VURDER_14A = "VURDER_14A",
  VURDER_ANNEN_YTELSE = "VURDER_ANNEN_YTELSE",
  SAMTALE_MED_BRUKER = "SAMTALE_MED_BRUKER",
  DELTAR_FORSOK_FORSTERKET_OPPFOLGING = "DELTAR_FORSOK_FORSTERKET_OPPFOLGING",
  ANNET = "ANNET",
}

export const oppfolgingsgrunnToText = {
  [Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT]:
    texts.oppfolgingsgrunn.taKontaktSykmeldt,
  [Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER]:
    texts.oppfolgingsgrunn.taKontaktArbeidsgiver,
  [Oppfolgingsgrunn.TA_KONTAKT_BEHANDLER]:
    texts.oppfolgingsgrunn.taKontaktBehandler,
  [Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE]:
    texts.oppfolgingsgrunn.vurderDialogmoteSenere,
  [Oppfolgingsgrunn.FOLG_OPP_ETTER_NESTE_SYKMELDING]:
    texts.oppfolgingsgrunn.folgOppEtterNesteSykmelding,
  [Oppfolgingsgrunn.VURDER_TILTAK_BEHOV]:
    texts.oppfolgingsgrunn.vurderTiltakBehov,
  [Oppfolgingsgrunn.VURDER_ARBEIDSUTFORHET]:
    texts.oppfolgingsgrunn.vurderArbeidsuforhet,
  [Oppfolgingsgrunn.FRISKMELDING_TIL_ARBEIDSFORMIDLING]:
    texts.oppfolgingsgrunn.friskmeldingTilArbeidsformidling,
  [Oppfolgingsgrunn.VURDER_14A]: texts.oppfolgingsgrunn.vurder14a,
  [Oppfolgingsgrunn.VURDER_ANNEN_YTELSE]:
    texts.oppfolgingsgrunn.vurderAnnenYtelse,
  [Oppfolgingsgrunn.SAMTALE_MED_BRUKER]:
    texts.oppfolgingsgrunn.samtaleMedBruker,
  [Oppfolgingsgrunn.DELTAR_FORSOK_FORSTERKET_OPPFOLGING]:
    texts.oppfolgingsgrunn.deltarForsokForsterketOppfolging,
  [Oppfolgingsgrunn.ANNET]: texts.oppfolgingsgrunn.annet,
};
