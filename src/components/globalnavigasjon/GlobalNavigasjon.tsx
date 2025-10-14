import React, { ReactElement, useRef, useState } from "react";
import cn from "classnames";
import UnfinishedTasks from "./UnfinishedTasks";
import { Link } from "react-router-dom";
import { numberOfTasks } from "@/utils/globalNavigasjonUtils";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  useOppfolgingsplanerLPSQuery,
  useOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { toOppfolgingsplanLPSMedPersonoppgave } from "@/utils/oppfolgingsplanerUtils";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { BodyShort, Skeleton, VStack } from "@navikt/ds-react";
import { EventType, logEvent } from "@/utils/amplitude";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

export enum Menypunkter {
  AKTIVITETSKRAV = "AKTIVITETSKRAV",
  BEHANDLERDIALOG = "BEHANDLERDIALOG",
  DIALOGMOTE = "DIALOGMOTE",
  NOKKELINFORMASJON = "NOKKELINFORMASJON",
  SYKMELDINGER = "SYKMELDINGER",
  SYKEPENGESOKNADER = "SYKEPENGESOKNADER",
  OPPFOELGINGSPLANER = "OPPFOELGINGSPLANER",
  HISTORIKK = "HISTORIKK",
  ARBEIDSUFORHET = "ARBEIDSUFORHET",
  FRISKTILARBEID = "FRISKTILARBEID",
  SENOPPFOLGING = "SENOPPFOLGING",
  MANGLENDE_MEDVIRKNING = "MANGLENDE_MEDVIRKNING",
  KARTLEGGINGSSPORSMAL = "KARTLEGGINGSSPORSMAL",
}

type Menypunkt = { navn: string; sti: string };

const allMenypunkter: {
  [key in Menypunkter]: Menypunkt;
} = {
  [Menypunkter.NOKKELINFORMASJON]: {
    navn: "Nøkkelinformasjon",
    sti: "nokkelinformasjon",
  },
  [Menypunkter.SYKMELDINGER]: {
    navn: "Sykmeldinger",
    sti: "sykmeldinger",
  },
  [Menypunkter.SYKEPENGESOKNADER]: {
    navn: "Søknader om sykepenger",
    sti: "sykepengesoknader",
  },
  [Menypunkter.BEHANDLERDIALOG]: {
    navn: "Dialog med behandler",
    sti: "behandlerdialog",
  },
  [Menypunkter.OPPFOELGINGSPLANER]: {
    navn: "Oppfølgingsplaner",
    sti: "oppfoelgingsplaner",
  },
  [Menypunkter.DIALOGMOTE]: {
    navn: "Dialogmøter",
    sti: "moteoversikt",
  },
  [Menypunkter.KARTLEGGINGSSPORSMAL]: {
    navn: "Kartleggingsspørsmål",
    sti: "kartleggingssporsmal",
  },
  [Menypunkter.AKTIVITETSKRAV]: {
    navn: "§ 8-8 Aktivitetskrav",
    sti: "aktivitetskrav",
  },
  [Menypunkter.MANGLENDE_MEDVIRKNING]: {
    navn: "§ 8-8 Manglende medvirkning",
    sti: "manglendemedvirkning",
  },
  [Menypunkter.ARBEIDSUFORHET]: {
    navn: "§ 8-4 Arbeidsuførhet",
    sti: "arbeidsuforhet",
  },
  [Menypunkter.FRISKTILARBEID]: {
    navn: "§ 8-5 Friskmelding til arbeidsformidling",
    sti: "frisktilarbeid",
  },
  [Menypunkter.SENOPPFOLGING]: {
    navn: "Snart slutt på sykepengene",
    sti: "senoppfolging",
  },
  [Menypunkter.HISTORIKK]: {
    navn: "Historikk",
    sti: "historikk",
  },
};

interface Props {
  aktivtMenypunkt: Menypunkter;
}

export function GlobalNavigasjonSkeleton(): ReactElement {
  return (
    <VStack gap="2" className="mb-2">
      {Object.values(Menypunkter).map((_, i) => (
        <Skeleton variant="rectangle" width="100%" height={52} key={i} />
      ))}
    </VStack>
  );
}

