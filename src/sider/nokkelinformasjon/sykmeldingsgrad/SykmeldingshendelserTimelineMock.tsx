import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  BellIcon,
  CheckmarkCircleFillIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FilesIcon,
  FirstAidKitIcon,
  PaperplaneIcon,
  PersonIcon,
  PersonPencilIcon,
  PersonSuitIcon,
} from "@navikt/aksel-icons";
import {
  BodyShort,
  Button,
  HStack,
  Spacer,
  Timeline,
  ToggleGroup,
} from "@navikt/ds-react";
import { ReactNode, useEffect, useState } from "react";

const texts = {
  empty: "Velg et oppfolgingstilfelle for a se hendelser i tidslinjen.",
  start: "Start oppfolgingstilfelle",
  end: "Slutt oppfolgingstilfelle",
  sykmeldingDescription: "Sykmelding",
  previousPeriod: "Forrige periode",
  nextPeriod: "Neste periode",
};

const timelineRows = [
  { key: "sykmeldt", label: "Sykmeldt", icon: <PersonIcon aria-hidden /> },
  {
    key: "behandler",
    label: "Behandler",
    icon: <FirstAidKitIcon aria-hidden />,
  },
  {
    key: "arbeidsgiver",
    label: "Arbeidsgiver",
    icon: <PersonSuitIcon aria-hidden />,
  },
  {
    key: "veileder",
    label: "Veileder",
    icon: <PersonPencilIcon aria-hidden />,
  },
] as const;

type TimelineRowKey = (typeof timelineRows)[number]["key"];

interface TimelineEventTemplate {
  id: string;
  row: TimelineRowKey;
  label: string;
  description: string;
  offsetPercent: number;
  status: "success" | "warning" | "danger" | "info" | "neutral";
  icon: ReactNode;
}

interface TimelineEvent {
  id: string;
  row: TimelineRowKey;
  label: string;
  description: string;
  date: Date;
  status: "success" | "warning" | "danger" | "info" | "neutral";
  icon: ReactNode;
}

const eventTemplates: TimelineEventTemplate[] = [
  {
    id: "oppfolgingsplan",
    row: "arbeidsgiver",
    label: "Oppfolgingsplan sendt",
    description: "Arbeidsgiver sendte oppfolgingsplan",
    offsetPercent: 0.2,
    status: "success",
    icon: <PaperplaneIcon aria-hidden />,
  },
  {
    id: "dialogmelding",
    row: "behandler",
    label: "Dialogmelding",
    description: "Dialogmelding fra behandler",
    offsetPercent: 0.36,
    status: "warning",
    icon: <BellIcon aria-hidden />,
  },
  {
    id: "dialogmote-innkalling",
    row: "veileder",
    label: "Dialogmote innkalling",
    description: "Veileder sendte innkalling til dialogmote",
    offsetPercent: 0.52,
    status: "info",
    icon: <ClockIcon aria-hidden />,
  },
  {
    id: "dialogmote-gjennomfort",
    row: "veileder",
    label: "Dialogmote gjennomfort",
    description: "Dialogmote gjennomfort med aktorer",
    offsetPercent: 0.62,
    status: "neutral",
    icon: <CheckmarkCircleFillIcon aria-hidden />,
  },
  {
    id: "vedtak",
    row: "veileder",
    label: "Vedtak",
    description: "Vedtak om videre oppfolging",
    offsetPercent: 0.85,
    status: "danger",
    icon: <FilesIcon aria-hidden />,
  },
];

interface Props {
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
  sykmeldingsperioder: SykmeldingPeriodeDTO[];
}

type WindowDirection = "previous" | "next" | "current";

type WindowSize = "last-month" | "last-three-months" | "entire";

interface TimelineWindow {
  start: Date;
  end: Date;
}

function subtractMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function clampWindowToOppfolgingstilfelle(
  window: TimelineWindow,
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO,
  visibleMonths: number,
): TimelineWindow {
  const periodStart = selectedOppfolgingstilfelle.start;
  const periodEnd = selectedOppfolgingstilfelle.end;

  if (window.start < periodStart) {
    const start = periodStart;
    const projectedEnd = addMonths(start, visibleMonths);
    const end = projectedEnd > periodEnd ? periodEnd : projectedEnd;
    return { start, end };
  }

  if (window.end > periodEnd) {
    const end = periodEnd;
    const projectedStart = subtractMonths(end, visibleMonths);
    const start = projectedStart < periodStart ? periodStart : projectedStart;
    return { start, end };
  }

  return window;
}

function getWindowForSize(
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO,
  windowSize: WindowSize,
): TimelineWindow {
  if (windowSize === "entire") {
    return {
      start: selectedOppfolgingstilfelle.start,
      end: selectedOppfolgingstilfelle.end,
    };
  }

  const visibleMonths = windowSize === "last-month" ? 1 : 3;
  return clampWindowToOppfolgingstilfelle(
    {
      start: subtractMonths(selectedOppfolgingstilfelle.end, visibleMonths),
      end: selectedOppfolgingstilfelle.end,
    },
    selectedOppfolgingstilfelle,
    visibleMonths,
  );
}

function getUpdatedWindow(
  direction: WindowDirection,
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO,
  currentWindow: TimelineWindow,
  windowSize: WindowSize,
): TimelineWindow {
  if (windowSize === "entire" || direction === "current") {
    return getWindowForSize(selectedOppfolgingstilfelle, windowSize);
  }

  const visibleMonths = windowSize === "last-month" ? 1 : 3;
  const moveMonths = visibleMonths * 0.5;
  const delta = direction === "previous" ? -moveMonths : moveMonths;

  return clampWindowToOppfolgingstilfelle(
    {
      start: addMonths(currentWindow.start, delta),
      end: addMonths(currentWindow.end, delta),
    },
    selectedOppfolgingstilfelle,
    visibleMonths,
  );
}

function mapEventsToOppfolgingstilfelle(
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO,
): TimelineEvent[] {
  const start = new Date(selectedOppfolgingstilfelle.start).getTime();
  const end = new Date(selectedOppfolgingstilfelle.end).getTime();
  const duration = Math.max(end - start, 0);

  return eventTemplates.map((event) => {
    const date = new Date(start + Math.round(duration * event.offsetPercent));
    return {
      id: event.id,
      row: event.row,
      label: event.label,
      description: event.description,
      date,
      status: event.status,
      icon: event.icon,
    };
  });
}

function groupEventsByRow(events: TimelineEvent[]) {
  return timelineRows.reduce<Record<TimelineRowKey, TimelineEvent[]>>(
    (acc, row) => {
      acc[row.key] = events.filter((event) => event.row === row.key);
      return acc;
    },
    {
      sykmeldt: [],
      behandler: [],
      arbeidsgiver: [],
      veileder: [],
    },
  );
}

