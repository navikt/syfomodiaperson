import { MAX_LENGTH_STED } from "@/components/mote/skjema/MotebookingSkjema";
import { isISODateString } from "nav-datovelger";
import { ReferatSkjemaValues } from "@/components/dialogmote/referat/Referat";
import { MAX_LENGTH_KONKLUSJON } from "@/components/dialogmote/referat/Konklusjon";
import { MAX_LENGTH_SITUASJON } from "@/components/dialogmote/referat/Situasjon";
import { MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE } from "@/components/dialogmote/referat/ArbeidstakersOppgave";
import { MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE } from "@/components/dialogmote/referat/ArbeidsgiversOppgave";
import { MAX_LENGTH_VEILEDERS_OPPGAVE } from "@/components/dialogmote/referat/VeiledersOppgave";
import { MAX_LENGTH_AVLYS_BEGRUNNELSE } from "@/components/dialogmote/avlys/AvlysDialogmoteBegrunnelse";
import { MAX_LENGTH_INNKALLING_FRITEKST } from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";

export interface SkjemaFeil {
  [key: string]: string | undefined;
}

interface Tidspunkt {
  klokkeslett?: string;
  dato?: string;
}

interface Begrunnelser {
  begrunnelseArbeidstaker?: string;
  begrunnelseArbeidsgiver?: string;
}

interface InnkallingFritekster {
  fritekstArbeidsgiver?: string;
  fritekstArbeidstaker?: string;
}

export const texts = {
  dateMissing: "Vennligst angi dato",
  dateWrongFormat: "Vennligst angi riktig datoformat; dd.mm.åååå",
  timeMissing: "Vennligst angi klokkeslett",
  placeMissing: "Vennligst angi møtested",
  textTooLong: (maxLength: number) => `Maks ${maxLength} tegn tillatt`,
  orgMissing: "Vennligst velg arbeidsgiver",
  begrunnelseArbeidstakerMissing:
    "Vennligst angi begrunnelse til arbeidstakeren",
  begrunnelseArbeidsgiverMissing:
    "Vennligst angi begrunnelse til nærmeste leder",
  situasjonMissing: "Vennligst angi situasjon og muligheter",
  konklusjonMissing: "Vennligst angi konklusjon",
  arbeidstakersOppgaveMissing: "Vennligst angi arbeidstakerens oppgave",
  arbeidsgiversOppgaveMissing: "Vennligst angi arbeidsgiverens oppgave",
  naermesteLederMissing: "Vennligst angi nærmeste leder",
  andreDeltakereMissingFunksjon: "Vennligst angi funksjon på deltaker",
  andreDeltakereMissingNavn: "Vennligst angi navn på deltaker",
  invalidVideoLink: "Ugyldig lenke til videomøte",
  invalidVideoLinkDomain: "Lenke må begynne med https://video.nav.no",
};

export const harFeilmeldinger = (errors: SkjemaFeil): boolean =>
  Object.values(errors).filter((value) => value !== undefined).length > 0;

export const validerArbeidsgiver = (orgNummer?: string): string | undefined => {
  if (!orgNummer || orgNummer === "VELG") {
    return texts.orgMissing;
  }
  return undefined;
};

export const validerSted = (
  sted?: string,
  maxLength?: number
): string | undefined => {
  if (undefinedOrEmpty(sted)) {
    return texts.placeMissing;
  } else if (maxLength && sted && sted.length > maxLength) {
    return texts.textTooLong(MAX_LENGTH_STED);
  } else {
    return undefined;
  }
};

export const validerTidspunkt = (tidspunkt?: Tidspunkt): Partial<Tidspunkt> => {
  const feil: Partial<Tidspunkt> = {};
  if (!tidspunkt) {
    feil.klokkeslett = texts.timeMissing;
    feil.dato = texts.dateMissing;
  } else {
    const datoValue = tidspunkt.dato;
    if (!datoValue) {
      feil.dato = texts.dateMissing;
    } else if (!isISODateString(datoValue)) {
      feil.dato = texts.dateWrongFormat;
    }
    const klokkeslettValue = tidspunkt.klokkeslett;
    if (!klokkeslettValue) {
      feil.klokkeslett = texts.timeMissing;
    }
  }

  return feil;
};

