import React, { ReactElement } from "react";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  Loader,
} from "@navikt/ds-react";
import dayjs from "dayjs";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { useNotification } from "@/context/notification/NotificationContext";
import {
  useVedtakQuery,
  useVilkarForVedtakQuery,
} from "@/data/frisktilarbeid/vedtakQuery";
import ArbeidssokerAlert from "@/sider/frisktilarbeid/ArbeidssokerAlert";

const texts = {
  heading: "Start nytt vedtak",
  nyttVedtak:
    "Her kan du fatte et nytt vedtak for § 8-5 friskmelding til arbeidsformidling. Husk å sjekke at alle nødvendige forutsetninger er oppfylt før ordningen starter.",
  forrigeVedtakInfo: (
    vedtakFattetDato: string,
    vedtakStartText: string,
    vedtakEndText: string
  ) => {
    return `Forrige vedtak på denne personen ble fattet ${vedtakFattetDato}. Perioden for friskmelding til arbeidsformidling ${vedtakStartText} og ${vedtakEndText}.`;
  },
  nyttVedtakKnapp: "Nytt vedtak",
};

export function ForrigeVedtakText({
  vedtak,
}: {
  vedtak: VedtakResponseDTO;
}): ReactElement {
  const hasVedtakStarted = dayjs(vedtak.fom).isBefore(dayjs());
  const hasVedtakEnded = dayjs(vedtak.tom).isBefore(dayjs());
  const vedtakStartDato = tilDatoMedManedNavn(vedtak.fom);
  const vedtakAvsluttetDato = tilDatoMedManedNavn(vedtak.tom);
  const vedtakFattetDato = tilDatoMedManedNavn(vedtak.createdAt);
  const vedtakStartText = hasVedtakStarted
    ? `ble startet: ${vedtakStartDato}`
    : `starter: ${vedtakStartDato}`;
  const vedtakEndText = hasVedtakEnded
    ? `ble avsluttet: ${vedtakAvsluttetDato}`
    : `avsluttes: ${vedtakAvsluttetDato}`;

  return (
    <BodyShort>
      {texts.forrigeVedtakInfo(
        vedtakFattetDato,
        vedtakStartText,
        vedtakEndText
      )}
    </BodyShort>
  );
}

interface Props {
  setIsNyVurderingStarted: (value: boolean) => void;
}

export default function NyttVedtak({ setIsNyVurderingStarted }: Props) {
  const { notification } = useNotification();
  const { data } = useVedtakQuery();
  const { isNotArbeidssoker, isPending } = useVilkarForVedtakQuery();
  const vedtak: VedtakResponseDTO | undefined = data[0];
  const isExistingVedtak = !!vedtak;
  return (
    <>
      {notification && (
        <Alert variant={"success"} className="mb-4">
          {notification.message}
        </Alert>
      )}
      <div className="flex flex-col gap-4">
        <Box
          background="surface-default"
          padding="6"
          className="flex flex-col gap-4"
        >
          <Heading level="2" size="medium">
            {texts.heading}
          </Heading>
          {isExistingVedtak ? (
            <ForrigeVedtakText vedtak={vedtak} />
          ) : (
            <BodyShort>{texts.nyttVedtak}</BodyShort>
          )}
          {isPending ? (
            <Loader size="xlarge" title="Laster inn vilkår for vedtak" />
          ) : (
            <>
              {isNotArbeidssoker && <ArbeidssokerAlert />}
              <Button
                className="w-fit"
                onClick={() => setIsNyVurderingStarted(true)}
                disabled={isNotArbeidssoker}
              >
                {texts.nyttVedtakKnapp}
              </Button>
            </>
          )}
        </Box>
      </div>
    </>
  );
}