export default function SykmeldingshendelserTimelineMock({
  selectedOppfolgingstilfelle,
  sykmeldingsperioder,
}: Props) {
  const [windowSize, setWindowSize] = useState<WindowSize>("entire");
  const [currentWindow, setCurrentWindow] = useState<
    TimelineWindow | undefined
  >(undefined);

  useEffect(() => {
    if (!selectedOppfolgingstilfelle) {
      setCurrentWindow(undefined);
      return;
    }

    setCurrentWindow(getWindowForSize(selectedOppfolgingstilfelle, windowSize));
  }, [selectedOppfolgingstilfelle, windowSize]);

  if (!selectedOppfolgingstilfelle) {
    return (
      <BodyShort size="small" className="mt-4">
        {texts.empty}
      </BodyShort>
    );
  }

  const events = mapEventsToOppfolgingstilfelle(selectedOppfolgingstilfelle);
  const eventsByRow = groupEventsByRow(events);
  const timelineWindow =
    currentWindow ?? getWindowForSize(selectedOppfolgingstilfelle, windowSize);

  return (
    <div className="pr-8">
      <HStack
        gap="space-8"
        align="center"
        aria-controls="timeline-dynamic"
        id="timeline-toolbar"
        className="mt-4"
      >
        <Spacer />
        <HStack gap="space-2" align="center">
          <Button
            data-color="neutral"
            icon={<ChevronLeftIcon aria-hidden />}
            variant="secondary"
            size="small"
            aria-label={texts.previousPeriod}
            disabled={windowSize === "entire"}
            onClick={() => {
              setCurrentWindow((window) => {
                const effectiveWindow =
                  window ??
                  getWindowForSize(selectedOppfolgingstilfelle, windowSize);

                return getUpdatedWindow(
                  "previous",
                  selectedOppfolgingstilfelle,
                  effectiveWindow,
                  windowSize,
                );
              });
            }}
          />
          <Button
            data-color="neutral"
            icon={<ChevronRightIcon aria-hidden />}
            variant="secondary"
            size="small"
            aria-label={texts.nextPeriod}
            disabled={windowSize === "entire"}
            onClick={() => {
              setCurrentWindow((window) => {
                const effectiveWindow =
                  window ??
                  getWindowForSize(selectedOppfolgingstilfelle, windowSize);

                return getUpdatedWindow(
                  "next",
                  selectedOppfolgingstilfelle,
                  effectiveWindow,
                  windowSize,
                );
              });
            }}
          />
        </HStack>
        <ToggleGroup
          data-color="neutral"
          size="small"
          value={windowSize}
          onChange={(value) => {
            const nextWindowSize = value as WindowSize;
            setWindowSize(nextWindowSize);
            setCurrentWindow(
              getUpdatedWindow(
                "current",
                selectedOppfolgingstilfelle,
                timelineWindow,
                nextWindowSize,
              ),
            );
          }}
        >
          <ToggleGroup.Item value="last-month" label="Siste måned" />
          <ToggleGroup.Item
            value="last-three-months"
            label="Siste tre måneder"
          />
          <ToggleGroup.Item value="entire" label="Hele perioden" />
        </ToggleGroup>
      </HStack>

      <Timeline
        startDate={timelineWindow.start}
        endDate={timelineWindow.end}
        id="timeline-dynamic"
        aria-controls="timeline-toolbar"
        className="mt-4"
      >
        {timelineRows.map((row) => (
          <Timeline.Row key={row.key} label={row.label} icon={row.icon}>
            {row.key === "sykmeldt" &&
              sykmeldingsperioder.map((sykmeldingsperiode, index) => (
                <Timeline.Period
                  key={`${sykmeldingsperiode.fom.toISOString()}-${sykmeldingsperiode.tom.toISOString()}-${index}`}
                  start={sykmeldingsperiode.fom}
                  end={sykmeldingsperiode.tom}
                  status="info"
                  statusLabel={texts.sykmeldingDescription}
                  icon={<FirstAidKitIcon aria-hidden />}
                >
                  <BodyShort size="small">
                    {texts.sykmeldingDescription}
                  </BodyShort>
                  <BodyShort size="small">
                    {sykmeldingsperiode.grad ?? 100}% sykmeldingsgrad
                  </BodyShort>
                </Timeline.Period>
              ))}
            {eventsByRow[row.key].map((event) => (
              <Timeline.Period
                key={event.id}
                start={event.date}
                end={event.date}
                status={event.status}
                statusLabel={event.label}
                icon={event.icon}
              >
                <BodyShort size="small">{event.label}</BodyShort>
                <BodyShort size="small">{event.description}</BodyShort>
              </Timeline.Period>
            ))}
          </Timeline.Row>
        ))}

        <Timeline.Pin date={selectedOppfolgingstilfelle.start}>
          {texts.start}
        </Timeline.Pin>
        <Timeline.Pin date={selectedOppfolgingstilfelle.end}>
          {texts.end}
        </Timeline.Pin>
      </Timeline>
    </div>
  );
}
