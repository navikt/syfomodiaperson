import React, { ReactElement } from "react";
import dayjs from "dayjs";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort, Box, Heading, Tag } from "@navikt/ds-react";
import { tittelFromSoknadstype } from "@/utils/sykepengesoknadUtils";

const texts = {
  kanFyllesUtFra: (dato: string) => `Kan fylles ut av sykmeldt fra ${dato}`,
  gjelderPerioden: (periode: string) => `Gjelder perioden ${periode}`,
};

function textSoknadStatus(status: Soknadstatus): string | undefined {
  switch (status) {
    case Soknadstatus.FREMTIDIG:
      return "Planlagt";
    case Soknadstatus.TIL_SENDING:
      return "Sender...";
    case Soknadstatus.UTKAST_TIL_KORRIGERING:
      return "Utkast til endring";
  }
}

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function PlanlagtSoknad({ soknad }: Props): ReactElement {
  const soknadTomDato = tilLesbarDatoMedArstall(
    dayjs(soknad.tom).add(1, "days").toDate()
  );
  const soknadStatusText = textSoknadStatus(soknad.status);

  return (
    <Box
      background="surface-default"
      className="flex flex-col p-4 mt-2 mb-2 gap-2"
    >
      <div className="flex flex-row justify-between">
        {soknadTomDato && (
          <BodyShort size="small">
            {texts.kanFyllesUtFra(soknadTomDato)}
          </BodyShort>
        )}
        {soknadStatusText && (
          <Tag size="small" variant="info" className="w-fit">
            {soknadStatusText}
          </Tag>
        )}
      </div>
      <Heading size="xsmall">
        {tittelFromSoknadstype(soknad.soknadstype)}
      </Heading>
      {soknad.arbeidsgiver && (
        <BodyShort size="small">{soknad.arbeidsgiver.navn}</BodyShort>
      )}
      <BodyShort size="small">
        {texts.gjelderPerioden(
          tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom)
        )}
      </BodyShort>
    </Box>
  );
}
