import { isNullOrUndefined } from "util";
import { gamleSMStatuser, nyeSMStatuser } from "./sykmeldingstatuser";
import { sporsmalTypeShortNames } from "./sporsmalTypeShortNames";
import * as periodetyper from "./periodetyper";
import { toDate } from "../datoUtils";
import {
  arbeidsrelaterteArsakerKoder,
  arbeidsrelaterteArsakerTekst,
  medisinskeArsakerKoder,
  medisinskeArsakerTekster,
} from "./AktivitetIkkeMuligArsaker";

const mapArbeidsevne = (sykmelding) => {
  return {
    tilretteleggingArbeidsplass: sykmelding.tiltakArbeidsplassen,
    tiltakAndre: sykmelding.andreTiltak,
    tiltakNAV: sykmelding.tiltakNAV,
  };
};

const sykmelderNavn = (behandler) => {
  if (behandler.mellomnavn) {
    return `${behandler.fornavn} ${behandler.mellomnavn} ${behandler.etternavn}`;
  }
  return `${behandler.fornavn} ${behandler.etternavn}`;
};

const mapBekreftelse = (sykmelding) => {
  return {
    sykmelder: sykmelderNavn(sykmelding.behandler),
    sykmelderTlf: sykmelding.behandler.tlf,
    utstedelsesdato: toDate(sykmelding.behandletTidspunkt),
  };
};

const mapSingleDiagnose = (diagnose) => {
  return {
    diagnose: diagnose && diagnose.tekst,
    diagnosekode: diagnose && diagnose.kode,
    diagnosesystem: diagnose && diagnose.system,
  };
};

const mapBidiagnoser = (sykmelding) => {
  const bidiagnoser =
    sykmelding &&
    sykmelding.medisinskVurdering &&
    sykmelding.medisinskVurdering.biDiagnoser;
  return (
    bidiagnoser &&
    bidiagnoser.map((diagnose) => {
      return mapSingleDiagnose(diagnose);
    })
  );
};

const mapDiagnose = (sykmelding) => {
  const medisinskVurdering = sykmelding.medisinskVurdering;
  const annenFraversArsak =
    medisinskVurdering && medisinskVurdering.annenFraversArsak;
  const notSkjermesForPasient = sykmelding.skjermesForPasient ? null : true;
  return {
    bidiagnoser: notSkjermesForPasient && mapBidiagnoser(sykmelding),
    fravaerBeskrivelse:
      notSkjermesForPasient &&
      annenFraversArsak &&
      annenFraversArsak.beskrivelse,
    fravaersgrunnLovfestet:
      notSkjermesForPasient && annenFraversArsak && annenFraversArsak.grunn[0],
    hoveddiagnose:
      notSkjermesForPasient &&
      mapSingleDiagnose(sykmelding.medisinskVurdering.hovedDiagnose),
    svangerskap: medisinskVurdering && medisinskVurdering.svangerskap,
    yrkesskade: medisinskVurdering && medisinskVurdering.yrkesskade,
    yrkesskadeDato: toDate(
      medisinskVurdering && medisinskVurdering.yrkesskadeDato
    ),
  };
};

const mapFriskmelding = (sykmelding) => {
  const prognose = sykmelding.prognose;
  return {
    antarReturAnnenArbeidsgiver:
      prognose && prognose.erIArbeid && prognose.erIArbeid.annetArbeidPaSikt,
    antarReturSammeArbeidsgiver:
      prognose && prognose.erIArbeid && prognose.erIArbeid.egetArbeidPaSikt,
    antattDatoReturSammeArbeidsgiver: toDate(
      prognose && prognose.erIArbeid && prognose.erIArbeid.arbeidFOM
    ),
    arbeidsfoerEtterPerioden: prognose && prognose.arbeidsforEtterPeriode,
    hensynPaaArbeidsplassen: prognose && prognose.hensynArbeidsplassen,
    tilbakemeldingReturArbeid: toDate(
      prognose && prognose.erIArbeid && prognose.erIArbeid.vurderingsdato
    ),
    utenArbeidsgiverAntarTilbakeIArbeid:
      prognose &&
      prognose.erIkkeIArbeid &&
      prognose.erIkkeIArbeid.arbeidsforPaSikt,
    utenArbeidsgiverAntarTilbakeIArbeidDato: toDate(
      prognose && prognose.erIkkeIArbeid && prognose.erIkkeIArbeid.arbeidsforFOM
    ),
    utenArbeidsgiverTilbakemelding: toDate(
      prognose &&
        prognose.erIkkeIArbeid &&
        prognose.erIkkeIArbeid.vurderingsdato
    ),
  };
};

