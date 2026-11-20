import {
  BodyShort,
  Box,
  Heading,
  HStack,
  InfoCard,
  LocalAlert,
} from "@navikt/ds-react";
import { formatNumericDate } from "@/utils/datoUtils";
import { ClockIcon, InformationSquareIcon } from "@navikt/aksel-icons";
import ManglendeMedvirkningButtons from "@/sider/manglendemedvirkning/ManglendeMedvirkningButtons";
import { VurderingResponseDTO } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import SupportingTextList from "@/sider/manglendemedvirkning/forhandsvarsel/SupportingTextList";
import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  title: "Venter på svar fra bruker",
  sentAlert: {
    isSent: (sentDate: Date) =>
      `Forhåndsvarselet er sendt ${formatNumericDate(sentDate)}`,
    oversikten:
      "Personen ligger nå i oversikten og kan finnes under filteret for § 8-8 manglende medvirkning.",
  },
  ikkeStans: "Du kan ikke stanse før fristen i forhåndsvarselet er gått ut.",
  frist: "Fristen går ut: ",
  seSendtVarsel: "Se sendt varsel",
};

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export default function ForhandsvarselBeforeDeadline({
  forhandsvarsel,
}: Props) {
  const frist = forhandsvarsel.varsel?.svarfrist;
  const { notification, setNotification } = useNotification();

  return (
    <Box>
      {notification && (
        <LocalAlert status="success" size="small" className="mb-2">
          <LocalAlert.Header>
            <LocalAlert.Title>{notification.message}</LocalAlert.Title>
            <LocalAlert.CloseButton
              onClick={() => setNotification(undefined)}
            />
          </LocalAlert.Header>
        </LocalAlert>
      )}
      <InfoCard data-color="info" size="small" className="mb-2">
        <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
          <InfoCard.Title>
            {texts.sentAlert.isSent(forhandsvarsel.createdAt)}
          </InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>{texts.sentAlert.oversikten}</InfoCard.Content>
      </InfoCard>
      <Box
        background="default"
        padding="space-24"
        className="flex flex-col gap-4"
      >
        <HStack align="center">
          <Heading level="2" size="medium">
            {texts.title}
          </Heading>
          <Box className="flex ml-auto mr-2 gap-1">
            <BodyShort weight="semibold">{texts.frist}</BodyShort>
            <BodyShort>{formatNumericDate(frist)}</BodyShort>
          </Box>
          <ClockIcon title="klokkeikon" fontSize="2em" />
        </HStack>
        <BodyShort>{texts.ikkeStans}</BodyShort>
        <SupportingTextList isBeforeForhandsvarselDeadline={true} />
        <ManglendeMedvirkningButtons isBeforeForhandsvarselDeadline={true} />
      </Box>
    </Box>
  );
}
