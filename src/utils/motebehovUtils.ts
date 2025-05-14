import {
  InnsenderKey,
  MeldtMotebehov,
  MotebehovInnmelder,
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
  SvarMotebehov,
} from "@/data/motebehov/types/motebehovTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { MotebehovTilbakemeldingDTO } from "@/data/motebehov/useBehandleMotebehovAndSendTilbakemelding";

export const sorterMotebehovDataEtterDatoDesc = (
  a: MotebehovVeilederDTO,
  b: MotebehovVeilederDTO
): number => {
  return b.opprettetDato === a.opprettetDato
    ? 0
    : b.opprettetDato > a.opprettetDato
    ? 1
    : -1;
};

// Møtebehov av typen SVAR_BEHOV med harMotebehov = false genererer ikke oppgaver og skal ikke behandles
export const motebehovUbehandlet = (
  motebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO[] => {
  return motebehovListe.filter(
    (motebehov) =>
      motebehov.formValues.harMotebehov &&
      !motebehov.behandletTidspunkt &&
      !motebehov.behandletVeilederIdent
  );
};

const isBehandletMotebehov = (motebehov: MotebehovVeilederDTO): boolean =>
  motebehov.behandletTidspunkt != null;

export const erAlleMotebehovSvarBehandlet = (
  motebehovListe: MotebehovVeilederDTO[]
): boolean => {
  return motebehovUbehandlet(motebehovListe).length === 0;
};

export const harUbehandletMotebehov = (
  motebehovListe: MotebehovVeilederDTO[]
): boolean => {
  return !erAlleMotebehovSvarBehandlet(motebehovListe);
};

export const hentSistBehandletMotebehov = (
  motebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO | undefined =>
  [...motebehovListe]
    .filter(isBehandletMotebehov)
    .sort((mb1: MotebehovVeilederDTO, mb2: MotebehovVeilederDTO) => {
      if (mb2.behandletTidspunkt === mb1.behandletTidspunkt) {
        return 0;
      }
      if ((mb2.behandletTidspunkt ?? "") > (mb1.behandletTidspunkt ?? "")) {
        return 1;
      }
      return -1;
    })[0];

export function fjerneDuplikatInnsendereMotebehov(
  motebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO[] {
  const unikeInnsendere = new Map<string, MotebehovVeilederDTO>();
  motebehovListe.forEach((motebehov) => {
    const { virksomhetsnummer, innmelderType } = motebehov;
    const key: InnsenderKey = [virksomhetsnummer, innmelderType];
    const keyAsString = JSON.stringify(key);
    if (!unikeInnsendere.get(keyAsString)) {
      unikeInnsendere.set(keyAsString, motebehov);
    }
  });
  return [...unikeInnsendere.values()];
}

export const motebehovlisteMedKunJaSvar = (
  motebehovliste: MotebehovVeilederDTO[]
): MotebehovVeilederDTO[] => {
  return motebehovliste.filter(
    (motebehov) => motebehov.formValues.harMotebehov
  );
};

export const getMotebehovInActiveTilfelle = (
  sortertMotebehovListe: MotebehovVeilederDTO[],
  latestOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined
): MotebehovVeilederDTO[] => {
  return sortertMotebehovListe.filter(
    (motebehov) =>
      latestOppfolgingstilfelle &&
      motebehov.opprettetDato >= latestOppfolgingstilfelle.start
  );
};

export const toMotebehovTilbakemeldingDTO = (
  motebehovsvar: MotebehovVeilederDTO,
  tilbakemelding: string
): MotebehovTilbakemeldingDTO => {
  return {
    varseltekst: tilbakemelding,
    motebehovId: motebehovsvar.id,
  };
};

export function isArbeidstakerMotebehov(motebehov: MotebehovVeilederDTO) {
  return motebehov.innmelderType === MotebehovInnmelder.ARBEIDSTAKER;
}

export const findFirst = (
  innmelderType: MotebehovInnmelder,
  motebehovsvar: MotebehovVeilederDTO[]
): MotebehovVeilederDTO | undefined => {
  return motebehovsvar.find(
    (motebehov) => motebehov.innmelderType === innmelderType
  );
};

export const onskerTolk = (
  motebehov: MotebehovVeilederDTO | undefined
): boolean => {
  return !!(
    motebehov &&
    motebehov.formValues.harMotebehov &&
    motebehov.formValues.onskerTolk
  );
};

export function mapMotebehovToMeldtMotebehovFormat(
  motebehov: MotebehovVeilederDTO[]
): MeldtMotebehov[] {
  return motebehov
    .filter(
      (motebehov) => motebehov.skjemaType === MotebehovSkjemaType.MELD_BEHOV
    )
    .map((motebehov) => {
      return {
        id: motebehov.id,
        opprettetDato: motebehov.opprettetDato,
        opprettetAvNavn: motebehov.opprettetAvNavn,
        innmelder: motebehov.innmelderType,
        arbeidstakerFnr: motebehov.arbeidstakerFnr,
        virksomhetsnummer: motebehov.virksomhetsnummer,
        formValues: motebehov.formValues,
        behandletTidspunkt: motebehov.behandletTidspunkt,
        behandletVeilederIdent: motebehov.behandletVeilederIdent,
        skjemaType: MotebehovSkjemaType.MELD_BEHOV,
      };
    });
}

export function mapMotebehovToSvarMotebehovFormat(
  motebehov: MotebehovVeilederDTO[]
): SvarMotebehov[] {
  return motebehov
    .filter(
      (motebehov) => motebehov.skjemaType === MotebehovSkjemaType.SVAR_BEHOV
    )
    .map((motebehov) => {
      return {
        id: motebehov.id,
        opprettetDato: motebehov.opprettetDato,
        opprettetAvNavn: motebehov.opprettetAvNavn,
        innmelder: motebehov.innmelderType,
        arbeidstakerFnr: motebehov.arbeidstakerFnr,
        virksomhetsnummer: motebehov.virksomhetsnummer,
        formValues: motebehov.formValues,
        behandletTidspunkt: motebehov.behandletTidspunkt,
        behandletVeilederIdent: motebehov.behandletVeilederIdent,
        skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
      };
    });
}
