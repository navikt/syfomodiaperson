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
import { Infomelding } from "@/components/Infomelding";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { Historikk } from "@/sider/historikk/Historikk";

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
  vurderingType: VurderingType
): string {
  switch (vurderingType) {
    case VurderingType.FORHANDSVARSEL:
      return veilederident + " sendte forhåndsvarsel";
    case VurderingType.OPPFYLT:
      return veilederident + " vurderte oppfylt";
    case VurderingType.AVSLAG:
      return veilederident + " vurderte avslag";
    case VurderingType.IKKE_AKTUELL:
      return veilederident + " vurderte ikke aktuell";
  }
}

function createHistorikkEventsFromArbeidsuforhet(
  arbeidsuforhetVurderinger: VurderingResponseDTO[]
): HistorikkEvent[] {
  return arbeidsuforhetVurderinger.map((vurdering: VurderingResponseDTO) => {
    return {
      opprettetAv: vurdering.veilederident,
      tekst: arbeidsuforhetText(vurdering.veilederident, vurdering.type),
      tidspunkt: vurdering.createdAt,
      kilde: "ARBEIDSUFORHET",
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

  const henter =
    henterLedere ||
    henterHistorikk ||
    henterTilfeller ||
    henterAktivitetskravHistorikk ||
    isArbeidsuforhetLoading;
  const hentingFeilet =
    hentingLedereFeilet ||
    hentingHistorikkFeilet ||
    hentingTilfellerFeilet ||
    hentingAktivitetskravHistorikkFeilet ||
    isArbeidsuforhetError;

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
  const historikkEvents = motebehovHistorikk
    .concat(oppfolgingsplanHistorikk)
    .concat(lederHistorikk)
    .concat(aktivitetskravHistorikkEvents)
    .concat(arbeidsuforhetHistorikk);
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