export const validerVideoLink = (videoLink?: string): string | undefined => {
  if (!videoLink) {
    return undefined;
  }

  try {
    const url = new URL(videoLink);
    if (url.origin !== "https://video.nav.no") {
      return texts.invalidVideoLinkDomain;
    }
  } catch (err) {
    return texts.invalidVideoLink;
  }

  return undefined;
};

export const validerInnkallingFritekster = (
  fritekster: InnkallingFritekster
): Partial<InnkallingFritekster> => {
  const { fritekstArbeidsgiver, fritekstArbeidstaker } = fritekster;
  return {
    fritekstArbeidsgiver: validerFritekst(
      fritekstArbeidsgiver,
      false,
      MAX_LENGTH_INNKALLING_FRITEKST
    ),
    fritekstArbeidstaker: validerFritekst(
      fritekstArbeidstaker,
      false,
      MAX_LENGTH_INNKALLING_FRITEKST
    ),
  };
};

export const validerBegrunnelser = (
  begrunnelser: Begrunnelser
): Partial<Begrunnelser> => {
  const { begrunnelseArbeidstaker, begrunnelseArbeidsgiver } = begrunnelser;
  return {
    begrunnelseArbeidsgiver: validerFritekst(
      begrunnelseArbeidsgiver,
      true,
      MAX_LENGTH_AVLYS_BEGRUNNELSE,
      texts.begrunnelseArbeidsgiverMissing
    ),
    begrunnelseArbeidstaker: validerFritekst(
      begrunnelseArbeidstaker,
      true,
      MAX_LENGTH_AVLYS_BEGRUNNELSE,
      texts.begrunnelseArbeidstakerMissing
    ),
  };
};

export const validerReferatDeltakere = (
  values: Partial<ReferatSkjemaValues>
): SkjemaFeil => {
  const { naermesteLeder, andreDeltakere } = values;
  const feil: SkjemaFeil = {};
  if (undefinedOrEmpty(naermesteLeder)) {
    feil.naermesteLeder = texts.naermesteLederMissing;
  }
  andreDeltakere?.forEach(({ navn, funksjon }, index) => {
    if (undefinedOrEmpty(funksjon)) {
      feil[`andreDeltakere[${index}].funksjon`] =
        texts.andreDeltakereMissingFunksjon;
    }
    if (undefinedOrEmpty(navn)) {
      feil[`andreDeltakere[${index}].navn`] = texts.andreDeltakereMissingNavn;
    }
  });

  return feil;
};

export const validerReferatTekster = (
  values: Partial<ReferatSkjemaValues>
): SkjemaFeil => {
  return {
    situasjon: validerFritekst(
      values.situasjon,
      true,
      MAX_LENGTH_SITUASJON,
      texts.situasjonMissing
    ),
    konklusjon: validerFritekst(
      values.konklusjon,
      true,
      MAX_LENGTH_KONKLUSJON,
      texts.konklusjonMissing
    ),
    arbeidstakersOppgave: validerFritekst(
      values.arbeidstakersOppgave,
      true,
      MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE,
      texts.arbeidstakersOppgaveMissing
    ),
    arbeidsgiversOppgave: validerFritekst(
      values.arbeidsgiversOppgave,
      true,
      MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE,
      texts.arbeidsgiversOppgaveMissing
    ),
    veiledersOppgave: validerFritekst(
      values.veiledersOppgave,
      false,
      MAX_LENGTH_VEILEDERS_OPPGAVE
    ),
  };
};

const validerFritekst = (
  tekst: string | undefined,
  required: boolean,
  maxLength: number,
  missingMessage?: string
): string | undefined => {
  if (required && undefinedOrEmpty(tekst)) {
    return missingMessage || "";
  } else if (tekst !== undefined && tekst.length > maxLength) {
    return texts.textTooLong(maxLength);
  } else {
    return undefined;
  }
};

const undefinedOrEmpty = (value?: string): boolean => {
  return !value || value.trim() === "";
};
