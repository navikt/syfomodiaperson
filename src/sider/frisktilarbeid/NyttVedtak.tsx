import React, { useState } from "react";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  Loader,
} from "@navikt/ds-react";
import dayjs from "dayjs";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { useNotification } from "@/context/notification/NotificationContext";
import {
  useVedtakQuery,
  useVilkarForVedtakQuery,
} from "@/data/frisktilarbeid/vedtakQuery";
import KanIkkeFatteNyttVedtakAlert from "@/sider/frisktilarbeid/KanIkkeFatteNyttVedtakAlert";
import VedtakInfoPanel from "@/sider/frisktilarbeid/VedtakInfoPanel";

const texts = {
  startNyttVedtak: "Start nytt vedtak",
  nyttVedtak:
    "Her kan du fatte et nytt vedtak for § 8-5 friskmelding til arbeidsformidling. Husk å sjekke at alle nødvendige forutsetninger er oppfylt før ordningen starter.",
  nyttVedtakKnapp: "Nytt vedtak",
};

function isActiveExistingVedtak(vedtak: VedtakResponseDTO): boolean {
  const vedtakTomDate = dayjs(vedtak.tom);
  const today = dayjs();
  return today.isBefore(vedtakTomDate) || today.isSame(vedtakTomDate, "date");
}

interface Props {
  setIsNyVurderingStarted: (value: boolean) => void;
}

export default function NyttVedtak({ setIsNyVurderingStarted }: Props) {
  const { notification } = useNotification();
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);
  const { data } = useVedtakQuery();
  const { isRegisteredArbeidssoker, isPending } = useVilkarForVedtakQuery();
  const vedtak: VedtakResponseDTO | undefined = data[0];
  const isExistingVedtak = !!vedtak;
  const isActiveVedtak = isExistingVedtak && isActiveExistingVedtak(vedtak);
  const kanFatteNyttVedtak = !isActiveVedtak && !!isRegisteredArbeidssoker;

  return (
    <>
      {notification && isNotificationVisible && (
        <Alert
          variant={"success"}
          className="mb-4"
          closeButton
          onClose={() => setIsNotificationVisible(false)}
        >
          {notification.message}
        </Alert>
      )}
      {isExistingVedtak && <VedtakInfoPanel vedtak={vedtak} className="mb-2" />}
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4"
      >
        <Heading level="3" size="medium">
          {texts.startNyttVedtak}
        </Heading>
        {!isActiveVedtak && <BodyShort>{texts.nyttVedtak}</BodyShort>}
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
    </>
  );
}