const mapInnsendtArbeidsgivernavn = (sykmelding) => {
  return (
    sykmelding.sykmeldingStatus.arbeidsgiver &&
    sykmelding.sykmeldingStatus.arbeidsgiver.orgNavn
  );
};

const mapMeldingTilNav = (sykmelding) => {
  const meldingTilNav = sykmelding.meldingTilNAV;
  return {
    navBoerTaTakISaken: meldingTilNav && meldingTilNav.bistandUmiddelbart,
    navBoerTaTakISakenBegrunnelse:
      meldingTilNav && meldingTilNav.beskrivBistand,
  };
};

const mapMottakendeArbeidsgiver = (sykmelding) => {
  const mottakendeArbeidsgiver = sykmelding.sykmeldingStatus.arbeidsgiver;

  return (
    mottakendeArbeidsgiver && {
      juridiskOrgnummer: mottakendeArbeidsgiver.juridiskOrgnummer,
      navn: mottakendeArbeidsgiver.orgNavn,
      virksomhetsnummer: mottakendeArbeidsgiver.orgnummer,
    }
  );
};

const periodeWithAktivitetIkkeMulig = (sykmelding) => {
  const perioder = sykmelding.sykmeldingsperioder;

  return perioder.find((periode) => {
    return !!periode.aktivitetIkkeMulig;
  });
};

const mapGrad = (periode) => {
  if (periode === null) {
    return null;
  }
  if (periode.type === periodetyper.AKTIVITET_IKKE_MULIG) {
    return 100;
  }
  if (periode.gradert && periode.gradert.grad) {
    return periode.gradert.grad;
  }
  return null;
};

const mapPerioder = (sykmelding) => {
  const perioder = sykmelding.sykmeldingsperioder;
  return (
    perioder &&
    perioder.map((periode) => {
      return {
        avventende: periode.innspillTilArbeidsgiver,
        behandlingsdager: periode.behandlingsdager,
        fom: toDate(periode.fom),
        grad: mapGrad(periode),
        reisetilskudd:
          periode.type === periodetyper.REISETILSKUDD ||
          (periode.gradert && periode.gradert.reisetilskudd),
        tom: toDate(periode.tom),
      };
    })
  );
};

const mapMedisinskArsak = (arsak) => {
  return arsak.map((arsakKode) => {
    switch (arsakKode) {
      case medisinskeArsakerKoder.TILSTAND_HINDRER_AKTIVITET:
        return medisinskeArsakerTekster.TILSTAND_HINDRER_AKTIVITET;
      case medisinskeArsakerKoder.AKTIVITET_FORVERRER_TILSTAND:
        return medisinskeArsakerTekster.AKTIVITET_FORVERRER_TILSTAND;
      case medisinskeArsakerKoder.AKTIVITET_FORHINDRER_BEDRING:
        return medisinskeArsakerTekster.AKTIVITET_FORHINDRER_BEDRING;
      default:
        return medisinskeArsakerTekster.ANNET;
    }
  });
};

