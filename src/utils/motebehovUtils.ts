import dayjs from "dayjs";
import { dagerMellomDatoer } from "./datoUtils";
import {
  MeldtMotebehov,
  MotebehovInnmelder,
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
  SvarMotebehov,
} from "@/data/motebehov/types/motebehovTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { MotebehovTilbakemeldingDTO } from "@/data/motebehov/useBehandleMotebehovAndSendTilbakemelding";

export const sorterMotebehovDataEtterDato = (
  a: MotebehovVeilederDTO,
  b: MotebehovVeilederDTO
): number => {
  return b.opprettetDato === a.opprettetDato
    ? 0
    : b.opprettetDato > a.opprettetDato
    ? 1
    : -1;
};

export const finnNyesteMotebehovsvarFraHverDeltaker = (
  sortertMotebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO[] => {
  return sortertMotebehovListe.filter((motebehov1, index) => {
    return (
      sortertMotebehovListe.findIndex((motebehov2) => {
        return motebehov1.opprettetAv === motebehov2.opprettetAv;
      }) === index
    );
  });
};

export const finnArbeidstakerMotebehovSvar = (
  motebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO | undefined => {
  return motebehovListe.find(
    (motebehov) => motebehov.opprettetAv === motebehov.aktorId
  );
};

export const OPPFOLGINGSFORLOP_MOTEBEHOV_START_DAGER = 16 * 7;
export const OPPFOLGINGSFORLOP_MOTEBEHOV_SLUTT_DAGER = 26 * 7;

export const erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker = (
  startOppfolgingsdato: Date | string
): boolean => {
  const oppfoelgingstilfelleStartDato = new Date(startOppfolgingsdato);
  oppfoelgingstilfelleStartDato.setHours(0, 0, 0, 0);
  const dagensDato = new Date();
  dagensDato.setHours(0, 0, 0, 0);

  const antallDagerSidenOppfoelgingsTilfelleStart = dagerMellomDatoer(
    oppfoelgingstilfelleStartDato,
    dagensDato
  );

  return (
    antallDagerSidenOppfoelgingsTilfelleStart >=
      OPPFOLGINGSFORLOP_MOTEBEHOV_START_DAGER &&
    antallDagerSidenOppfoelgingsTilfelleStart <
      OPPFOLGINGSFORLOP_MOTEBEHOV_SLUTT_DAGER
  );
};

export const erOppfolgingstilfelleSluttDatoPassert = (
  sluttOppfolgingsdato: Date | string
): boolean => {
  const oppfolgingstilfelleSluttDato = new Date(sluttOppfolgingsdato);
  oppfolgingstilfelleSluttDato.setHours(0, 0, 0, 0);
  const dagensDato = new Date();
  dagensDato.setHours(0, 0, 0, 0);

  return dagensDato > oppfolgingstilfelleSluttDato;
};

export const harArbeidstakerSvartPaaMotebehov = (
  motebehovData: MotebehovVeilederDTO[]
): boolean => {
  return !!finnArbeidstakerMotebehovSvar(motebehovData);
};

export const motebehovUbehandlet = (
  motebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO[] => {
  return motebehovListe.filter(
    (motebehov) =>
      motebehov.motebehovSvar &&
      motebehov.motebehovSvar.harMotebehov &&
      !motebehov.behandletTidspunkt
  );
};

const erAlleMotebehovSvarBehandlet = (
  motebehovListe: MotebehovVeilederDTO[]
): boolean => {
  return motebehovUbehandlet(motebehovListe).length === 0;
};

export const erMotebehovBehandlet = (
  motebehovListe: MotebehovVeilederDTO[]
): boolean => {
  return erAlleMotebehovSvarBehandlet(motebehovListe);
};

export const harUbehandletMotebehov = (
  motebehovListe: MotebehovVeilederDTO[]
): boolean => {
  return !erAlleMotebehovSvarBehandlet(motebehovListe);
};

export const hentSistBehandletMotebehov = (
  motebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO | undefined =>
  [...motebehovListe].sort(
    (mb1: MotebehovVeilederDTO, mb2: MotebehovVeilederDTO) => {
      if (mb2.behandletTidspunkt === mb1.behandletTidspunkt) {
        return 0;
      }
      if ((mb2.behandletTidspunkt ?? "") > (mb1.behandletTidspunkt ?? "")) {
        return 1;
      }
      return -1;
    }
  )[0];

export const fjernBehandledeMotebehov = (
  motebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO[] =>
  motebehovListe.filter(
    (motebehov: MotebehovVeilederDTO) => !motebehov.behandletTidspunkt
  );

export function fjerneDuplikatInnsendereMotebehov(
  motebehovListe: MotebehovVeilederDTO[]
): MotebehovVeilederDTO[] {
  return motebehovListe.filter((motebehov, index) => {
    const funnetIndex = motebehovListe.findIndex((motebehovInner) => {
      return motebehovInner.opprettetAv === motebehov.opprettetAv;
    });
    return funnetIndex >= index;
  });
}

export const motebehovlisteMedKunJaSvar = (
  motebehovliste: MotebehovVeilederDTO[]
): MotebehovVeilederDTO[] => {
  return motebehovliste.filter(
    (motebehov) =>
      motebehov.motebehovSvar && motebehov.motebehovSvar.harMotebehov
  );
};

export const motebehovFromLatestActiveTilfelle = (
  sortertMotebehovListe: MotebehovVeilederDTO[],
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO
): MotebehovVeilederDTO[] => {
  if (
    latestOppfolgingstilfelle === undefined ||
    latestOppfolgingstilfelle?.start <
      dayjs(new Date()).subtract(16, "days").toDate()
  ) {
    return motebehovUbehandlet(sortertMotebehovListe);
  }

  const motebehovFromLatestTilfelle = sortertMotebehovListe.filter((svar) => {
    return svar.opprettetDato >= latestOppfolgingstilfelle.start;
  });
  if (motebehovFromLatestTilfelle.length > 0) {
    return motebehovFromLatestTilfelle;
  } else {
    return motebehovUbehandlet(sortertMotebehovListe);
  }
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
  return motebehov.opprettetAv === motebehov.aktorId;
}

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
        opprettetAv: motebehov.opprettetAv,
        opprettetAvNavn: motebehov.opprettetAvNavn,
        innmelder: isArbeidstakerMotebehov(motebehov)
          ? MotebehovInnmelder.ARBEIDSTAKER
          : MotebehovInnmelder.ARBEIDSGIVER,
        arbeidstakerFnr: motebehov.arbeidstakerFnr,
        virksomhetsnummer: motebehov.virksomhetsnummer,
        begrunnelse: motebehov.motebehovSvar.forklaring,
        tildeltEnhet: motebehov.tildeltEnhet,
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
        opprettetAv: motebehov.opprettetAv,
        opprettetAvNavn: motebehov.opprettetAvNavn,
        innmelder: isArbeidstakerMotebehov(motebehov)
          ? MotebehovInnmelder.ARBEIDSTAKER
          : MotebehovInnmelder.ARBEIDSGIVER,
        arbeidstakerFnr: motebehov.arbeidstakerFnr,
        virksomhetsnummer: motebehov.virksomhetsnummer,
        motebehovSvar: motebehov.motebehovSvar,
        tildeltEnhet: motebehov.tildeltEnhet,
        behandletTidspunkt: motebehov.behandletTidspunkt,
        behandletVeilederIdent: motebehov.behandletVeilederIdent,
        skjemaType: MotebehovSkjemaType.SVAR_BEHOV,
      };
    });
}
