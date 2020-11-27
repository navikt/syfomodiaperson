import { gamleSMStatuser } from "./sykmeldingstatuser";
import {
  ARBEIDSLEDIG,
  NAERINGSDRIVENDE,
  FRILANSER,
} from "../../enums/arbeidssituasjoner";
import { senesteTom, tidligsteFom } from "../periodeUtils";

export const finnAvventendeSykmeldingTekst = (sykmelding) => {
  const avventendePeriode =
    sykmelding.mulighetForArbeid.perioder &&
    sykmelding.mulighetForArbeid.perioder.find((periode) => {
      return !!periode.avventende;
    });
  return avventendePeriode && avventendePeriode.avventende;
};

export const erBehandlingsdagerEllerReisetilskudd = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.mulighetForArbeid.perioder &&
    sykmelding.mulighetForArbeid.perioder.find((periode) => {
      return !!periode.reisetilskudd || !!periode.behandlingsdager;
    });
  return !!erEkstraInformasjon;
};

export const erEkstraDiagnoseInformasjon = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.diagnose &&
    (sykmelding.diagnose.fravaersgrunnLovfestet ||
      sykmelding.diagnose.svangerskap ||
      sykmelding.diagnose.yrkesskade);
  return !!erEkstraInformasjon;
};

export const erMulighetForArbeidInformasjon = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.mulighetForArbeid &&
    ((sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length > 0) ||
      sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433 ||
      (sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
        sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length > 0) ||
      sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434);
  return !!erEkstraInformasjon;
};

export const erFriskmeldingInformasjon = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.friskmelding &&
    (sykmelding.friskmelding.antarReturSammeArbeidsgiver ||
      sykmelding.friskmelding.antarReturAnnenArbeidsgiver ||
      sykmelding.friskmelding.tilbakemeldingReturArbeid ||
      sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid ||
      sykmelding.friskmelding.utenArbeidsgiverTilbakemelding);
  return !!erEkstraInformasjon;
};

export const erArbeidsforEtterPerioden = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.friskmelding && sykmelding.friskmelding.arbeidsfoerEtterPerioden;
  return !!erEkstraInformasjon;
};

export const erHensynPaaArbeidsplassenInformasjon = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.friskmelding && sykmelding.friskmelding.hensynPaaArbeidsplassen;
  return !!erEkstraInformasjon;
};

export const erUtdypendeOpplysningerInformasjon = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.utdypendeOpplysninger &&
    (sykmelding.utdypendeOpplysninger.sykehistorie ||
      sykmelding.utdypendeOpplysninger.paavirkningArbeidsevne ||
      sykmelding.utdypendeOpplysninger.resultatAvBehandling ||
      sykmelding.utdypendeOpplysninger.henvisningUtredningBehandling ||
      sykmelding.utdypendeOpplysninger.sykehistoriePunkt63 ||
      sykmelding.utdypendeOpplysninger.henvisningUtredningBehandlingPunkt63);
  return !!erEkstraInformasjon;
};

export const erBedringAvArbeidsevnenInformasjon = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.arbeidsevne &&
    (sykmelding.arbeidsevne.tilretteleggingArbeidsplass ||
      sykmelding.arbeidsevne.tiltakNAV ||
      sykmelding.arbeidsevne.tiltakAndre);
  return !!erEkstraInformasjon;
};

export const erMeldingTilNavInformasjon = (sykmelding) => {
  const erEkstraInformasjon =
    sykmelding.meldingTilNav && sykmelding.meldingTilNav.navBoerTaTakISaken;
  return !!erEkstraInformasjon;
};

export const erMeldingTilArbeidsgiverInformasjon = (sykmelding) => {
  const erEkstraInformasjon = sykmelding.innspillTilArbeidsgiver;
  return !!erEkstraInformasjon;
};

export const erEkstraInformasjonISykmeldingen = (sykmelding) => {
  return (
    erEkstraDiagnoseInformasjon(sykmelding) ||
    erMulighetForArbeidInformasjon(sykmelding) ||
    erFriskmeldingInformasjon(sykmelding) ||
    erArbeidsforEtterPerioden(sykmelding) ||
    erHensynPaaArbeidsplassenInformasjon(sykmelding) ||
    erUtdypendeOpplysningerInformasjon(sykmelding) ||
    erBedringAvArbeidsevnenInformasjon(sykmelding) ||
    erMeldingTilNavInformasjon(sykmelding) ||
    erMeldingTilArbeidsgiverInformasjon(sykmelding) ||
    erBehandlingsdagerEllerReisetilskudd(sykmelding)
  );
};

export const arbeidsgivernavnEllerArbeidssituasjon = (sykmelding) => {
  if (
    sykmelding.innsendtArbeidsgivernavn &&
    sykmelding.innsendtArbeidsgivernavn.length > 0
  ) {
    return sykmelding.innsendtArbeidsgivernavn;
  }

  switch (sykmelding.sporsmal.arbeidssituasjon) {
    case ARBEIDSLEDIG:
      return "Ingen arbeidsgiver";
    case NAERINGSDRIVENDE:
      return "Selvstendig næringsdrivende";
    case FRILANSER:
      return "Frilanser";
    default:
      return "Annet";
  }
};

