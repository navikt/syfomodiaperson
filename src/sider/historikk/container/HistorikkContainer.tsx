import React, { ReactElement, useMemo } from "react";
import Side from "../../Side";
import SideLaster from "../../../components/SideLaster";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useHistorikk } from "@/data/historikk/historikk_hooks";
import Sidetopp from "../../../components/Sidetopp";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import {
  AktivitetskravHistorikkDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { useAktivitetskravHistorikkQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  VurderingResponseDTO as ArbeidsuforhetVurderinger,
  VurderingType as ArbeidsuforhetVurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { Historikk } from "@/sider/historikk/Historikk";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import {
  VurderingResponseDTO as ManglendemedvirkningVurdering,
  VurderingType as ManglendemedvirkningVurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { Infomelding } from "@/components/Infomelding";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

const texts = {
  topp: "Logg",
  pageTitle: "Historikk",
  errorTitle: "Du har ikke tilgang til denne tjenesten",
  ingenHistorikk: {
    tittel: "Denne personen har ingen oppfølgingshistorikk",
    melding:
      "Når en sykmeldt blir fulgt opp så vil oppfølgingen bli loggført her slik at du får oversikt over hva som har skjedd og hvem som har vært involvert i oppfølgingen.",
  },
};

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

export const HistorikkContainer = (): ReactElement => {
  const { brukerinfo: person } = useBrukerinfoQuery();
  const {
    henterHistorikk,
    hentingHistorikkFeilet,
    motebehovHistorikk,
    oppfolgingsplanHistorikk,
  } = useHistorikk();

  const {
    isLoading: henterLedere,
    isError: hentingLedereFeilet,
    currentLedere,
    formerLedere,
  } = useLedereQuery();

  const {
    tilfellerDescendingStart,
    isLoading: henterTilfeller,
    isError: hentingTilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  const {
    data: aktivitetskravHistorikk,
    isLoading: henterAktivitetskravHistorikk,
    isError: hentingAktivitetskravHistorikkFeilet,
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

  const henter =
    henterLedere ||
    henterHistorikk ||
    henterTilfeller ||
    henterAktivitetskravHistorikk ||
    isArbeidsuforhetLoading ||
    isManglendemedvirkningLoading ||
    isVedtakLoading;
  const hentingFeilet =
    hentingLedereFeilet ||
    hentingHistorikkFeilet ||
    hentingTilfellerFeilet ||
    hentingAktivitetskravHistorikkFeilet ||
    isArbeidsuforhetError ||
    isManglendemedvirkningError ||
    isVedtakError;

  const allLedere = useMemo(
    () => [...currentLedere, ...formerLedere],
    [currentLedere, formerLedere]
  );

  const tilfeller = tilfellerDescendingStart || [];
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
  const historikkEvents = motebehovHistorikk
    .concat(oppfolgingsplanHistorikk)
    .concat(lederHistorikk)
    .concat(aktivitetskravHistorikkEvents)
    .concat(arbeidsuforhetHistorikk)
    .concat(manglendemedvirkningHistorikk)
    .concat(frisktilarbeidHistorikk);

  const ingenHistorikk = tilfeller.length === 0 || historikkEvents.length === 0;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.HISTORIKK}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.topp} />
        {ingenHistorikk ? (
          <Infomelding
            tittel={texts.ingenHistorikk.tittel}
            melding={texts.ingenHistorikk.melding}
          />
        ) : (
          <Historikk historikkEvents={historikkEvents} tilfeller={tilfeller} />
        )}
      </SideLaster>
    </Side>
  );
};

export default HistorikkContainer;
