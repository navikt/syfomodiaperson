import { sykmeldingstatuser } from '@navikt/digisyfo-npm';
import {
    ARBEIDSLEDIG,
    NAERINGSDRIVENDE,
    FRILANSER,
} from '../enums/arbeidssituasjoner';

export const erEkstraDiagnoseInformasjon = (sykmelding) => {
    return sykmelding.diagnose
        && (sykmelding.diagnose.fravaersgrunnLovfestet
        || sykmelding.diagnose.svangerskap
        || sykmelding.diagnose.yrkesskade);
};

export const erMulighetForArbeidInformasjon = (sykmelding) => {
    return sykmelding.mulighetForArbeid
    && ((sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 && sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length > 0)
        || sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433
        || (sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 && sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length > 0)
        || sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434);
};

export const erFriskmeldingInformasjon = (sykmelding) => {
    return sykmelding.friskmelding
        && (sykmelding.friskmelding.antarReturSammeArbeidsgiver
        || sykmelding.friskmelding.antarReturAnnenArbeidsgiver
        || sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid);
};

export const erArbeidsforEtterPerioden = (sykmelding) => {
    return sykmelding.friskmelding && sykmelding.friskmelding.arbeidsfoerEtterPerioden;
};

export const erHensynPaaArbeidsplassenInformasjon = (sykmelding) => {
    return sykmelding.friskmelding && sykmelding.friskmelding.hensynPaaArbeidsplassen;
};

export const erUtdypendeOpplysningerInformasjon = (sykmelding) => {
    return sykmelding.utdypendeOpplysninger
        && (sykmelding.utdypendeOpplysninger.sykehistorie
            || sykmelding.utdypendeOpplysninger.paavirkningArbeidsevne
            || sykmelding.utdypendeOpplysninger.resultatAvBehandling
            || sykmelding.utdypendeOpplysninger.henvisningUtredningBehandling);
};

export const erBedringAvArbeidsevnenInformasjon = (sykmelding) => {
    return sykmelding.arbeidsevne
        && (sykmelding.arbeidsevne.tilretteleggingArbeidsplass
            || sykmelding.arbeidsevne.tiltakNAV
            || sykmelding.arbeidsevne.tiltakAndre);
};

export const erMeldingTilNavInformasjon = (sykmelding) => {
    return sykmelding.meldingTilNav && sykmelding.meldingTilNav.navBoerTaTakISaken;
};

export const erMeldingTilArbeidsgiverInformasjon = (sykmelding) => {
    return sykmelding.innspillTilArbeidsgiver;
};

export const erTilbakeDateringInformasjon = (sykmelding) => {
    return sykmelding.tilbakedatering
        && (sykmelding.tilbakedatering.dokumenterbarPasientkontakt
            || sykmelding.tilbakedatering.tilbakedatertBegrunnelse);
};

export const erEkstraInformasjonISykmeldingen = (sykmelding) => {
    return !!erEkstraDiagnoseInformasjon(sykmelding)
        || !!erMulighetForArbeidInformasjon(sykmelding)
        || !!erFriskmeldingInformasjon(sykmelding)
        || !!erArbeidsforEtterPerioden(sykmelding)
        || !!erHensynPaaArbeidsplassenInformasjon(sykmelding)
        || !!erUtdypendeOpplysningerInformasjon(sykmelding)
        || !!erBedringAvArbeidsevnenInformasjon(sykmelding)
        || !!erMeldingTilNavInformasjon(sykmelding)
        || !!erMeldingTilArbeidsgiverInformasjon(sykmelding)
        || !!erTilbakeDateringInformasjon(sykmelding);
};

export const finnArbeidssituasjonEllerArbeidsgiver = (sykmelding) => {
    if (sykmelding.innsendtArbeidsgivernavn && sykmelding.innsendtArbeidsgivernavn.length > 0) {
        return sykmelding.innsendtArbeidsgivernavn;
    }

    switch (sykmelding.sporsmal.arbeidssituasjon) {
        case ARBEIDSLEDIG:
            return 'Ingen arbeidsgiver';
        case NAERINGSDRIVENDE:
            return 'Selvstendig næringsdrivende';
        case FRILANSER:
            return 'Frilanser';
        default:
            return 'Annet';
    }
};

export const finnInnsendteSykmeldinger = (sykmeldinger) => {
    return sykmeldinger.filter((sykmelding) => {
        return sykmelding.status === sykmeldingstatuser.SENDT;
    });
};

export const finnSykmeldingerInnenforOppfolgingstilfellet = (sykmeldinger, oppfolgingstilfelleperioder) => {
    return sykmeldinger.filter((sykmelding) => {
        const tilfelleperioderReducer = oppfolgingstilfelleperioder[sykmelding.orgnummer];
        const sykmeldingStart = new Date(sykmelding.startLegemeldtFravaer);
        sykmeldingStart.setHours(0, 0, 0, 0);

        const tilfelleStart = tilfelleperioderReducer && tilfelleperioderReducer.data && tilfelleperioderReducer.data[0] && tilfelleperioderReducer.data[0].fom
            ? new Date(tilfelleperioderReducer.data[0].fom)
            : new Date();
        tilfelleStart.setHours(0, 0, 0, 0);

        return (sykmeldingStart.getTime() - tilfelleStart.getTime()) >= 0;
    });
};

export const sorterSykmeldingerPaaUtstedelsesdato = (sykmeldinger) => {
    return sykmeldinger.sort((sykmelding1, sykmelding2) => {
        const dato1 = new Date(sykmelding1.bekreftelse.utstedelsesdato);
        const dato2 = new Date(sykmelding2.bekreftelse.utstedelsesdato);

        return dato1 > dato2
            ? -1
            : 1;
    });
};

export const sorterSykmeldingerPaaVirksomhetsnummer = (sykmeldinger) => {
    return sykmeldinger && sykmeldinger.length > 0 && sykmeldinger.reduce((memo, sykmelding) => {
        const virksomhetsnummer = sykmelding.mottakendeArbeidsgiver && sykmelding.mottakendeArbeidsgiver.virksomhetsnummer;
        const memo2 = { ...memo };
        if (!memo2[virksomhetsnummer]) {
            memo2[virksomhetsnummer] = [];
        }
        memo2[virksomhetsnummer] = [...memo2[virksomhetsnummer], sykmelding];
        return memo2;
    }, {});
};

export const sorterSykmeldingPerioderEtterDato = (perioder) => {
    return perioder.sort((periode1, periode2) => {
        return periode1.fom > periode2.fom
            ? 1
            : periode1.fom < periode2.fom
                ? -1
                 : 0;
    });
};

export const stringMedAlleGraderingerFraSykmeldingPerioder = (sykmeldingPerioderSortertEtterDato) => {
    return sykmeldingPerioderSortertEtterDato.map((periode) => {
        return periode.grad;
    }).join('% - ');
};
