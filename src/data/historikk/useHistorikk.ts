import { HistorikkEvent } from "./types/historikkTypes";
import {
  useHistorikkMotebehovQuery,
  useHistorikkOppfolgingsplan,
} from "@/data/historikk/historikkQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useAktivitetskravHistorikkQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { useDialogmotekandidatHistorikk } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { useMemo } from "react";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import {
  AktivitetskravHistorikkDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import {
  DialogmotekandidatHistorikkDTO,
  HistorikkType,
} from "@/data/dialogmotekandidat/dialogmotekandidatTypes";
import {
  VurderingResponseDTO as ArbeidsuforhetVurderinger,
  VurderingType as ArbeidsuforhetVurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import {
  VurderingResponseDTO as ManglendemedvirkningVurdering,
  VurderingType as ManglendemedvirkningVurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

const createHistorikkEventsFromLedere = (
  ledere: NarmesteLederRelasjonDTO[]
): HistorikkEvent[] => {
  return ledere.map((leder) => ({
    opprettetAv: leder.virksomhetsnavn,
    tekst: `${leder.virksomhetsnavn} har oppgitt ${leder.narmesteLederNavn} som nærmeste leder`,
    tidspunkt: leder.aktivFom,
    kilde: "LEDER",
  }));
};

const getTextForHistorikk = (
  historikk: AktivitetskravHistorikkDTO,
  person: BrukerinfoDTO
): string => {
  switch (historikk.status) {
    case AktivitetskravStatus.NY:
      return `${person.navn} ble kandidat til aktivitetskravet`;
    case AktivitetskravStatus.NY_VURDERING:
      return `Det ble startet ny vurdering av aktivitetskravet`;
    case AktivitetskravStatus.UNNTAK:
    case AktivitetskravStatus.OPPFYLT:
    case AktivitetskravStatus.STANS:
    case AktivitetskravStatus.IKKE_AKTUELL:
    case AktivitetskravStatus.IKKE_OPPFYLT:
      return `${historikk.vurdertAv} vurderte ${historikk.status} for aktivitetskravet`;
    case AktivitetskravStatus.FORHANDSVARSEL:
      return `Det ble sendt et forhåndsvarsel for aktivitetskravet av ${historikk.vurdertAv}`;
    case AktivitetskravStatus.LUKKET:
      return `Vurderingen av aktivitetskravet ble lukket av systemet`;
    case AktivitetskravStatus.AVVENT:
    case AktivitetskravStatus.AUTOMATISK_OPPFYLT:
      throw new Error("Not supported");
  }
};

function getDialogmotekandidatHistorikkText(
  { type, vurdertAv }: DialogmotekandidatHistorikkDTO,
  person: BrukerinfoDTO
) {
  switch (type) {
    case HistorikkType.KANDIDAT:
      return `${person.navn} ble kandidat til dialogmøte`;
    case HistorikkType.UNNTAK:
      return `${vurdertAv} vurderte unntak fra dialogmøte`;
    case HistorikkType.IKKE_AKTUELL:
      return `${vurdertAv} vurderte dialogmøte ikke aktuelt`;
    case HistorikkType.LUKKET:
      return `Kandidat til dialogmøte ble maskinelt lukket`;
  }
}

function createHistorikkEventsFromDialogmotekandidatHistorikk(
  dialogmotekandidatHistorikk: DialogmotekandidatHistorikkDTO[],
  person: BrukerinfoDTO
): HistorikkEvent[] {
  return dialogmotekandidatHistorikk.map((value) => ({
    opprettetAv: value.vurdertAv ?? undefined,
    tekst: getDialogmotekandidatHistorikkText(value, person),
    tidspunkt: value.tidspunkt,
    kilde: "DIALOGMOTEKANDIDAT",
  }));
}

const createHistorikkEventsFromAktivitetskrav = (
  aktivitietskravHistorikkDTO: AktivitetskravHistorikkDTO[],
  person: BrukerinfoDTO
): HistorikkEvent[] => {
  return aktivitietskravHistorikkDTO
    .filter(
      (entry) =>
        entry.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT &&
        entry.status !== AktivitetskravStatus.AVVENT
    )
    .map((entry: AktivitetskravHistorikkDTO) => {
      return {
        opprettetAv: entry.vurdertAv ?? undefined,
        tekst: getTextForHistorikk(entry, person),
        tidspunkt: entry.tidspunkt,
        kilde: "AKTIVITETSKRAV",
      };
    });
};

function arbeidsuforhetText(
  veilederident: string,
  vurderingType: ArbeidsuforhetVurderingType
): string {
  switch (vurderingType) {
    case ArbeidsuforhetVurderingType.FORHANDSVARSEL:
      return veilederident + " sendte forhåndsvarsel";
    case ArbeidsuforhetVurderingType.OPPFYLT:
      return veilederident + " vurderte oppfylt";
    case ArbeidsuforhetVurderingType.AVSLAG:
      return veilederident + " vurderte avslag";
    case ArbeidsuforhetVurderingType.IKKE_AKTUELL:
      return veilederident + " vurderte ikke aktuell";
  }
}

function createHistorikkEventsFromArbeidsuforhet(
  arbeidsuforhetVurderinger: ArbeidsuforhetVurderinger[]
): HistorikkEvent[] {
  return arbeidsuforhetVurderinger.map(
    (vurdering: ArbeidsuforhetVurderinger) => {
      return {
        opprettetAv: vurdering.veilederident,
        tekst: arbeidsuforhetText(vurdering.veilederident, vurdering.type),
        tidspunkt: vurdering.createdAt,
        kilde: "ARBEIDSUFORHET",
      };
    }
  );
}

function manglendemedvirkningText(
  veilederident: string,
  vurderingType: ManglendemedvirkningVurderingType
): string {
  switch (vurderingType) {
    case ManglendemedvirkningVurderingType.FORHANDSVARSEL:
      return veilederident + " sendte forhåndsvarsel";
    case ManglendemedvirkningVurderingType.OPPFYLT:
      return veilederident + " vurderte oppfylt";
    case ManglendemedvirkningVurderingType.STANS:
      return veilederident + " vurderte stans";
    case ManglendemedvirkningVurderingType.UNNTAK:
      return veilederident + " vurderte unntak";
    case ManglendemedvirkningVurderingType.IKKE_AKTUELL:
      return veilederident + " vurderte ikke aktuell";
  }
}

function friskTilArbeidText(vedtak: VedtakResponseDTO): string {
  const fom = tilLesbarDatoMedArUtenManedNavn(vedtak.fom);
  const tom = tilLesbarDatoMedArUtenManedNavn(vedtak.tom);
  return `${vedtak.veilederident} fattet vedtak. Periode: ${fom} - ${tom}`;
}

function createHistorikkEventsFromManglendemedvirkning(
  manglendemedvirkningVurderinger: ManglendemedvirkningVurdering[]
): HistorikkEvent[] {
  return manglendemedvirkningVurderinger.map(
    (vurdering: ManglendemedvirkningVurdering) => {
      return {
        opprettetAv: vurdering.veilederident,
        tekst: manglendemedvirkningText(
          vurdering.veilederident,
          vurdering.vurderingType
        ),
        tidspunkt: vurdering.createdAt,
        kilde: "MANGLENDE_MEDVIRKNING",
      };
    }
  );
}

function createHistorikkEventsFromFriskTilArbeid(
  vedtakList: VedtakResponseDTO[]
): HistorikkEvent[] {
  return vedtakList.map((vedtak: VedtakResponseDTO) => {
    return {
      opprettetAv: vedtak.veilederident,
      tekst: friskTilArbeidText(vedtak),
      tidspunkt: vedtak.createdAt,
      kilde: "FRISKMELDING_TIL_ARBEIDSFORMIDLING",
    };
  });
}

interface HistorikkHook {
  isHistorikkLoading: boolean;
  isHistorikkError: boolean;
  historikkEvents: HistorikkEvent[];
}

export function useHistorikk(): HistorikkHook {
  const { brukerinfo: person } = useBrukerinfoQuery();
  const {
    data: motebehovHistorikk,
    isLoading: isMotebehovLoading,
    isError: isMotebehovError,
  } = useHistorikkMotebehovQuery();
  const {
    data: oppfolgingsplanHistorikk,
    isLoading: isOppfolgingsplanLoading,
    isError: isOppfolgingsplanError,
  } = useHistorikkOppfolgingsplan();
  const {
    isLoading: isLedereLoading,
    isError: isLedereError,
    currentLedere,
    formerLedere,
  } = useLedereQuery();

  const {
    data: aktivitetskravHistorikk,
    isLoading: isAktivitetskravHistorikkLoading,
    isError: isAktivitetskravHistorikkError,
  } = useAktivitetskravHistorikkQuery();

  const {
    data: arbeidsuforhetVurderinger,
    isLoading: isArbeidsuforhetLoading,
    isError: isArbeidsuforhetError,
  } = useGetArbeidsuforhetVurderingerQuery();

  const {
    data: manglendemedvirkningVurderinger,
    isLoading: isManglendemedvirkningLoading,
    isError: isManglendemedvirkningError,
  } = useManglendemedvirkningVurderingQuery();

  const {
    data: vedtak,
    isLoading: isVedtakLoading,
    isError: isVedtakError,
  } = useVedtakQuery();

  const {
    data: dialogmotekandidatHistorikk,
    isLoading: isDialogmotekandidatHistorikkLoading,
    isError: isDialogmotekandidatHistorikkError,
  } = useDialogmotekandidatHistorikk();

  const allLedere = useMemo(
    () => [...currentLedere, ...formerLedere],
    [currentLedere, formerLedere]
  );
  const lederHistorikk = createHistorikkEventsFromLedere(allLedere);
  const aktivitetskravHistorikkEvents = createHistorikkEventsFromAktivitetskrav(
    aktivitetskravHistorikk || [],
    person
  );
  const arbeidsuforhetHistorikk = createHistorikkEventsFromArbeidsuforhet(
    arbeidsuforhetVurderinger
  );
  const manglendemedvirkningHistorikk =
    createHistorikkEventsFromManglendemedvirkning(
      manglendemedvirkningVurderinger
    );
  const frisktilarbeidHistorikk =
    createHistorikkEventsFromFriskTilArbeid(vedtak);
  const dialogmotekandidatHistorikkEvents =
    createHistorikkEventsFromDialogmotekandidatHistorikk(
      dialogmotekandidatHistorikk || [],
      person
    );
  const historikkEvents = motebehovHistorikk
    .concat(oppfolgingsplanHistorikk)
    .concat(lederHistorikk)
    .concat(aktivitetskravHistorikkEvents)
    .concat(arbeidsuforhetHistorikk)
    .concat(manglendemedvirkningHistorikk)
    .concat(frisktilarbeidHistorikk)
    .concat(dialogmotekandidatHistorikkEvents);

  const isHistorikkLoading =
    isOppfolgingsplanLoading ||
    isMotebehovLoading ||
    isLedereLoading ||
    isAktivitetskravHistorikkLoading ||
    isArbeidsuforhetLoading ||
    isManglendemedvirkningLoading ||
    isVedtakLoading ||
    isDialogmotekandidatHistorikkLoading;

  const isHistorikkError =
    isMotebehovError ||
    isOppfolgingsplanError ||
    isLedereError ||
    isAktivitetskravHistorikkError ||
    isArbeidsuforhetError ||
    isManglendemedvirkningError ||
    isVedtakError ||
    isDialogmotekandidatHistorikkError;

  return {
    historikkEvents,
    isHistorikkLoading,
    isHistorikkError,
  };
}