export const sykmeldingerMedStatusSendt = (sykmeldinger) => {
  return sykmeldinger.filter((sykmelding) => {
    return sykmelding.status === gamleSMStatuser.SENDT;
  });
};

export const sykmeldingerInnenforOppfolgingstilfellet = (
  sykmeldinger,
  oppfolgingstilfelleperioder
) => {
  return sykmeldinger.filter((sykmelding) => {
    const tilfelleperioderReducer =
      oppfolgingstilfelleperioder[sykmelding.orgnummer];
    const sykmeldingStart = new Date(sykmelding.startLegemeldtFravaer);
    sykmeldingStart.setHours(0, 0, 0, 0);

    const tilfelleStart =
      tilfelleperioderReducer &&
      tilfelleperioderReducer.data &&
      tilfelleperioderReducer.data[0] &&
      tilfelleperioderReducer.data[0].fom
        ? new Date(tilfelleperioderReducer.data[0].fom)
        : new Date();
    tilfelleStart.setHours(0, 0, 0, 0);

    return sykmeldingStart.getTime() - tilfelleStart.getTime() >= 0;
  });
};

export const sykmeldingerSortertNyestTilEldst = (sykmeldinger) => {
  return sykmeldinger.sort((sykmelding1, sykmelding2) => {
    const dato1 = new Date(sykmelding1.bekreftelse.utstedelsesdato);
    const dato2 = new Date(sykmelding2.bekreftelse.utstedelsesdato);

    return dato1 > dato2 ? -1 : 1;
  });
};

export const sykmeldingerGruppertEtterVirksomhet = (sykmeldinger) => {
  return (
    sykmeldinger &&
    sykmeldinger.length > 0 &&
    sykmeldinger.reduce((memo, sykmelding) => {
      const virksomhetsnummer =
        sykmelding.mottakendeArbeidsgiver &&
        sykmelding.mottakendeArbeidsgiver.virksomhetsnummer;
      const memo2 = { ...memo };
      if (!memo2[virksomhetsnummer]) {
        memo2[virksomhetsnummer] = [];
      }
      memo2[virksomhetsnummer] = [...memo2[virksomhetsnummer], sykmelding];
      return memo2;
    }, {})
  );
};

export const sykmeldingperioderSortertEldstTilNyest = (perioder) => {
  return perioder.sort((periode1, periode2) => {
    return periode1.fom > periode2.fom
      ? 1
      : periode1.fom < periode2.fom
      ? -1
      : 0;
  });
};

const sykmeldingperioderMedGradering = (sykmeldingperioder) => {
  return sykmeldingperioder.filter((periode) => {
    return !!periode.grad;
  });
};

export const stringMedAlleGraderingerFraSykmeldingPerioder = (
  sykmeldingPerioderSortertEtterDato
) => {
  const perioderMedGradering = sykmeldingperioderMedGradering(
    sykmeldingPerioderSortertEtterDato
  );
  const stringMedAlleGraderinger = perioderMedGradering
    .map((periode) => {
      return periode.grad;
    })
    .join("% - ");

  return stringMedAlleGraderinger ? `${stringMedAlleGraderinger}%` : "";
};

const isSykmeldingSendtOrBekreftet = (sykmelding) => {
  return (
    sykmelding.status === gamleSMStatuser.SENDT ||
    sykmelding.status === gamleSMStatuser.BEKREFTET
  );
};

const isSykmeldingActiveToday = (sykmelding) => {
  const today = new Date();
  return (
    tidligsteFom(sykmelding.mulighetForArbeid.perioder) <= today &&
    today <= senesteTom(sykmelding.mulighetForArbeid.perioder)
  );
};

const activeSykmeldinger = (sykmeldinger) => {
  return sykmeldinger.filter((sykmelding) => {
    return (
      isSykmeldingSendtOrBekreftet(sykmelding) &&
      isSykmeldingActiveToday(sykmelding)
    );
  });
};

export const sykmeldingerHasCoronaDiagnose = (sykmeldinger) => {
  const sykmeldingerActiveNow = activeSykmeldinger(sykmeldinger);
  return (
    sykmeldingerActiveNow.length > 0 &&
    sykmeldingerActiveNow.findIndex((sykmelding) => {
      return sykmelding.harRedusertArbeidsgiverperiode;
    }) > -1
  );
};

export const activeSykmeldingerSentToArbeidsgiver = (sykmeldinger) => {
  return sykmeldinger.filter((sykmelding) => {
    return (
      sykmelding.status === gamleSMStatuser.SENDT &&
      isSykmeldingActiveToday(sykmelding)
    );
  });
};
