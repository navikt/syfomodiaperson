import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { CheckmarkCircleIcon, XMarkIcon } from "@navikt/aksel-icons";
import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import dayjs from "dayjs";

const texts = {
  aktivtVedtak: "Aktivt vedtak",
  tidligereVedtak: "Tidligere vedtak",
  gosysOppgaveSendt: "Gosys oppgaven er automatisk sendt til NAY.",
  gosysOppgaveIkkeSendt:
    "Sending av Gosys oppgaven til NAY feilet. Systemet vil forsøke å sende den på nytt i løpet av noen minutter.",
  vedtakJournalfort: "Vedtaket er journalført i Gosys.",
  vedtakIkkeJournalfort:
    "Journalføring av vedtaket feilet. System vil forsøke på nytt i løpet av noen minutter.",
};

function isActiveExistingVedtak(vedtak: VedtakResponseDTO): boolean {
  const vedtakTomDate = dayjs(vedtak.tom);
  const today = dayjs();
  return today.isBefore(vedtakTomDate) || today.isSame(vedtakTomDate, "date");
}

interface Props {
  vedtak: VedtakResponseDTO;
  className?: string;
}

export default function VedtakInfoPanel({ vedtak, className }: Props) {
  const vedtakFattetDate = tilLesbarDatoMedArUtenManedNavn(vedtak.createdAt);
  const vedtakStartDateText = tilLesbarDatoMedArUtenManedNavn(vedtak.fom);
  const vedtakEndDateText = tilLesbarDatoMedArUtenManedNavn(vedtak.tom);

  return (
    <Box
      background="surface-default"
      className={`flex flex-col p-4 gap-2 ${className}`}
    >
      <Heading level="3" size="medium">
        {isActiveExistingVedtak(vedtak)
          ? texts.aktivtVedtak
          : texts.tidligereVedtak}
      </Heading>
      <div>
        <div className="flex flex-row gap-4">
          <BodyShort>
            Start: <b>{vedtakStartDateText}</b>
          </BodyShort>
          <BodyShort>
            Slutt: <b>{vedtakEndDateText}</b>
          </BodyShort>
        </div>
        <BodyShort>
          Vedtaket ble fattet: <b>{vedtakFattetDate}</b>
        </BodyShort>
      </div>
      <div className="flex flex-row gap-2">
        {vedtak.hasGosysOppgave ? (
          <CheckmarkCircleIcon
            data-testid="gosys-icon-true"
            color="green"
            title="a11y-title"
            fontSize="1.5rem"
          />
        ) : (
          <XMarkIcon
            data-testid="gosys-icon-false"
            color="red"
            title="a11y-title"
            fontSize="1.5rem"
          />
        )}
        <BodyShort>
          {vedtak.hasGosysOppgave
            ? texts.gosysOppgaveSendt
            : texts.gosysOppgaveIkkeSendt}
        </BodyShort>
      </div>
      <div className="flex flex-row gap-2">
        {vedtak.isJournalfort ? (
          <CheckmarkCircleIcon
            data-testid="journal-icon-true"
            color="green"
            title="a11y-title"
            fontSize="1.5rem"
          />
        ) : (
          <XMarkIcon
            data-testid="journal-icon-false"
            color="red"
            title="a11y-title"
            fontSize="1.5rem"
          />
        )}
        <BodyShort>
          {vedtak.isJournalfort
            ? texts.vedtakJournalfort
            : texts.vedtakIkkeJournalfort}
        </BodyShort>
      </div>
    </Box>
  );
}