const mapArbeidsrelatertArsak = (arsak) => {
  return arsak.map((arsakKode) => {
    if (arsakKode === arbeidsrelaterteArsakerKoder.MANGLENDE_TILRETTELEGGING) {
      return arbeidsrelaterteArsakerTekst.MANGLENDE_TILRETTELEGGING;
    }

    return arbeidsrelaterteArsakerTekst.ANNET;
  });
};

const mapMulighetForArbeid = (sykmelding) => {
  const periodeAktivitetIkkeMulig = periodeWithAktivitetIkkeMulig(sykmelding);
  const aktivitetIkkeMulig =
    periodeAktivitetIkkeMulig && periodeAktivitetIkkeMulig.aktivitetIkkeMulig;
  return {
    aarsakAktivitetIkkeMulig433:
      aktivitetIkkeMulig &&
      aktivitetIkkeMulig.medisinskArsak &&
      aktivitetIkkeMulig.medisinskArsak.beskrivelse,
    aarsakAktivitetIkkeMulig434:
      aktivitetIkkeMulig &&
      aktivitetIkkeMulig.arbeidsrelatertArsak &&
      aktivitetIkkeMulig.arbeidsrelatertArsak.beskrivelse,
    aktivitetIkkeMulig433:
      aktivitetIkkeMulig &&
      aktivitetIkkeMulig.medisinskArsak &&
      aktivitetIkkeMulig.medisinskArsak.arsak &&
      mapMedisinskArsak(aktivitetIkkeMulig.medisinskArsak.arsak),
    aktivitetIkkeMulig434:
      aktivitetIkkeMulig &&
      aktivitetIkkeMulig.arbeidsrelatertArsak &&
      aktivitetIkkeMulig.arbeidsrelatertArsak.arsak &&
      mapArbeidsrelatertArsak(aktivitetIkkeMulig.arbeidsrelatertArsak.arsak),
    perioder: mapPerioder(sykmelding),
  };
};

const mapOrgnummer = (sykmelding) => {
  return (
    sykmelding.sykmeldingStatus.arbeidsgiver &&
    sykmelding.sykmeldingStatus.arbeidsgiver.orgnummer
  );
};

const mapPasient = (fnr) => {
  return {
    etternavn: null,
    fnr,
    fornavn: null,
    mellomnavn: null,
  };
};

const mapTilbakedatering = (sykmelding) => {
  const kontaktMedPasient = sykmelding.kontaktMedPasient;
  return {
    dokumenterbarPasientkontakt: toDate(kontaktMedPasient.kontaktDato),
    tilbakedatertBegrunnelse: kontaktMedPasient.begrunnelseIkkeKontakt,
  };
};

const mapUtdypendeOpplysninger62 = (utdypendeOpplysninger) => {
  const utdypendeOpplysninger62 =
    utdypendeOpplysninger && utdypendeOpplysninger["6.2"];
  return (
    utdypendeOpplysninger62 && {
      id: "6.2",
      sporsmal: [
        {
          id: "6.2.1",
          svar:
            utdypendeOpplysninger62["6.2.1"] &&
            utdypendeOpplysninger62["6.2.1"].svar,
        },
        {
          id: "6.2.2",
          svar:
            utdypendeOpplysninger62["6.2.2"] &&
            utdypendeOpplysninger62["6.2.2"].svar,
        },
        {
          id: "6.2.3",
          svar:
            utdypendeOpplysninger62["6.2.3"] &&
            utdypendeOpplysninger62["6.2.3"].svar,
        },
        {
          id: "6.2.4",
          svar:
            utdypendeOpplysninger62["6.2.4"] &&
            utdypendeOpplysninger62["6.2.4"].svar,
        },
      ],
    }
  );
};

const mapUtdypendeOpplysninger63 = (utdypendeOpplysninger) => {
  const utdypendeOpplysninger63 =
    utdypendeOpplysninger && utdypendeOpplysninger["6.3"];
  return (
    utdypendeOpplysninger63 && {
      id: "6.3",
      sporsmal: [
        {
          id: "6.3.1",
          svar:
            utdypendeOpplysninger63["6.3.1"] &&
            utdypendeOpplysninger63["6.3.1"].svar,
        },
        {
          id: "6.3.2",
          svar:
            utdypendeOpplysninger63["6.3.2"] &&
            utdypendeOpplysninger63["6.3.2"].svar,
        },
      ],
    }
  );
};

