import { Fragment, ReactElement } from "react";
import UnfinishedTasks from "./UnfinishedTasks";
import { numberOfTasks } from "@/utils/globalNavigasjonUtils";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { toOppfolgingsplanLPSMedPersonoppgave } from "@/utils/oppfolgingsplanerUtils";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { BodyShort, Box, Button, Skeleton } from "@navikt/ds-react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { useKartleggingssporsmalKandidaterQuery } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import { useOppfolgingsplaner } from "@/sider/oppfolgingsplan/hooks/useOppfolgingsplaner";
import { ToggleNames } from "@/data/unleash/unleash_types.ts";
import { Link } from "react-router-dom";

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
  UTENLANDSOPPHOLD = "UTENLANDSOPPHOLD",
  SENOPPFOLGING = "SENOPPFOLGING",
  MANGLENDE_MEDVIRKNING = "MANGLENDE_MEDVIRKNING",
  TIDLIG_OPPFOLGING = "TIDLIG_OPPFOLGING",
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
  [Menypunkter.TIDLIG_OPPFOLGING]: {
    navn: "Tidlig oppfølging",
    sti: "tidlig-oppfolging",
  },
  [Menypunkter.DIALOGMOTE]: {
    navn: "Dialogmøter",
    sti: "moteoversikt",
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
  [Menypunkter.UTENLANDSOPPHOLD]: {
    navn: "§ 8-9 Søknad om utenlandsopphold",
    sti: "utenlandsopphold",
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

const activeMenypunktWithToggle: [keyof typeof ToggleNames, Menypunkter][] = [
  ["isKartleggingssporsmalEnabled", Menypunkter.TIDLIG_OPPFOLGING],
  ["isUtenlandsoppholdEnabled", Menypunkter.UTENLANDSOPPHOLD],
];

interface Props {
  aktivtMenypunkt: Menypunkter;
}

export function GlobalNavigasjonSkeleton(): ReactElement {
  return <Skeleton variant="rectangle" height={800} />;
}

export default function GlobalNavigasjon({ aktivtMenypunkt }: Props) {
  const personoppgaver = usePersonoppgaverQuery();
  const { aktivePlanerV2, lpsPlaner } = useOppfolgingsplaner();
  const motebehov = useMotebehovQuery();
  const aktivitetskrav = useAktivitetskravQuery();
  const arbeidsuforhetVurderinger = useGetArbeidsuforhetVurderingerQuery();
  const senOppfolgingKandidat = useSenOppfolgingKandidatQuery();
  const friskmeldingTilArbeidsformidlingVedtak = useVedtakQuery();
  const manglendeMedvirkningVurdering = useManglendemedvirkningVurderingQuery();
  const kartleggingssporsmalKandidat = useKartleggingssporsmalKandidaterQuery();
  const featureToggles = useFeatureToggles();

  const isPending = featureToggles.isPending;

  const oppfolgingsplanerLPSMedPersonOppgave = lpsPlaner.map(
    (oppfolgingsplanLPS) =>
      toOppfolgingsplanLPSMedPersonoppgave(
        oppfolgingsplanLPS,
        personoppgaver.data,
      ),
  );

  const allMenypunktEntries = (
    Object.entries(allMenypunkter) as [Menypunkter, Menypunkt][]
  ).filter(([menypunkt]) =>
    activeMenypunktWithToggle.every(
      ([toggleName, activeMenypunkt]) =>
        activeMenypunkt !== menypunkt || featureToggles.toggles[toggleName],
    ),
  );

  if (isPending) {
    return <GlobalNavigasjonSkeleton />;
  }

  return (
    <Box background="default" className="p-2 mb-2">
      <nav className="space-y-1">
        {allMenypunktEntries.map(([menypunkt, { navn, sti }], index) => {
          const isAktiv = menypunkt === aktivtMenypunkt;
          const tasks = numberOfTasks(
            menypunkt,
            motebehov.data,
            personoppgaver.data,
            oppfolgingsplanerLPSMedPersonOppgave,
            aktivitetskrav.data,
            arbeidsuforhetVurderinger.data,
            senOppfolgingKandidat.data,
            friskmeldingTilArbeidsformidlingVedtak.data,
            manglendeMedvirkningVurdering.sisteVurdering,
            kartleggingssporsmalKandidat.data,
            aktivePlanerV2.length,
          );

          return (
            <Fragment key={menypunkt}>
              <Button
                as={Link}
                size="small"
                variant={isAktiv ? "primary" : "tertiary-neutral"}
                to={`/sykefravaer/${sti}`}
                className="w-full justify-between"
                icon={
                  tasks > 0 && (
                    <UnfinishedTasks tasks={tasks} menypunkt={menypunkt} />
                  )
                }
                iconPosition="right"
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
                aria-current={isAktiv}
              >
                <BodyShort size="small" className="text-left">
                  {navn}
                </BodyShort>
              </Button>
              {index < allMenypunktEntries.length - 1 && (
                <div aria-hidden className="h-px w-full bg-ax-neutral-400" />
              )}
            </Fragment>
          );
        })}
      </nav>
    </Box>
  );
}
