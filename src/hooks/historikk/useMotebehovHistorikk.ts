import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import {
  mapMotebehovToMeldtMotebehovFormat,
  mapMotebehovToSvarMotebehovFormat,
} from "@/utils/motebehovUtils";
import {
  MeldtMotebehov,
  MotebehovInnmelder,
  SvarMotebehov,
} from "@/data/motebehov/types/motebehovTypes";

function getTextForMeldtMotebehov(meldtMotebehov: MeldtMotebehov): string {
  const meldtBehovBegrunnelse = meldtMotebehov.begrunnelse
    ? `Begrunnelse: ${meldtMotebehov.begrunnelse}`
    : "";

  switch (meldtMotebehov.innmelder) {
    case MotebehovInnmelder.ARBEIDSTAKER:
      return `Den sykmeldte meldte behov for dialogmøte. ${meldtBehovBegrunnelse}`;
    case MotebehovInnmelder.ARBEIDSGIVER:
      return `${
        meldtMotebehov.opprettetAvNavn
          ? meldtMotebehov.opprettetAvNavn + " (Arbeidsgiver)"
          : "Arbeidsgiver"
      } meldte behov for dialogmøte. ${meldtBehovBegrunnelse}`;
  }
}

function createHistorikkEventsFromMeldtMotebehov(
  meldteMotebehov: MeldtMotebehov[]
): HistorikkEvent[] {
  const meldteMotebehovEvents: HistorikkEvent[] = [];
  meldteMotebehov.map((motebehov: MeldtMotebehov) => {
    meldteMotebehovEvents.push({
      opprettetAv: motebehov.opprettetAvNavn ?? undefined,
      tekst: getTextForMeldtMotebehov(motebehov),
      tidspunkt: motebehov.opprettetDato,
      kilde: "MOTEBEHOV",
    });
  });
  meldteMotebehov.map((motebehov: MeldtMotebehov) => {
    if (motebehov.behandletVeilederIdent && motebehov.behandletTidspunkt) {
      meldteMotebehovEvents.push({
        opprettetAv: motebehov.behandletVeilederIdent,
        tekst: `${motebehov.behandletVeilederIdent} vurderte behovet for dialogmøte`,
        tidspunkt: motebehov.behandletTidspunkt,
        kilde: "MOTEBEHOV",
      });
    }
  });

  return meldteMotebehovEvents;
}

function getTextForSvarMotebehov(svarMotebehov: SvarMotebehov): string {
  const svarResultat = svarMotebehov.motebehovSvar.harMotebehov
    ? "svarte ja på ønske om dialogmøte."
    : "svarte nei på ønske om dialogmøte.";
  const svarForklaring = svarMotebehov.motebehovSvar.forklaring
    ? `Svaret var: ${svarMotebehov.motebehovSvar.forklaring}`
    : "";

  switch (svarMotebehov.innmelder) {
    case MotebehovInnmelder.ARBEIDSTAKER:
      return `Den sykmeldte ${svarResultat} ${svarForklaring}`;
    case MotebehovInnmelder.ARBEIDSGIVER:
      return `${
        svarMotebehov.opprettetAvNavn
          ? svarMotebehov.opprettetAvNavn + " (Arbeidsgiver) "
          : "Arbeidsgiver "
      }  ${svarResultat} ${svarForklaring}`;
  }
}

function createHistorikkEventsFromSvarMotebehov(
  svarMotebehov: SvarMotebehov[]
): HistorikkEvent[] {
  const svarMotebehovEvents: HistorikkEvent[] = [];
  svarMotebehov.map((motebehov: SvarMotebehov) => {
    svarMotebehovEvents.push({
      opprettetAv: motebehov.opprettetAvNavn ?? undefined,
      tekst: getTextForSvarMotebehov(motebehov),
      tidspunkt: motebehov.opprettetDato,
      kilde: "MOTEBEHOV",
    });
  });
  svarMotebehov.map((motebehov: SvarMotebehov) => {
    if (motebehov.behandletVeilederIdent && motebehov.behandletTidspunkt) {
      svarMotebehovEvents.push({
        opprettetAv: motebehov.behandletVeilederIdent,
        tekst: `${motebehov.behandletVeilederIdent} vurderte svaret på behovet for dialogmøte`,
        tidspunkt: motebehov.behandletTidspunkt,
        kilde: "MOTEBEHOV",
      });
    }
  });

  return svarMotebehovEvents;
}

interface MotebehovHistorikk {
  isLoading: boolean;
  isError: boolean;
  events: HistorikkEvent[];
}

export function useMotebehovHistorikk(): MotebehovHistorikk {
  const motebehov = useMotebehovQuery();
  const meldtMotebehov = mapMotebehovToMeldtMotebehovFormat(motebehov.data);
  const svarMotebehov = mapMotebehovToSvarMotebehovFormat(motebehov.data);

  const meldtMotebehovEvents =
    createHistorikkEventsFromMeldtMotebehov(meldtMotebehov);
  const svarMotebehovEvents =
    createHistorikkEventsFromSvarMotebehov(svarMotebehov);

  return {
    isLoading: motebehov.isLoading,
    isError: motebehov.isError,
    events: meldtMotebehovEvents.concat(svarMotebehovEvents),
  };
}