const mapHenvisningUtredningBehandling = (utdypendeOpplysninger62) => {
  const henvisningUtredningOgBehandling =
    utdypendeOpplysninger62 &&
    utdypendeOpplysninger62.sporsmal.find((spm) => {
      return spm.id === "6.2.4";
    });

  return (
    henvisningUtredningOgBehandling && henvisningUtredningOgBehandling.svar
  );
};

const mapPaavirkningArbeidsevne = (utdypendeOpplysninger62) => {
  const paavirkingArbeidsevne =
    utdypendeOpplysninger62 &&
    utdypendeOpplysninger62.sporsmal.find((spm) => {
      return spm.id === "6.2.2";
    });

  return paavirkingArbeidsevne && paavirkingArbeidsevne.svar;
};

const mapResultatAvBehandling = (utdypendeOpplysninger62) => {
  const resultatAvBehandling =
    utdypendeOpplysninger62 &&
    utdypendeOpplysninger62.sporsmal.find((spm) => {
      return spm.id === "6.2.3";
    });

  return resultatAvBehandling && resultatAvBehandling.svar;
};

const mapSykehistorie = (utdypendeOpplysninger62) => {
  const sykehistorie =
    utdypendeOpplysninger62 &&
    utdypendeOpplysninger62.sporsmal.find((spm) => {
      return spm.id === "6.2.1";
    });

  return sykehistorie && sykehistorie.svar;
};

const mapSykehistoriePunkt63 = (utdypendeOpplysninger63) => {
  const sykehistoriePunkt63 =
    utdypendeOpplysninger63 &&
    utdypendeOpplysninger63.sporsmal.find((spm) => {
      return spm.id === "6.3.1";
    });

  return sykehistoriePunkt63 && sykehistoriePunkt63.svar;
};

const mapHenvisningUtredningBehandlingPunkt63 = (utdypendeOpplysninger63) => {
  const henvisningUtredningBehandlingPunkt63 =
    utdypendeOpplysninger63 &&
    utdypendeOpplysninger63.sporsmal.find((spm) => {
      return spm.id === "6.3.2";
    });

  return (
    henvisningUtredningBehandlingPunkt63 &&
    henvisningUtredningBehandlingPunkt63.svar
  );
};

const mapUtdypendeOpplysninger = (sykmelding) => {
  const utDypendeOpplysninger = sykmelding.utdypendeOpplysninger;
  const utdypendeOpplysninger62 = mapUtdypendeOpplysninger62(
    utDypendeOpplysninger
  );
  const utdypendeOpplysninger63 = mapUtdypendeOpplysninger63(
    utDypendeOpplysninger
  );

  let grupper = [];
  if (utdypendeOpplysninger62) {
    grupper = [utdypendeOpplysninger62];
  }
  if (utdypendeOpplysninger63) {
    grupper = [...grupper, utdypendeOpplysninger63];
  }

  return {
    grupper,
    henvisningUtredningBehandling: mapHenvisningUtredningBehandling(
      utdypendeOpplysninger62
    ),
    paavirkningArbeidsevne: mapPaavirkningArbeidsevne(utdypendeOpplysninger62),
    resultatAvBehandling: mapResultatAvBehandling(utdypendeOpplysninger62),
    sykehistorie: mapSykehistorie(utdypendeOpplysninger62),
    sykehistoriePunkt63: mapSykehistoriePunkt63(utdypendeOpplysninger63),
    henvisningUtredningBehandlingPunkt63: mapHenvisningUtredningBehandlingPunkt63(
      utdypendeOpplysninger63
    ),
  };
};

