import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { CheckmarkCircleIcon } from "@navikt/aksel-icons";
import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import dayjs from "dayjs";

const texts = {
  aktivtVedtak: "Aktivt vedtak",
  tidligereVedtak: "Tidligere vedtak",
  gosysOppgaveSendt: "Gosys oppgaven er automatisk sendt til NAY.",
  vedtakJournalfort: "Vedtaket er journalført i Gosys.",
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
        <CheckmarkCircleIcon
          color="green"
          title="a11y-title"
          fontSize="1.5rem"
        />
        <BodyShort>{texts.gosysOppgaveSendt}</BodyShort>
      </div>
      <div className="flex flex-row gap-2">
        <CheckmarkCircleIcon
          color="green"
          title="a11y-title"
          fontSize="1.5rem"
        />
        <BodyShort>{texts.vedtakJournalfort}</BodyShort>
      </div>
    </Box>
  );
}
