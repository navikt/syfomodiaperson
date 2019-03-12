import { tilLesbarDatoMedArstall } from '@navikt/digisyfo-npm';

const maneder = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
const dager = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

export const ANTALL_MS_DAG = 1000 * 60 * 60 * 24;

const pad = (int) => {
    if (int < 10) {
        return `0${int}`;
    }
    return int;
};

export const visDato = (d) => {
    const maned = maneder[d.getMonth()];
    return `${dager[d.getDay()]} ${d.getDate()}. ${maned} ${d.getFullYear()}`;
};

export const visKlokkeslett = (d) => {
    if (typeof d === 'undefined' || d === null) {
        return null;
    }
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());
    return `${hour}.${minute}`;
};

export const lagJsDate = (dato) => {
    if (dato) {
        return new Date(dato);
    }
    return dato;
};

export const konverterTid = (mote) => {
    return Object.assign({}, mote, {
        opprettetTidspunkt: lagJsDate(mote.opprettetTidspunkt),
        bekreftetAlternativ: mote.bekreftetAlternativ ? Object.assign({}, mote.bekreftetAlternativ, {
            tid: lagJsDate(mote.bekreftetAlternativ.tid),
            created: lagJsDate(mote.bekreftetAlternativ.created),
        }) : null,
        bekreftetTidspunkt: mote.bekreftetTidspunkt ? lagJsDate(mote.bekreftetTidspunkt) : null,
        deltakere: mote.deltakere.map((deltaker) => {
            return Object.assign({}, deltaker, {
                svartidspunkt: lagJsDate(deltaker.svartidspunkt),
                svar: deltaker.svar.map((s) => {
                    return Object.assign({}, s, {
                        tid: lagJsDate(s.tid),
                        created: lagJsDate(s.created),
                    });
                }),
            });
        }),
        alternativer: mote.alternativer.map((alt) => {
            return Object.assign({}, alt, {
                tid: lagJsDate(alt.tid),
                created: lagJsDate(alt.created),
            });
        }),
    });
};

export const restdatoTildato = (restdato) => {
    const dato = restdato.split('T')[0];
    return dato.split('-').reverse().join('.');
};

export const restdatoTilLesbarDato = (restdato) => {
    const dato = restdato.split('T')[0];
    return tilLesbarDatoMedArstall(new Date(dato));
};

const maanedListe = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
const ukedagListe = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

export const capitalizeFoersteBokstav = (ord) => {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
};

export const tilDatoMedUkedagOgMaanedNavn = (dato) => {
    const nyDato = new Date(dato);
    const ukeDag = capitalizeFoersteBokstav(ukedagListe[nyDato.getDay()]);
    const dag = nyDato.getDate();
    const maaned = maanedListe[nyDato.getMonth()];
    const aar = nyDato.getFullYear();
    return `${ukeDag} ${dag}. ${maaned} ${aar}`;
};

const dayOrMonthWithTwoDigits = (arg) => {
    return arg > 9
        ? `${arg}`
        : `0${arg}`;
};

export const tilLesbarDatoMedAarUtenMaanedNavn = (datoArg) => {
    const date = new Date(datoArg);
    const day = dayOrMonthWithTwoDigits(date.getDate());
    const month = dayOrMonthWithTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

export const tilLesbarPeriodeMedAarUtenMaanednavn = (fomArg, tomArg) => {
    return `${tilLesbarDatoMedAarUtenMaanedNavn(fomArg)} - ${tilLesbarDatoMedAarUtenMaanedNavn(tomArg)}`;
};

export const hentDagerMellomDatoer = (startDato, sluttDato) => {
    return Math.round(Math.abs((sluttDato.getTime() - startDato.getTime()) / (ANTALL_MS_DAG)));
};