const sporsmalOfType = (sporsmalOgSvarListe, type) => {
  return (
    sporsmalOgSvarListe &&
    sporsmalOgSvarListe.find((sporsmal) => {
      return sporsmal.shortName === type;
    })
  );
};

const mapFravaersperioder = (sporsmal) => {
  if (isNullOrUndefined(sporsmal) || isNullOrUndefined(sporsmal.svar)) {
    return [];
  }
  return JSON.parse(sporsmal.svar.svar);
};

const mapJaNeiSporsmalToBooleanEllerNull = (sporsmal) => {
  if (isNullOrUndefined(sporsmal) || isNullOrUndefined(sporsmal.svar)) {
    return null;
  }
  return sporsmal.svar.svar === "JA";
};

const mapSporsmal = (sykmelding) => {
  const sporsmalOgSvarListe = sykmelding.sykmeldingStatus.sporsmalOgSvarListe;
  const arbeidssituasjonSporsmal = sporsmalOfType(
    sporsmalOgSvarListe,
    sporsmalTypeShortNames.ARBEIDSSITUASJON
  );

  const forsikringSporsmal = sporsmalOfType(
    sporsmalOgSvarListe,
    sporsmalTypeShortNames.FORSIKRING
  );

  const fravaerSporsmal = sporsmalOfType(
    sporsmalOgSvarListe,
    sporsmalTypeShortNames.FRAVAER
  );

  const periodeSporsmal = sporsmalOfType(
    sporsmalOgSvarListe,
    sporsmalTypeShortNames.PERIODE
  );
  return {
    arbeidssituasjon:
      arbeidssituasjonSporsmal && arbeidssituasjonSporsmal.svar.svar,
    dekningsgrad: null,
    fravaersperioder: mapFravaersperioder(periodeSporsmal),
    harAnnetFravaer: mapJaNeiSporsmalToBooleanEllerNull(fravaerSporsmal),
    harForsikring: mapJaNeiSporsmalToBooleanEllerNull(forsikringSporsmal),
  };
};

const mapStatus = (sykmelding) => {
  switch (sykmelding.sykmeldingStatus.statusEvent) {
    case nyeSMStatuser.APEN: {
      return gamleSMStatuser.NY;
    }
    case nyeSMStatuser.UTGATT: {
      return gamleSMStatuser.UTGAATT;
    }
    default: {
      return sykmelding.sykmeldingStatus.statusEvent;
    }
  }
};

const mapValgtArbeidssituasjon = (sykmelding) => {
  const sporsmalOgSvarListe = sykmelding.sykmeldingStatus.sporsmalOgSvarListe;
  const arbeidssituasjonSporsmal = sporsmalOfType(
    sporsmalOgSvarListe,
    sporsmalTypeShortNames.ARBEIDSSITUASJON
  );

  return arbeidssituasjonSporsmal && arbeidssituasjonSporsmal.svar.svar;
};