export default function GlobalNavigasjon({ aktivtMenypunkt }: Props) {
  const [focusIndex, setFocusIndex] = useState(-1);
  const refs = useRef<HTMLAnchorElement[]>([]);

  const personoppgaver = usePersonoppgaverQuery();
  const oppfolgingsplaner = useOppfolgingsplanerQuery();
  const oppfolgingsplanerLPS = useOppfolgingsplanerLPSQuery();
  const motebehov = useMotebehovQuery();
  const aktivitetskrav = useAktivitetskravQuery();
  const arbeidsuforhetVurderinger = useGetArbeidsuforhetVurderingerQuery();
  const senOppfolgingKandidat = useSenOppfolgingKandidatQuery();
  const friskmeldingTilArbeidsformidlingVedtak = useVedtakQuery();
  const manglendeMedvirkningVurdering = useManglendemedvirkningVurderingQuery();
  const featureToggles = useFeatureToggles();

  const isPending =
    featureToggles.isPending ||
    personoppgaver.isPending ||
    oppfolgingsplaner.isPending ||
    oppfolgingsplanerLPS.isPending ||
    motebehov.isPending ||
    aktivitetskrav.isPending ||
    arbeidsuforhetVurderinger.isPending ||
    senOppfolgingKandidat.isPending ||
    friskmeldingTilArbeidsformidlingVedtak.isPending ||
    manglendeMedvirkningVurdering.isPending;

  const oppfolgingsplanerLPSMedPersonOppgave = oppfolgingsplanerLPS.data.map(
    (oppfolgingsplanLPS) =>
      toOppfolgingsplanLPSMedPersonoppgave(
        oppfolgingsplanLPS,
        personoppgaver.data
      )
  );
  const allMenypunktEntries: [Menypunkter, Menypunkt][] = Object.entries(
    allMenypunkter
  ).map((value) => value as [Menypunkter, Menypunkt]);

  const setFocus = (index: number) => {
    if (refs.current[index]) {
      refs.current[index].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const newFocusIndex = focusIndex + 1;
        if (newFocusIndex === allMenypunktEntries.length) {
          return;
        }
        setFocusIndex(newFocusIndex);
        setFocus(newFocusIndex);
        return;
      }
      case "ArrowUp": {
        e.preventDefault();
        const newFocusIndex = focusIndex - 1;
        if (newFocusIndex === -1) {
          return;
        }
        setFocusIndex(newFocusIndex);
        setFocus(newFocusIndex);
        break;
      }
      default:
        break;
    }
  };
  const handleOnClick = (lenketekst: string, destinasjon: string) => {
    const destinationPath = window.location.href + "/sykefravaer" + destinasjon;
    logEvent({
      type: EventType.Navigation,
      data: {
        lenketekst: lenketekst,
        destinasjon: destinationPath,
      },
    });
  };

  if (isPending) {
    return <GlobalNavigasjonSkeleton />;
  }

  return (
    <ul aria-label="Navigasjon">
      {allMenypunktEntries.map(([menypunkt, { navn, sti }], index) => {
        if (
          !featureToggles.toggles.isKartleggingssporsmalEnabled &&
          menypunkt === Menypunkter.KARTLEGGINGSSPORSMAL
        ) {
          return null;
        }
        const isAktiv = menypunkt === aktivtMenypunkt;
        const className = cn("navigasjonspanel", {
          "navigasjonspanel--aktiv": isAktiv,
        });
        const tasks = numberOfTasks(
          menypunkt,
          motebehov.data,
          oppfolgingsplaner.data,
          personoppgaver.data,
          oppfolgingsplanerLPSMedPersonOppgave,
          aktivitetskrav.data,
          arbeidsuforhetVurderinger.data,
          senOppfolgingKandidat.data,
          friskmeldingTilArbeidsformidlingVedtak.data,
          manglendeMedvirkningVurdering.sisteVurdering
        );

        return (
          <React.Fragment key={index}>
            <li aria-current={isAktiv} className="flex">
              <Link
                ref={(instance) => {
                  if (instance) {
                    refs.current[index] = instance;
                  }
                }}
                className={`flex justify-between ${className}`}
                to={`/sykefravaer/${sti}`}
                onFocus={() => {
                  setFocusIndex(index);
                }}
                onClick={() => handleOnClick(navn, sti)}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
              >
                <BodyShort size="small">{navn}</BodyShort>
                {tasks > 0 && (
                  <UnfinishedTasks tasks={tasks} menypunkt={menypunkt} />
                )}
              </Link>
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
}
