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
import KanIkkeFatteNyttVedtakAlert from "@/sider/frisktilarbeid/KanIkkeFatteNyttVedtakAlert";

const texts = {
  heading: {
    startNytt: "Start nytt vedtak",
    aktivtVedtak: "Aktivt vedtak",
  },
  nyttVedtak:
    "Her kan du fatte et nytt vedtak for § 8-5 friskmelding til arbeidsformidling. Husk å sjekke at alle nødvendige forutsetninger er oppfylt før ordningen starter.",
  forrigeVedtakInfo: (
    vedtakFattetDato: string,
    vedtakStartText: string,
    vedtakEndText: string
  ) => {
    return `Forrige vedtak på denne personen ble fattet ${vedtakFattetDato}. Perioden for friskmelding til arbeidsformidling ${vedtakStartText} og ${vedtakEndText}.`;
  },
  vedtakFattet: "Vedtak fattet:",
  vedtakStartet: "Startet:",
  vedtakAvsluttes: "Avsluttes:",
  nyttVedtakKnapp: "Nytt vedtak",
};

function ForrigeVedtakText({
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

function isActiveExistingVedtak(vedtak: VedtakResponseDTO): boolean {
  const vedtakTomDate = dayjs(vedtak.tom);
  const today = dayjs();
  return today.isBefore(vedtakTomDate) || today.isSame(vedtakTomDate, "date");
}

function AktivtVedtakInfo({ vedtak }: { vedtak: VedtakResponseDTO }) {
  return (
    <div>
      <BodyShort>
        {`${texts.vedtakFattet} ${tilDatoMedManedNavn(vedtak.createdAt)}`}
      </BodyShort>
      <div className="flex flex-row gap-4">
        <BodyShort>
          {`${texts.vedtakStartet} ${tilDatoMedManedNavn(vedtak.fom)}`}
        </BodyShort>
        <BodyShort>
          {`${texts.vedtakAvsluttes} ${tilDatoMedManedNavn(vedtak.tom)}`}
        </BodyShort>
      </div>
    </div>
  );
}

interface Props {
  setIsNyVurderingStarted: (value: boolean) => void;
}

export default function NyttVedtak({ setIsNyVurderingStarted }: Props) {
  const { notification } = useNotification();
  const { data } = useVedtakQuery();
  const { isRegisteredArbeidssoker, isPending } = useVilkarForVedtakQuery();
  const vedtak: VedtakResponseDTO | undefined = data[0];
  const isExistingVedtak = !!vedtak;
  const isActiveVedtak = isExistingVedtak && isActiveExistingVedtak(vedtak);
  const kanFatteNyttVedtak = !isActiveVedtak && !!isRegisteredArbeidssoker;

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
            {isActiveVedtak
              ? texts.heading.aktivtVedtak
              : texts.heading.startNytt}
          </Heading>
          {isExistingVedtak ? (
            isActiveVedtak ? (
              <AktivtVedtakInfo vedtak={vedtak} />
            ) : (
              <ForrigeVedtakText vedtak={vedtak} />
            )
          ) : (
            <BodyShort>{texts.nyttVedtak}</BodyShort>
          )}
          {isPending ? (
            <Loader size="xlarge" title="Laster inn vilkår for vedtak" />
          ) : (
            <>
              {!kanFatteNyttVedtak && (
                <KanIkkeFatteNyttVedtakAlert
                  isActiveVedtak={isActiveVedtak}
                  isRegisteredArbeidssoker={!!isRegisteredArbeidssoker}
                />
              )}
              <Button
                className="w-fit"
                onClick={() => setIsNyVurderingStarted(true)}
                disabled={!kanFatteNyttVedtak}
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