export const newSMFormat2OldFormat = (sykmelding, fnr) => {
  return {
    arbeidsevne: mapArbeidsevne(sykmelding),
    arbeidsgiver: sykmelding.arbeidsgiver && sykmelding.arbeidsgiver.navn,
    bekreftelse: mapBekreftelse(sykmelding),
    diagnose: mapDiagnose(sykmelding),
    friskmelding: mapFriskmelding(sykmelding),
    id: sykmelding.id,
    identdato: null,
    innsendtArbeidsgivernavn: mapInnsendtArbeidsgivernavn(sykmelding),
    innspillTilArbeidsgiver: sykmelding.meldingTilArbeidsgiver,
    meldingTilNav: mapMeldingTilNav(sykmelding),
    mottakendeArbeidsgiver: mapMottakendeArbeidsgiver(sykmelding),
    mulighetForArbeid: mapMulighetForArbeid(sykmelding),
    naermesteLederStatus: null,
    orgnummer: mapOrgnummer(sykmelding),
    pasient: mapPasient(fnr),
    sendtdato: toDate(sykmelding.sykmeldingStatus.timestamp),
    mottattTidspunkt: sykmelding.mottattTidspunkt,
    skalViseSkravertFelt: !sykmelding.skjermesForPasient,
    sporsmal: mapSporsmal(sykmelding),
    startLegemeldtFravaer: toDate(sykmelding.syketilfelleStartDato),
    status: mapStatus(sykmelding),
    stillingsprosent:
      sykmelding.arbeidsgiver && sykmelding.arbeidsgiver.stillingsprosent,
    tilbakedatering: mapTilbakedatering(sykmelding),
    utdypendeOpplysninger: mapUtdypendeOpplysninger(sykmelding),
    valgtArbeidssituasjon: mapValgtArbeidssituasjon(sykmelding),
    behandlingsutfall: sykmelding.behandlingsutfall,
    egenmeldt: sykmelding.egenmeldt,
    papirsykmelding: sykmelding.papirsykmelding,
    harRedusertArbeidsgiverperiode: sykmelding.harRedusertArbeidsgiverperiode,
  };
};

export const oldFormatSMForAG = (sykmelding, fnr) => {
  const oldFormatSM = newSMFormat2OldFormat(sykmelding, fnr);

  return {
    ...oldFormatSM,
    arbeidsevne: {
      tilretteleggingArbeidsplass:
        oldFormatSM.arbeidsevne.tilretteleggingArbeidsplass,
      tiltakAndre: null,
      tiltakNAV: null,
    },
    diagnose: {
      bidiagnoser: [],
      fravaerBeskrivelse: null,
      fravaersgrunnLovfestet: null,
      hoveddiagnose: null,
      svangerskap: null,
      yrkesskade: null,
      yrkesskadeDato: null,
    },
    friskmelding: {
      antarReturAnnenArbeidsgiver:
        oldFormatSM.friskmelding.antarReturAnnenArbeidsgiver,
      antarReturSammeArbeidsgiver:
        oldFormatSM.friskmelding.antarReturSammeArbeidsgiver,
      antattDatoReturSammeArbeidsgiver:
        oldFormatSM.friskmelding.antattDatoReturSammeArbeidsgiver,
      arbeidsfoerEtterPerioden:
        oldFormatSM.friskmelding.arbeidsfoerEtterPerioden,
      hensynPaaArbeidsplassen: oldFormatSM.friskmelding.hensynPaaArbeidsplassen,
      tilbakemeldingReturArbeid: null,
      utenArbeidsgiverAntarTilbakeIArbeid: null,
      utenArbeidsgiverAntarTilbakeIArbeidDato: null,
      utenArbeidsgiverTilbakemelding: null,
    },
    meldingTilNav: {
      navBoerTaTakISaken: null,
      navBoerTaTakISakenBegrunnelse: null,
    },
    mulighetForArbeid: {
      aarsakAktivitetIkkeMulig433: undefined,
      aarsakAktivitetIkkeMulig434:
        oldFormatSM.mulighetForArbeid.aarsakAktivitetIkkeMulig434,
      aktivitetIkkeMulig433: undefined,
      aktivitetIkkeMulig434:
        oldFormatSM.mulighetForArbeid.aktivitetIkkeMulig434,
      perioder: oldFormatSM.mulighetForArbeid.perioder,
    },
    tilbakedatering: {
      dokumenterbarPasientkontakt:
        oldFormatSM.tilbakedatering.dokumenterbarPasientkontakt,
      tilbakedatertBegrunnelse: null,
    },
    utdypendeOpplysninger: {
      grupper: [],
      henvisningUtredningBehandling: undefined,
      paavirkningArbeidsevne: undefined,
      resultatAvBehandling: undefined,
      sykehistorie: undefined,
      sykehistoriePunkt63: undefined,
      henvisningUtredningBehandlingPunkt63: undefined,
    },
  };
};
